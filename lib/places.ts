import { cache } from 'react'

// ── Public types ──────────────────────────────────────────────────────────────

/**
 * Price level as a 1–4 integer matching the user's budget tier:
 *   1 = Inexpensive  ($)
 *   2 = Moderate     ($$)
 *   3 = Expensive    ($$$)
 *   4 = Very expensive ($$$$)
 */
export interface Venue {
  name: string
  address: string
  rating?: number
  priceLevel?: 1 | 2 | 3 | 4
  isOpen?: boolean
  googleMapsUri: string
  primaryType: string
  /** Photo resource names (e.g. "places/ChIJ.../photos/AUc7tXU...").
   *  Pass to getPhotoUrl() to get an image — only do this when rendering
   *  a venue card to avoid Enterprise-tier photo billing. */
  photoNames: string[]
}

export interface SearchVenuesParams {
  query: string
  /** "lat,lng" e.g. "37.7749,-122.4194" */
  latlong?: string
  /** Search radius in metres (default 5 000 = ~3 miles) */
  radius?: number
  /** Places API (New) place type e.g. "restaurant", "bar" */
  type?: string
  /** Post-filter: drop any venue whose name contains one of these strings */
  excludeKeywords?: string[]
}

// ── Raw API shapes (minimal) ──────────────────────────────────────────────────

interface RawPhoto {
  name: string
}

interface RawPlace {
  displayName?: { text: string }
  formattedAddress?: string
  rating?: number
  priceLevel?: string
  currentOpeningHours?: { openNow?: boolean }
  businessStatus?: string
  googleMapsUri?: string
  primaryType?: string
  photos?: RawPhoto[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'

// ⚠️  Including "places.photos" here requests photo resource names alongside
// the search — this is billed at the Enterprise Photos SKU.
// The actual image bytes are only fetched when getPhotoUrl() is called from
// the UI, so photos are only loaded when a venue card is rendered.
const FIELD_MASK = [
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.priceLevel',
  'places.currentOpeningHours',
  'places.businessStatus',
  'places.googleMapsUri',
  'places.photos',
  'places.primaryType',
].join(',')

const PRICE_LEVEL_MAP: Record<string, 1 | 2 | 3 | 4> = {
  PRICE_LEVEL_INEXPENSIVE:   1,
  PRICE_LEVEL_MODERATE:      2,
  PRICE_LEVEL_EXPENSIVE:     3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalize(place: RawPlace): Venue {
  return {
    name:         place.displayName?.text ?? '',
    address:      place.formattedAddress ?? '',
    rating:       place.rating,
    priceLevel:   place.priceLevel ? PRICE_LEVEL_MAP[place.priceLevel] : undefined,
    isOpen:       place.currentOpeningHours?.openNow,
    googleMapsUri: place.googleMapsUri ?? '',
    primaryType:  place.primaryType ?? '',
    photoNames:   (place.photos ?? []).map((p) => p.name),
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

/** Search for restaurants or bars using Places API (New).
 *  Wrapped in React cache() to deduplicate identical calls within one request. */
export const searchVenues = cache(async (params: SearchVenuesParams): Promise<Venue[]> => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.warn('[places] GOOGLE_PLACES_API_KEY is not set — skipping')
    return []
  }

  const body: Record<string, unknown> = {
    textQuery:       params.query,
    maxResultCount:  20,
  }

  if (params.type) {
    body.includedType = params.type
  }

  if (params.latlong) {
    const [lat, lng] = params.latlong.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      body.locationBias = {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: params.radius ?? 5000,
        },
      }
    }
  }

  try {
    const res = await fetch(SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'X-Goog-Api-Key':  apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body:  JSON.stringify(body),
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[places] API error', res.status, await res.text())
      return []
    }

    const json = await res.json()
    const raw: RawPlace[] = json.places ?? []

    return raw
      .filter((p) => p.businessStatus !== 'CLOSED_PERMANENTLY')
      .filter((p) => {
        if (!params.excludeKeywords?.length) return true
        const nameLower = (p.displayName?.text ?? '').toLowerCase()
        return !params.excludeKeywords.some((kw) => nameLower.includes(kw.toLowerCase()))
      })
      .map(normalize)
  } catch (err) {
    console.error('[places] fetch failed:', err)
    return []
  }
})

/** Build an image URL for a photo resource name.
 *  Only call this when rendering a venue card — each fetch is billed
 *  at the Enterprise Photos SKU. Server-side only (key is not public). */
export function getPhotoUrl(photoName: string, maxWidthPx = 800): string {
  const key = process.env.GOOGLE_PLACES_API_KEY ?? ''
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${key}`
}
