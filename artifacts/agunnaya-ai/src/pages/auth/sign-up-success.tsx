import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from 'wouter'
import { createClient } from '@/lib/supabase'

export default function SignUpSuccessPage() {
  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)

  const handleResend = async () => {
    const email = sessionStorage.getItem('signup_email')
    if (!email) return
    setResending(true)
    const supabase = createClient()
    await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    setResending(false)
    setResent(true)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Check your email</CardTitle>
            <CardDescription className="mt-2 text-slate-400">
              We sent a confirmation link to your inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
              <p className="text-sm text-blue-200 leading-relaxed">
                Click the link in the email to verify your account and go straight to your dashboard. The link expires in <strong>24 hours</strong>.
              </p>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Don&apos;t see it? Check your spam or junk folder.
            </p>

            {resent ? (
              <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400 text-center">
                ✓ Confirmation email resent!
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full text-sm text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                {resending ? 'Resending…' : 'Resend confirmation email'}
              </button>
            )}

            <div className="border-t border-slate-700 pt-4">
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
