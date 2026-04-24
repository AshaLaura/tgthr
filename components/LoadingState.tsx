interface Props {
  message?: string
}

export default function LoadingState({ message = 'Getting things ready…' }: Props) {
  return (
    <main style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      <div className="loading-dots" aria-label="Loading"><span /></div>
      <p style={{
        color: 'var(--muted)',
        fontSize: '0.875rem',
        marginTop: '1.25rem',
      }}>
        {message}
      </p>
    </main>
  )
}
