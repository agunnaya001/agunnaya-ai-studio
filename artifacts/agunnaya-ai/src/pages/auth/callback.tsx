import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const [, navigate] = useLocation()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      const { searchParams } = new URL(window.location.href)
      const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/'

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          navigate(next)
          return
        }
      }

      navigate('/auth/error')
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
        <p className="mt-4 text-slate-300">Completing sign in...</p>
      </div>
    </div>
  )
}
