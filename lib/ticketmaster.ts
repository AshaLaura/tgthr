import { cache } from 'react'

// ── Public types ──────────────────────────────────────────────────────────────

export interface TmEvent {
  name: string
  date: string
  venue: string
  category: string
  url: string
  imageUrl: string
  priceMin?: number
  priceMax?: number
}

export interface SearchEventsParams {
  keyword?: string
  /** "lat,lon" e.g. "37.7749,-122.4194" */
  latlong?: string
  /** Miles radius around latlong */
  radius?: number
  /** ISO date string e.g. "2026-04-25" */
  startDate?: string
  endDate?: string
}

// ── Raw API shapes (minimal) ──────────────────────────────────────────────────

interface TmClassification {
  segment?: { name: string }
  genre?: { name: string }
  subGenre?: { name: string }
}

interface TmImage {
  url: string
  ratio?: string
  width?: number
}

interface TmRawEvent {
  name: string
  url?: string
  images?: TmImage[]
  dates?: {
    start?: {
      dateTime?: string
      localDate?: string
    }
  }
  classifications?: TmClassification[]
  priceRanges?: Array<{ type: string; currency: string; min: number; max: number }>
  _embedded?: {
    venues?: Array<{
      name?: string
      city?: { name: string }
    }>
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2'

// Only Music and Sports pass through as full segments; for Arts & Theatre we
// require the Comedy genre/sub-genre to avoid noise from unrelated events.
const PASS_THROUGH_SEGMENTS = new Set(['Music', 'Sports'])

// ── Helpers ───────────────────────────────────────────────────────────────────

function isAllowed(event: TmRawEvent): boolean {
  const classifications = event.classifications ?? []
  return classifications.some((c) => {
    const segment = c.segment?.name ?? ''
    if (PASS_THROUGH_SEGMENTS.has(segment)) return true
    if (segment === 'Arts & Theatre') {
      const genre = c.genre?.name ?? ''
      const subGenre = c.subGenre?.name ?? ''
      return genre === 'Comedy' || subGenre === 'Comedy'
    }
    return false
  })
}

function normalize(event: TmRawEvent): TmEvent {
  const venue = event._embedded?.venues?.[0]
  const classification = event.classifications?.[0]
  const image =
    event.images?.find((img) => img.ratio === '16_9' && (img.width ?? 0) > 500) ??
    event.images?.[0]

  const priceRange = event.priceRanges?.find((p) => p.type === 'standard') ?? event.priceRanges?.[0]

  return {
    name: event.name,
    date: event.dates?.start?.dateTime ?? event.dates?.start?.localDate ?? '',
    venue: [venue?.name, venue?.city?.name].filter(Boolean).join(', '),
    category: classification?.segment?.name ?? '',
    url: event.url ?? '',
    imageUrl: image?.url ?? '',
    ...(priceRange != null && { priceMin: priceRange.min, priceMax: priceRange.max }),
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

// `cache()` deduplicates identical calls within a single React render pass
// (i.e., one plan generation), satisfying the "max 1 call per plan" requirement.
export const searchEvents = cache(async (params: SearchEventsParams): Promise<TmEvent[]> => {
  const apiKey = process.env.TICKETMASTER_API_KEY
  if (!apiKey) {
    console.warn('[ticketmaster] TICKETMASTER_API_KEY is not set — skipping')
    return []
  }

  const url = new URL(`${TM_BASE}/events.json`)
  url.searchParams.set('apikey', apiKey)
  // Fetch Music + Sports + Arts in one call; filter Arts down to Comedy below.
  url.searchParams.set('classificationName', 'music,sports,arts')
  url.searchParams.set('size', '50')

  if (params.keyword) url.searchParams.set('keyword', params.keyword)
  if (params.latlong) url.searchParams.set('latlong', params.latlong)
  if (params.radius != null) url.searchParams.set('radius', String(params.radius))
  if (params.startDate) url.searchParams.set('startDateTime', `${params.startDate}T00:00:00Z`)
  if (params.endDate) url.searchParams.set('endDateTime', `${params.endDate}T23:59:59Z`)

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' })

    if (!res.ok) {
      console.error('[ticketmaster] API error', res.status, await res.text())
      return []
    }

    const json = await res.json()
    const events: TmRawEvent[] = json._embedded?.events ?? []
    return events.filter(isAllowed).map(normalize)
  } catch (err) {
    console.error('[ticketmaster] fetch failed:', err)
    return []
  }
})
