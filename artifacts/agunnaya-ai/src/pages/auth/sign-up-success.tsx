import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from 'wouter'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Account Created!</CardTitle>
            <CardDescription className="mt-2">
              Check your email for a confirmation link to complete your signup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
              <p className="text-sm text-blue-200">
                We&apos;ve sent a confirmation link to your email. Click the link to verify your account and get started with Agunnaya AI Studio.
              </p>
            </div>
            <p className="text-sm text-slate-400">
              The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
            </p>
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
