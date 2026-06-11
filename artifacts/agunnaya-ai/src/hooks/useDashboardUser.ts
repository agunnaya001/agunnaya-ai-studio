import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useDashboardUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [, navigate] = useLocation()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate('/auth/login')
          setUser(null)
        } else {
          setUser(session.user)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  return { user, loading }
}
