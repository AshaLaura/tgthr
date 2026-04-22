import Link from 'next/link'

export default function AuthError() {
  return (
    <main id="main">
      <section className="panel hero" style={{ textAlign: 'center' }}>
        <p className="eyebrow">Auth error</p>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Something went wrong signing in.</h1>
        <p className="lede">Please try again.</p>
        <Link href="/" className="btn primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Back to home
        </Link>
      </section>
    </main>
  )
}
