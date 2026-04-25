'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { interestMeta, drinkMeta, dietOptionMeta } from '@/lib/questionnaire'
import { generateBio } from '@/lib/bio'
import type { IdeaCard } from '@/lib/questionnaire'
import ErrorState from '@/components/ErrorState'
import LoadingState from '@/components/LoadingState'

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

const pillStyle: React.CSSProperties = {
  padding: '0.4rem 0.85rem',
  borderRadius: '999px',
  border: '1px solid rgba(232, 180, 160, 0.35)',
  color: 'var(--accent)',
  fontSize: '0.85rem',
  background: 'rgba(232, 180, 160, 0.07)',
}

const sectionLabelStyle: React.CSSProperties = {
  margin: '0 0 0.75rem',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: '0.68rem',
  fontWeight: 600,
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [authName, setAuthName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Name editing
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
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

      if (!profileRes.ok) {
        const err = await profileRes.json().catch(() => ({}))
        setError(err.error || 'Failed to load profile.')
        return
      }

      const raw = await profileRes.json()
      setProfile({
        ...raw,
        interests: raw.interests ?? [],
        drinks:    raw.drinks    ?? [],
        diet_tags: raw.diet_tags ?? [],
      })

      if (plansRes.ok) setPlans(await plansRes.json())
    } catch (e) {
      setError('Something went wrong loading your profile.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [])

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingName) nameInputRef.current?.focus()
  }, [editingName])

  function startEditing(currentName: string) {
    setNameInput(currentName)
    setNameError(null)
    setEditingName(true)
  }

  function cancelEditing() {
    setEditingName(false)
    setNameError(null)
  }

  async function saveName() {
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setNameError('Name can\'t be empty.')
      return
    }
    setNameSaving(true)
    setNameError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: trimmed }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setNameError(err.error || 'Failed to save.')
        return
      }
      const updated = await res.json()
      setProfile(prev => prev ? { ...prev, display_name: updated.display_name } : prev)
      setEditingName(false)
      // Notify the header UserMenu so it updates without a full page reload
      window.dispatchEvent(new CustomEvent('tgthr:profile-updated', {
        detail: { display_name: updated.display_name }
      }))
    } catch {
      setNameError('Something went wrong. Try again.')
    } finally {
      setNameSaving(false)
    }
  }

  if (loading) return <LoadingState message="Pulling up your profile…" />

  if (error) {
    return <ErrorState message={error} onRetry={load} />
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
      {editingName ? (
        <div style={{ marginBottom: '1.75rem' }}>
          <input
            ref={nameInputRef}
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') saveName()
              if (e.key === 'Escape') cancelEditing()
            }}
            maxLength={80}
            style={{
              width: '100%',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '2rem',
              fontWeight: 400,
              color: 'var(--text)',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--accent)',
              outline: 'none',
              padding: '0 0 0.25rem',
              marginBottom: '0.75rem',
            }}
          />
          {nameError && (
            <p style={{ margin: '0 0 0.5rem', color: 'var(--accent)', fontSize: '0.8rem' }}>
              {nameError}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn primary"
              onClick={saveName}
              disabled={nameSaving}
              style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
            >
              {nameSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={cancelEditing}
              disabled={nameSaving}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: bio ? '0.5rem' : '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '2rem',
              fontWeight: 400,
              margin: 0,
              color: 'var(--text)',
            }}>
              {displayName}
            </h1>
            <button
              type="button"
              onClick={() => startEditing(displayName)}
              aria-label="Edit name"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                fontSize: '0.85rem',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ✏︎
            </button>
          </div>
        </div>
      )}

      {bio && !editingName && (
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
          {profile.interests.length > 0 && (
            <section style={{ marginBottom: '1.75rem' }}>
              <p style={sectionLabelStyle}>Vibes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {interestMeta
                  .filter(m => profile.interests.includes(m.id))
                  .map(m => <span key={m.id} style={pillStyle}>{m.label}</span>)}
              </div>
            </section>
          )}

          {profile.drinks.length > 0 && (
            <section style={{ marginBottom: '1.75rem' }}>
              <p style={sectionLabelStyle}>Drinking</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {drinkMeta
                  .filter(m => profile.drinks.includes(m.id))
                  .map(m => <span key={m.id} style={pillStyle}>{m.label}</span>)}
              </div>
            </section>
          )}

          {profile.diet_tags.length > 0 && (
            <section style={{ marginBottom: '1.75rem' }}>
              <p style={sectionLabelStyle}>Dietary</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {dietOptionMeta
                  .filter(m => profile.diet_tags.includes(m.id))
                  .map(m => <span key={m.id} style={pillStyle}>{m.label}</span>)}
              </div>
            </section>
          )}
        </>
      )}

      {/* Saved ideas */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 1.5rem' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <p style={{ ...sectionLabelStyle, margin: 0 }}>Saved Ideas</p>
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
