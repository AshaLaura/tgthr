import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'
import { createServerClient as _createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Placeholder — will be replaced with generated types after TGTHR-005
export type Database = any

export function createBrowserClient() {
  return _createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

// TODO: update type when ReadonlyRequestCookies export path stabilises
export function createServerClient(cookieStore: ReturnType<typeof cookies>) {
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return (cookieStore as any).get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            (cookieStore as any).set({ name, value, ...options })
          } catch {
            // set() called from a Server Component — safe to ignore
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            (cookieStore as any).set({ name, value: '', ...options })
          } catch {
            // remove() called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}
