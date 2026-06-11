import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useLocation } from 'wouter'
import { useState } from 'react'

const DB_TRIGGER_HELP = `Your Supabase database is missing a required table.

To fix this, go to your Supabase dashboard → SQL Editor, paste the migration from the project's supabase/migrations/001_profiles.sql file, and click Run. Then try signing up again.`

function friendlyError(msg: string): { text: string; isDbError: boolean } {
  if (msg.includes('Database error saving new user') || msg.includes('Database error')) {
    return { text: DB_TRIGGER_HELP, isDbError: true }
  }
  if (msg.includes('User already registered') || msg.includes('already registered')) {
    return { text: 'An account with this email already exists. Try signing in instead.', isDbError: false }
  }
  if (msg.includes('Password should be at least')) {
    return { text: 'Password must be at least 8 characters.', isDbError: false }
  }
  if (msg.includes('Unable to validate email address')) {
    return { text: 'Please enter a valid email address.', isDbError: false }
  }
  if (msg.includes('Too many requests')) {
    return { text: 'Too many sign-up attempts. Please wait a few minutes.', isDbError: false }
  }
  return { text: msg, isDbError: false }
}

export default function SignUpPage() {
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName]       = useState('')
  const [error, setError]                   = useState<{ text: string; isDbError: boolean } | null>(null)
  const [isLoading, setIsLoading]           = useState(false)
  const [, navigate] = useLocation()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError({ text: 'Passwords do not match.', isDbError: false })
      setIsLoading(false)
      return
    }
    if (password.length < 8) {
      setError({ text: 'Password must be at least 8 characters.', isDbError: false })
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: { display_name: displayName || email.split('@')[0] },
        },
      })
      if (error) throw error

      if (data.session) {
        navigate('/dashboard')
      } else {
        sessionStorage.setItem('signup_email', email)
        navigate('/auth/sign-up-success')
      }
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-slate-400">Free forever on the Starter plan — no credit card required</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm p-8 space-y-5">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-slate-300 text-sm">Display Name <span className="text-slate-600">(optional)</span></Label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-slate-600/60 bg-slate-900/60 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
              />
            </div>
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
              <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-600/60 bg-slate-900/60 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-slate-300 text-sm">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-slate-600/60 bg-slate-900/60 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
              />
            </div>

            {error && (
              <div className={`rounded-xl border p-3.5 text-sm leading-relaxed whitespace-pre-line ${
                error.isDbError
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-300'
                  : 'bg-red-500/10 border-red-500/20 text-red-300'
              }`}>
                {error.isDbError && <strong className="block mb-1">⚠️ Database Setup Required</strong>}
                {error.text}
                {error.isDbError && (
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-400 hover:underline font-medium"
                  >
                    Open Supabase Dashboard →
                  </a>
                )}
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
                  Creating account…
                </span>
              ) : 'Create Free Account'}
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
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600">
          By creating an account, you agree to our{' '}
          <a href="#" className="hover:text-slate-400 underline underline-offset-2">Terms</a>
          {' '}and{' '}
          <a href="#" className="hover:text-slate-400 underline underline-offset-2">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
