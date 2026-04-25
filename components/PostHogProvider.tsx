'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

const key  = process.env.NEXT_PUBLIC_POSTHOG_KEY  ?? ''
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!key || typeof window === 'undefined') return
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,   // we fire manually below
        capture_pageleave: true,
        person_profiles: 'identified_only',
      })
    }
  }, [])

  useEffect(() => {
    if (!key) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!key) return <>{children}</>
  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  )
}
