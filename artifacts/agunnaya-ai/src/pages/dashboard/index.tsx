import { Link } from 'wouter'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { DashboardLayout, PageHeader, StatCard } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Sparkles, FolderOpen, Key, BookOpen, Zap, ArrowRight, CheckCircle2, Circle } from 'lucide-react'

const CTA_CARDS = [
  { title: 'AI Studio', desc: 'Generate smart contracts & code with specialized AI agents', icon: Sparkles, href: '/dashboard/studio', color: 'blue', cta: 'Open Studio' },
  { title: 'Dev Playground', desc: 'Monaco editor with AI inline code suggestions', icon: FolderOpen, href: '/dashboard/playground', color: 'purple', cta: 'Open Playground' },
  { title: 'Deploy', desc: 'Deploy to Base, Ethereum, and other EVM chains', icon: Zap, href: '/dashboard/deploy', color: 'orange', cta: 'Deploy Contract' },
  { title: 'API Keys', desc: 'Connect AI providers and Web3 infrastructure APIs', icon: Key, href: '/dashboard/api-keys', color: 'green', cta: 'Configure' },
]

const CHECKLIST = [
  { label: 'Create account', done: true },
  { label: 'Verify email', key: 'email_confirmed_at' as const },
  { label: 'Set up API keys', done: false },
  { label: 'Create first project', done: false },
  { label: 'Generate first contract', done: false },
]

export default function DashboardPage() {
  const { user, loading } = useDashboardUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
      </div>
    )
  }
  if (!user) return null

  const checklist = CHECKLIST.map((item) => ({
    ...item,
    done: 'key' in item ? !!user[item.key as keyof typeof user] : item.done,
  }))

  const plan = (user.user_metadata?.plan as string) ?? 'Free'
  const created = new Date(user.created_at ?? Date.now())
  const ageDays = Math.floor((Date.now() - created.getTime()) / 86400000)

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-6xl">
        <PageHeader
          title="Welcome back 👋"
          subtitle="Build your next Web3 project with AI-powered development tools"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="AI Credits" value="100" subtext="of 100 / month" />
          <StatCard label="Projects" value="0" subtext="Active projects" />
          <StatCard label="API Keys" value="0" subtext="Connected keys" />
          <StatCard label="Plan" value={plan} subtext={`${ageDays}d member`} />
        </div>

        {/* CTA Cards */}
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {CTA_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="group p-5 rounded-xl border border-slate-700/60 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-${card.color}-500/10`}>
                  <Icon size={20} className={`text-${card.color}-400`} />
                </div>
                <h3 className="font-semibold text-white mb-1">{card.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{card.desc}</p>
                <Link href={card.href}>
                  <Button variant="outline" size="sm" className="group-hover:border-slate-500">
                    {card.cta} <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Checklist */}
        <h2 className="text-lg font-semibold text-white mb-4">Getting Started</h2>
        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          {checklist.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-5 py-3.5 ${i < checklist.length - 1 ? 'border-b border-slate-800' : ''} ${item.done ? 'opacity-60' : ''}`}
            >
              {item.done ? (
                <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-slate-600 flex-shrink-0" />
              )}
              <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                {item.label}
              </span>
              {item.done && <span className="ml-auto text-xs text-green-400 font-medium">Done</span>}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
