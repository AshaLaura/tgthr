'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { createBrowserClient } from '@/lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

/** Returns the canonical app origin for auth redirects.
 *  Uses NEXT_PUBLIC_SITE_URL in production so magic-link emails always
 *  point at the deployed URL, not whatever origin the browser is on. */
function siteOrigin(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  return window.location.origin
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => { setMounted(true) }, [])

  if (!isOpen || !mounted) return null

  function notifyBeforeSignIn() {
    window.dispatchEvent(new CustomEvent('tgthr:before-signin'))
  }

  async function handleGoogle() {
    notifyBeforeSignIn()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: siteOrigin() + '/auth/callback' },
    })
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    notifyBeforeSignIn()
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: siteOrigin() + '/auth/callback' },
    })
    setSent(true)
    setLoading(false)
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '1.5rem',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '1.25rem',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0.25rem',
          }}
        >
          ×
        </button>

        <p
          className="eyebrow"
          style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}
        >
          Sign in
        </p>
        <p style={{ margin: '0 0 1.25rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Save your date plan and access it later.
        </p>

        {/* Google OAuth */}
        <button
          type="button"
          className="btn primary"
          onClick={handleGoogle}
          style={{ width: '100%', textAlign: 'center' }}
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: '1rem 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {sent ? (
          <p style={{ color: 'var(--accent)', textAlign: 'center', margin: 0 }}>
            Magic link sent — check your inbox ✓
          </p>
        ) : (
          <form onSubmit={handleMagicLink}>
            <div className="field-row" style={{ marginBottom: '0.75rem' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              className="btn ghost"
              disabled={loading}
              style={{ width: '100%', textAlign: 'center' }}
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
