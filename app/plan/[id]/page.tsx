'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import {
  buildAllIdeaCards,
  renderCityPlanHtml,
  pickAnchorInterest,
  escapeHtml,
  escapeAttr,
} from '@/lib/questionnaire'
import type { IdeaCard } from '@/lib/questionnaire'
import type { TmEvent } from '@/lib/ticketmaster'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'

interface SavedPlan {
  id: string
  city: 'sf' | 'oak' | null
  questionnaire_data: Parameters<typeof buildAllIdeaCards>[0]
  plan_output: IdeaCard[]
  created_at: string
}

const CITY_LABELS: Record<string, string> = { sf: 'San Francisco', oak: 'Oakland' }

const EVENTS_CONTEXT: Partial<Record<string, string>> = {
  music: 'You listed music as an interest — these live shows are happening nearby within the next two weeks.',
  art: 'Since comedy is part of your vibe, here are some shows near you in the next two weeks.',
}

function formatPriceRange(min?: number, max?: number): string {
  if (min == null) return ''
  const lo = `$${Math.round(min)}`
  if (max == null || Math.round(max) === Math.round(min)) return lo
  return `${lo} – $${Math.round(max)}`
}

function buildEventsHtml(events: TmEvent[], anchorInterest: string): string {
  const context = EVENTS_CONTEXT[anchorInterest] ?? ''
  const items = events.map((ev) => {
    const date = ev.date
      ? new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : ''
    const meta = [date, ev.venue].filter(Boolean).join(' · ')
    const priceStr = formatPriceRange(ev.priceMin, ev.priceMax)
    const price = priceStr ? `<p class="tm-event-price">${escapeHtml(priceStr)} per ticket</p>` : ''
    const img = ev.imageUrl
      ? `<img src="${escapeAttr(ev.imageUrl)}" class="tm-event-img" alt="" loading="lazy" />`
      : ''
    return `
      <div class="tm-event">
        ${img}
        <div class="tm-event-body">
          <p class="tm-event-name">${escapeHtml(ev.name)}</p>
          ${meta ? `<p class="tm-event-meta">${escapeHtml(meta)}</p>` : ''}
          ${price}
          <a href="${escapeAttr(ev.url)}" class="tm-event-link" target="_blank" rel="noopener noreferrer">Get Tickets →</a>
        </div>
      </div>`
  })
  return `
    <div class="tm-events">
      <p class="tm-events-heading">Upcoming Events</p>
      ${context ? `<p class="tm-events-context">${escapeHtml(context)}</p>` : ''}
      <div class="tm-event-list">${items.join('')}</div>
    </div>`
}

export default function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createBrowserClient()

  const [plan, setPlan] = useState<SavedPlan | null>(null)
  const [activeCity, setActiveCity] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const planBodyRef = useRef<HTMLDivElement>(null)

  // Fetch plan once
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/'); return }
    })
    fetch(`/api/plans/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((data: SavedPlan) => {
        setPlan(data)
        setActiveCity(data.city ?? 'sf')
        setLoading(false)
      })
      .catch(() => {
        setError('This plan couldn't be loaded.')
        setLoading(false)
      })
  }, [id])

  // Re-render city plan HTML whenever city changes
  useEffect(() => {
    if (!plan || !planBodyRef.current || !activeCity) return

    const allCards = buildAllIdeaCards(plan.questionnaire_data)
    const savedCard = plan.plan_output?.[0]
    const ideaIndex = savedCard?.ideaIndex ?? 0

    planBodyRef.current.innerHTML = renderCityPlanHtml(
      activeCity,
      plan.questionnaire_data,
      ideaIndex,
      allCards
    )

    // Async: fetch events and inject
    const anchorInterest = pickAnchorInterest(ideaIndex, plan.questionnaire_data)

    fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anchorInterest, city: activeCity, budgetTier: plan.questionnaire_data.you.budget }),
    })
      .then((r) => r.json())
      .then(({ events }: { events: TmEvent[] }) => {
        if (!events?.length || !planBodyRef.current) return
        const card = planBodyRef.current.querySelector('.idea-card')
        if (!card) return
        const activityBlock = card.querySelector('.city-detail-block')
        if (!activityBlock) return
        const wrapper = document.createElement('div')
        wrapper.innerHTML = buildEventsHtml(events, anchorInterest)
        activityBlock.after(wrapper.firstElementChild!)
      })
      .catch(() => { /* non-critical */ })
  }, [plan, activeCity])

  if (loading) return <LoadingState message="Loading your plan…" />
  if (error) return <ErrorState message={error} onRetry={() => router.push('/profile')} />
  if (!plan) return null

  const otherCity = activeCity === 'sf' ? 'oak' : 'sf'

  return (
    <main style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1.25rem 5rem' }}>

      {/* Back */}
      <button
        type="button"
        onClick={() => router.push('/profile')}
        style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '0 0 1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
        }}
      >
        ← Back to profile
      </button>

      {/* City switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['sf', 'oak'] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={`btn ${activeCity === c ? 'primary' : 'secondary'} city-switch-btn`}
            data-city={c}
            onClick={() => setActiveCity(c)}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            {CITY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Plan body — populated via innerHTML */}
      <div ref={planBodyRef} />

      {/* Switch city nudge */}
      <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
        Want to see this plan in {CITY_LABELS[otherCity]}?{' '}
        <button
          type="button"
          onClick={() => setActiveCity(otherCity)}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}
        >
          Switch to {CITY_LABELS[otherCity]}
        </button>
      </p>

    </main>
  )
}
