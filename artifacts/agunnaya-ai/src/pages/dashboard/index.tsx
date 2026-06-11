import { Link } from 'wouter'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { DashboardLayout, PageHeader, StatCard } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Sparkles, FolderOpen, Key, Zap, ArrowRight, CheckCircle2, Circle, TrendingUp } from 'lucide-react'

const COLOR_CLASSES = {
  blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   border: 'border-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20' },
  orange: { bg: 'bg-orange-500/10', icon: 'text-orange-400', border: 'border-orange-500/20' },
  green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  border: 'border-green-500/20' },
} as const

type ColorKey = keyof typeof COLOR_CLASSES

const CTA_CARDS: { title: string; desc: string; icon: React.ElementType; href: string; color: ColorKey; cta: string }[] = [
  { title: 'AI Studio', desc: 'Generate smart contracts and code with 8 specialized AI agents', icon: Sparkles, href: '/dashboard/studio', color: 'blue', cta: 'Open Studio' },
  { title: 'Dev Playground', desc: 'Monaco editor with Solidity templates and AI inline suggestions', icon: FolderOpen, href: '/dashboard/playground', color: 'purple', cta: 'Open Playground' },
  { title: 'Deploy', desc: 'Deploy to Base, Ethereum, Polygon and other EVM chains', icon: Zap, href: '/dashboard/deploy', color: 'orange', cta: 'Deploy Contract' },
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

  const completedCount = checklist.filter((i) => i.done).length
  const progressPct = Math.round((completedCount / checklist.length) * 100)

  const plan = (user.user_metadata?.plan as string) ?? 'Free'
  const created = new Date(user.created_at ?? Date.now())
  const ageDays = Math.floor((Date.now() - created.getTime()) / 86400000)
  const displayName = user.user_metadata?.display_name as string | undefined
  const greeting = displayName ? `Welcome back, ${displayName} 👋` : 'Welcome back 👋'

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <PageHeader
          title={greeting}
          subtitle="Build your next Web3 project with AI-powered development tools"
        >
          <Link href="/dashboard/studio">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5">
              <Sparkles size={14} />
              New Chat
            </Button>
          </Link>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="AI Credits" value="100" subtext="of 100 / month" icon={<TrendingUp size={14} />} />
          <StatCard label="Projects" value="0" subtext="Active projects" />
          <StatCard label="API Keys" value="0" subtext="Connected keys" />
          <StatCard label="Plan" value={plan} subtext={`${ageDays}d member`} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CTA_CARDS.map((card) => {
              const Icon = card.icon
              const colors = COLOR_CLASSES[card.color]
              return (
                <div
                  key={card.title}
                  className={`group p-5 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 hover:border-slate-600/60 transition-all duration-200`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors.bg} border ${colors.border}`}>
                    <Icon size={18} className={colors.icon} />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm">{card.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{card.desc}</p>
                  <Link href={card.href}>
                    <Button variant="outline" size="sm" className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white gap-1">
                      {card.cta} <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Getting Started */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Getting Started</h2>
            <span className="text-xs text-slate-500">{completedCount}/{checklist.length} complete</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="rounded-xl border border-slate-700/50 overflow-hidden">
            {checklist.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-5 py-4 ${
                  i < checklist.length - 1 ? 'border-b border-slate-800/60' : ''
                } ${item.done ? 'opacity-50' : 'hover:bg-slate-800/20 transition-colors'}`}
              >
                {item.done ? (
                  <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-700 flex-shrink-0" />
                )}
                <span className={`text-sm flex-1 ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                  {item.label}
                </span>
                {item.done && (
                  <span className="text-[10px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                    Done
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
