'use client'
import { useRouter } from 'next/navigation'

interface Props {
  message?: string
  /** Show a retry button that calls this fn */
  onRetry?: () => void
  /** Override the default "← Home" back button href */
  backHref?: string
}

export default function ErrorState({ message, onRetry, backHref = '/' }: Props) {
  const router = useRouter()

  return (
    <main style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      {/* decorative glyph */}
      <p style={{ fontSize: '2.25rem', margin: '0 0 1.25rem', lineHeight: 1 }}>🫧</p>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: '1.6rem',
        margin: '0 0 0.5rem',
        color: 'var(--text)',
      }}>
        promise I'm not ghosting you
      </h2>

      <p style={{
        color: 'var(--muted)',
        fontSize: '0.9rem',
        lineHeight: 1.55,
        margin: '0 0 2rem',
      }}>
        {message || 'Just a little tech hiccup. Try again in a sec.'}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {onRetry && (
          <button
            type="button"
            className="btn primary"
            onClick={onRetry}
            style={{ fontSize: '0.875rem' }}
          >
            Try again
          </button>
        )}
        <button
          type="button"
          className="btn ghost"
          onClick={() => router.push(backHref)}
          style={{ fontSize: '0.875rem' }}
        >
          ← Home
        </button>
      </div>
    </main>
  )
}
