import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { searchVenues } from '@/lib/places'

const CITY_LATLONG: Record<string, string> = {
  sf:  '37.7749,-122.4194',
  oak: '37.8044,-122.2712',
}

const CITY_NAMES: Record<string, string> = {
  sf:  'San Francisco',
  oak: 'Oakland',
}

export async function POST(request: NextRequest) {
  let venueName: string
  let city: string

  try {
    const body = await request.json()
    venueName = body.venueName
    city = body.city
  } catch {
    return NextResponse.json({ venue: null })
  }

  if (!venueName || !city) {
    return NextResponse.json({ venue: null })
  }

  const latlong = CITY_LATLONG[city]
  const cityName = CITY_NAMES[city] ?? ''

  // Tight 1 km radius so we match the right neighbourhood location
  const results = await searchVenues({
    query:  `${venueName} ${cityName}`,
    latlong,
    radius: 1000,
  })

  if (!results.length) {
    return NextResponse.json({ venue: null })
  }

  const top = results[0]
  return NextResponse.json({
    venue: {
      address:      top.address,
      rating:       top.rating,
      googleMapsUri: top.googleMapsUri,
    },
  })
}
