'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!isOpen || !mounted) return null

  async function handleChoice(style: 'surprise' | 'collaborative') {
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planning_style: style }),
      })
    } finally {
      setSaving(false)
      onClose()
    }
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 16, 24, 0.78)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '2rem 1.5rem',
        }}
      >
        <p
          className="eyebrow"
          style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}
        >
          One quick thing
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 400,
            margin: '0 0 0.5rem',
            color: 'var(--text)',
          }}
        >
          How does your partner prefer date planning?
        </h2>
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.875rem',
            margin: '0 0 1.5rem',
          }}
        >
          We&rsquo;ll use this to shape how plans are presented to them.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label
            className="goal-card"
            style={{ cursor: saving ? 'wait' : 'pointer' }}
          >
            <input
              type="radio"
              name="planning_style"
              value="surprise"
              style={{ display: 'none' }}
              onChange={() => handleChoice('surprise')}
              disabled={saving}
            />
            <strong>They love surprises</strong>
            <p>Keep the details under wraps — they trust your taste.</p>
          </label>

          <label
            className="goal-card"
            style={{ cursor: saving ? 'wait' : 'pointer' }}
          >
            <input
              type="radio"
              name="planning_style"
              value="collaborative"
              style={{ display: 'none' }}
              onChange={() => handleChoice('collaborative')}
              disabled={saving}
            />
            <strong>They like to weigh in</strong>
            <p>Share the outline so they can give a thumbs up or tweak it.</p>
          </label>
        </div>

        {saving && (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: '0.875rem',
              marginTop: '1rem',
            }}
          >
            Saving…
          </p>
        )}
      </div>
    </div>,
    document.body
  )
}
