'use client'
import { useEffect } from 'react'
import ErrorState from '@/components/ErrorState'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[tgthr error boundary]', error)
  }, [error])

  return (
    <ErrorState
      message="Just a little tech hiccup. We're on it."
      onRetry={reset}
    />
  )
}
