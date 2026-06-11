import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useLocation } from 'wouter'
import { useState } from 'react'

function friendlyError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Incorrect email or password. Please try again.'
  if (msg.includes('Email not confirmed')) return 'Please confirm your email first. Check your inbox for the confirmation link.'
  if (msg.includes('Too many requests')) return 'Too many login attempts. Please wait a few minutes and try again.'
  if (msg.includes('User not found')) return 'No account found with this email. Please sign up first.'
  return msg
}

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [, navigate] = useLocation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
      setError(friendlyError(msg))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="font-bold text-white text-lg">Agunnaya AI</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm p-8 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-600/60 bg-slate-900/60 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={async () => {
                    if (!email) { setError('Enter your email first, then click forgot password.'); return }
                    const supabase = createClient()
                    await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
                    })
                    setError(null)
                    alert(`Password reset email sent to ${email}`)
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-600/60 bg-slate-900/60 text-white focus:border-blue-500/60 h-10"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-300 leading-relaxed">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white h-10 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-800/40 px-3 text-xs text-slate-500">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600">
          By signing in, you agree to our{' '}
          <a href="#" className="hover:text-slate-400 underline underline-offset-2">Terms</a>
          {' '}and{' '}
          <a href="#" className="hover:text-slate-400 underline underline-offset-2">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
