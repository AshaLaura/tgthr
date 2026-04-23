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

// POST /api/plans — save a bookmarked idea as a plan
export async function POST(request: NextRequest) {
  const { supabase, user } = await getAuthedSupabase()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { questionnaire_data, plan_output } = body

  if (!questionnaire_data || !plan_output) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('plans')
    .insert({
      user_id: user.id,
      questionnaire_data,
      plan_output,
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
