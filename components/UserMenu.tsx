'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import AuthModal from './AuthModal'
import type { User } from '@supabase/supabase-js'

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState<string>('')
  const supabase = createBrowserClient()
  const [modalOpen, setModalOpen] = useState(false)

  async function loadProfile() {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const profile = await res.json()
        if (profile.display_name) setDisplayName(profile.display_name)
      }
    } catch {
      // non-critical
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) loadProfile()
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile()
      else setDisplayName('')
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setDisplayName('')
  }

  if (user) {
    // Prefer profile display_name, then OAuth name, then email
    const name =
      displayName ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      ''

    const initial = (name[0] || '?').toUpperCase()
    const truncated = name.length > 20 ? name.slice(0, 20) + '…' : name

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
        <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div
            aria-hidden="true"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#1a1220',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <span
            style={{
              fontSize: '0.85rem',
              color: 'var(--muted)',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {truncated}
          </span>
        </Link>
        <button
          type="button"
          className="btn ghost"
          onClick={signOut}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className="btn ghost"
        onClick={() => setModalOpen(true)}
        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginLeft: 'auto' }}
      >
        Sign in
      </button>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
