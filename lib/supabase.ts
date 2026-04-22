import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'
import { createServerClient as _createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'

// Placeholder — will be replaced with generated types after TGTHR-005
export type Database = any

export function createBrowserClient() {
  return _createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

// cookieStore is typed as `any` so this file stays importable from both
// server and client contexts without pulling in 'next/headers' at module level.
// Pass the resolved Awaited<ReturnType<typeof cookies>> from the call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServerClient(cookieStore: any) {
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // set() called from a Server Component — safe to ignore
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // remove() called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}
