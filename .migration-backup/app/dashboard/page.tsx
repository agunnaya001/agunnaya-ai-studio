'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
        } else {
          setUser(user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
          <p className="mt-4 text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg" />
            <span className="font-bold text-lg text-white">Agunnaya AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 min-h-screen hidden md:block">
          <nav className="p-6 space-y-2">
            <NavLink href="/dashboard" label="Dashboard" icon="📊" active />
            <NavLink href="/dashboard/studio" label="AI Studio" icon="✨" />
            <NavLink href="/dashboard/projects" label="Projects" icon="📁" />
            <NavLink href="/dashboard/api-keys" label="API Keys" icon="🔑" />
            <NavLink href="/dashboard/settings" label="Settings" icon="⚙️" />
            <NavLink href="/dashboard/billing" label="Billing" icon="💳" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Welcome to Agunnaya AI</h1>
              <p className="text-slate-400">
                Start building your next Web3 project with AI-powered development tools
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="AI Credits" value="100" subtext="Of 100/month" />
              <StatCard label="Projects" value="0" subtext="Active projects" />
              <StatCard label="API Keys" value="0" subtext="Active keys" />
              <StatCard label="Plan" value="Free" subtext="Starter plan" />
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CTACard
                title="Start AI Chat"
                description="Talk to our AI assistant to generate code and get help"
                icon="💬"
                href="/dashboard/studio"
                buttonText="Open Studio"
              />
              <CTACard
                title="Create New Project"
                description="Set up your first Web3 project"
                icon="🚀"
                href="/dashboard/projects"
                buttonText="New Project"
              />
              <CTACard
                title="Add API Keys"
                description="Connect OpenAI and other AI model providers"
                icon="🔌"
                href="/dashboard/api-keys"
                buttonText="Configure"
              />
              <CTACard
                title="View Documentation"
                description="Learn how to use Agunnaya AI Studio"
                icon="📚"
                href="#"
                buttonText="Read Docs"
              />
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Getting Started</h2>
              <div className="space-y-3">
                <ChecklistItem
                  done={true}
                  label="Create account"
                />
                <ChecklistItem
                  done={user?.user_metadata?.email_verified}
                  label="Verify email"
                />
                <ChecklistItem
                  done={false}
                  label="Set up API keys"
                />
                <ChecklistItem
                  done={false}
                  label="Create first project"
                />
                <ChecklistItem
                  done={false}
                  label="Generate first contract"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function NavLink({
  href,
  label,
  icon,
  active = false,
}: {
  href: string
  label: string
  icon: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
        active
          ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/30 space-y-2">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  )
}

function CTACard({
  title,
  description,
  icon,
  href,
  buttonText,
}: {
  title: string
  description: string
  icon: string
  href: string
  buttonText: string
}) {
  return (
    <div className="p-6 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition space-y-4">
      <div className="text-4xl">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <Link href={href}>
        <Button variant="outline" size="sm">
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}

function ChecklistItem({
  done,
  label,
}: {
  done: boolean
  label: string
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700">
      <input
        type="checkbox"
        checked={done}
        disabled
        className="w-5 h-5 rounded"
      />
      <span className={`text-sm ${done ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
        {label}
      </span>
    </div>
  )
}
