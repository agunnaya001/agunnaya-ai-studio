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
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    })
  }, [navigate])

  return { user, loading }
}
