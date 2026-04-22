'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import AuthModal from './AuthModal'
import type { User } from '@supabase/supabase-js'

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createBrowserClient()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (user) {
    const initial = (
      user.user_metadata?.full_name?.[0] ||
      user.user_metadata?.name?.[0] ||
      user.email?.[0] ||
      '?'
    ).toUpperCase()

    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      ''

    const truncated =
      displayName.length > 20 ? displayName.slice(0, 20) + '…' : displayName

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
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
