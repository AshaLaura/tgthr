import type { State } from '@/lib/questionnaire'

// ── Database row types ────────────────────────────────────────────────────────

export interface Profile {
  id: string
  display_name: string | null
  planning_style: 'surprise' | 'collaborative' | null
  created_at: string
}

export interface Plan {
  id: string
  user_id: string
  /** Full questionnaire State object stored as JSON */
  questionnaire_data: State
  /** AI-generated or city-specific idea cards */
  plan_output: IdeaCard[]
  /** 'sf' | 'oak' for city plans, null for AI-generated */
  city: 'sf' | 'oak' | null
  timing_day: string | null
  timing_time_of_day: 'afternoon' | 'evening' | 'late night' | null
  status: 'draft' | 'sent' | 'confirmed'
  partner_response: 'approved' | 'tweaked' | null
  created_at: string
}

export interface PartnerInvite {
  id: string
  plan_id: string
  /** Random 32-char token used in share URL */
  token: string
  expires_at: string
  viewed_at: string | null
  responded_at: string | null
  response: 'approved' | 'tweaked' | null
  partner_tweaks: Record<string, unknown> | null
}

// ── Plan output shape ─────────────────────────────────────────────────────────

export interface IdeaCard {
  title: string
  activity: string
  meal?: string
  bar?: string
  why?: string
}
