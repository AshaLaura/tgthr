import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function getAuthedSupabase() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  const { data: { user }, error } = await supabase.auth.getUser()
  return { supabase, user, error }
}

// GET /api/profile — return current user's profile row
export async function GET() {
  const { supabase, user } = await getAuthedSupabase()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Lazy-backfill email for users created before the email column existed
  if (!data.email && user.email) {
    await supabase
      .from('profiles')
      .update({ email: user.email })
      .eq('id', user.id)
    data.email = user.email
  }

  return NextResponse.json(data)
}

// PATCH /api/profile — update allowed profile fields
export async function PATCH(request: NextRequest) {
  const { supabase, user } = await getAuthedSupabase()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    planning_style?: 'surprise' | 'collaborative'
    display_name?: string
    interests?: string[]
    drinks?: string[]
    diet_tags?: string[]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {}
  if (body.planning_style !== undefined) updates.planning_style = body.planning_style
  if (body.display_name     !== undefined) updates.display_name  = body.display_name
  if (body.interests        !== undefined) updates.interests      = body.interests
  if (body.drinks           !== undefined) updates.drinks         = body.drinks
  if (body.diet_tags        !== undefined) updates.diet_tags      = body.diet_tags

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
