'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { interestMeta, drinkMeta, dietOptionMeta } from '@/lib/questionnaire'
import { generateBio } from '@/lib/bio'
import type { IdeaCard } from '@/lib/questionnaire'

interface Profile {
  id: string
  display_name: string | null
  planning_style: string | null
  interests: string[]
  drinks: string[]
  diet_tags: string[]
}

interface Plan {
  id: string
  plan_output: IdeaCard[]
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [authName, setAuthName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/')
        return
      }
      setAuthName(
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email || ''
      )

      const [profileRes, plansRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/plans'),
      ])

      if (profileRes.ok) setProfile(await profileRes.json())
      if (plansRes.ok) setPlans(await plansRes.json())
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <main style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center' }}>
        Loading…
      </main>
    )
  }

  if (!profile) return null

  const displayName = profile.display_name || authName || 'You'
  const bio = generateBio(profile.interests, profile.drinks, profile.diet_tags)
  const hasPrefs = profile.interests.length > 0 || profile.drinks.length > 0 || profile.diet_tags.length > 0

  return (
    <main style={{ maxWidth: '520px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>

      {/* Back */}
      <button
        type="button"
        onClick={() => router.push('/')}
        style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '0 0 1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
        }}
      >
        ← Home
      </button>

      {/* Name + bio */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: '2rem',
        fontWeight: 400,
        margin: '0 0 0.5rem',
        color: 'var(--text)',
      }}>
        {displayName}
      </h1>
      {bio && (
        <p style={{ margin: '0 0 1.75rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {bio}
        </p>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 1.75rem' }} />

      {!hasPrefs ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          Complete the questionnaire to populate your profile preferences.
        </p>
      ) : (
        <>
          {/* Vibes */}
          {profile.interests.length > 0 && (
            <section style={{ marginBottom: '1.75rem' }}>
              <p style={{
                margin: '0 0 0.75rem',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}>Vibes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {interestMeta
                  .filter(m => profile.interests.includes(m.id))
                  .map(m => (
                    <span key={m.id} style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(232, 180, 160, 0.35)',
                      color: 'var(--accent)',
                      fontSize: '0.85rem',
                      background: 'rgba(232, 180, 160, 0.07)',
                    }}>{m.label}</span>
                  ))}
              </div>
            </section>
          )}

          {/* Drinking */}
          {profile.drinks.length > 0 && (
            <section style={{ marginBottom: '1.75rem' }}>
              <p style={{
                margin: '0 0 0.75rem',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}>Drinking</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {drinkMeta
                  .filter(m => profile.drinks.includes(m.id))
                  .map(m => (
                    <span key={m.id} style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(232, 180, 160, 0.35)',
                      color: 'var(--accent)',
                      fontSize: '0.85rem',
                      background: 'rgba(232, 180, 160, 0.07)',
                    }}>{m.label}</span>
                  ))}
              </div>
            </section>
          )}

          {/* Dietary */}
          {profile.diet_tags.length > 0 && (
            <section style={{ marginBottom: '1.75rem' }}>
              <p style={{
                margin: '0 0 0.75rem',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}>Dietary</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {dietOptionMeta
                  .filter(m => profile.diet_tags.includes(m.id))
                  .map(m => (
                    <span key={m.id} style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(232, 180, 160, 0.35)',
                      color: 'var(--accent)',
                      fontSize: '0.85rem',
                      background: 'rgba(232, 180, 160, 0.07)',
                    }}>{m.label}</span>
                  ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Saved ideas */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 1.5rem' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <p style={{
          margin: 0,
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '0.68rem',
          fontWeight: 600,
        }}>Saved Ideas</p>
        {plans.length > 0 && (
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>{plans.length} saved</span>
        )}
      </div>

      {plans.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          No saved ideas yet — bookmark a plan after finishing the questionnaire.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {plans.map(plan => {
            const card = plan.plan_output?.[0]
            if (!card) return null
            return (
              <div key={plan.id} style={{
                padding: '1rem 1.1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(232, 180, 160, 0.18)',
                background: 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: '0 0 0.2rem', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                    {card.title}
                  </p>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.825rem' }}>
                    {card.activity}
                  </p>
                </div>
                <span style={{ color: 'var(--accent)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>🔖</span>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
