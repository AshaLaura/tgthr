import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { searchEvents } from '@/lib/ticketmaster'

const CITY_LATLONG: Record<string, string> = {
  sf: '37.7749,-122.4194',
  oak: '37.8044,-122.2712',
}

// Map questionnaire interest IDs to Ticketmaster search keywords.
// Only interests that have a plausible live-event category are included.
const INTEREST_KEYWORD: Partial<Record<string, string>> = {
  music: 'music',
  art: 'comedy',
}

export async function POST(request: NextRequest) {
  let anchorInterest: string
  let city: string

  try {
    const body = await request.json()
    anchorInterest = body.anchorInterest
    city = body.city
  } catch {
    return NextResponse.json({ events: [] })
  }

  const latlong = CITY_LATLONG[city]
  const keyword = INTEREST_KEYWORD[anchorInterest]

  if (!latlong || !keyword) {
    return NextResponse.json({ events: [] })
  }

  const today = new Date()
  const startDate = today.toISOString().split('T')[0]
  const end = new Date(today)
  end.setDate(today.getDate() + 14)
  const endDate = end.toISOString().split('T')[0]

  const events = await searchEvents({ keyword, latlong, radius: 25, startDate, endDate })

  return NextResponse.json({ events: events.slice(0, 3) })
}
