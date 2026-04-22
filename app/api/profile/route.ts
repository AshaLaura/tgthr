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

  return NextResponse.json(data)
}

// PATCH /api/profile — update planning_style and/or display_name
export async function PATCH(request: NextRequest) {
  const { supabase, user } = await getAuthedSupabase()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    planning_style?: 'surprise' | 'collaborative'
    display_name?: string
  }

  // Only allow these two fields to be updated via this route
  const updates: Record<string, string> = {}
  if (body.planning_style !== undefined) updates.planning_style = body.planning_style
  if (body.display_name !== undefined) updates.display_name = body.display_name

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
