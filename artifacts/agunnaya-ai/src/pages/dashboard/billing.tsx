import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Check, Zap, CreditCard, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    id: 'free', name: 'Free', price: '$0', period: '/mo', color: 'slate',
    features: ['100 AI credits / month', '3 projects', 'Basic agents (Solidity, Frontend)', 'Community support', '1 API key'],
    current: true,
  },
  {
    id: 'pro', name: 'Pro', price: '$29', period: '/mo', color: 'blue', badge: 'Popular',
    features: ['1,000 AI credits / month', 'Unlimited projects', 'All 8 AI agents', 'Priority support', '10 API keys', 'Advanced playground', 'Deploy to 4 networks'],
    current: false,
  },
  {
    id: 'studio', name: 'Studio', price: '$99', period: '/mo', color: 'purple',
    features: ['5,000 AI credits / month', 'Unlimited everything', 'Premium agents', 'Dedicated support', 'Unlimited API keys', 'Team collaboration', 'Custom agent prompts', 'White-label option'],
    current: false,
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 'Custom', period: '', color: 'orange',
    features: ['Unlimited AI credits', 'SLA guarantees', 'Custom model fine-tuning', 'On-premise deployment', 'SSO / SAML', 'Audit logs', 'Dedicated infrastructure'],
    current: false,
  },
]

const USAGE = [
  { label: 'AI Credits', used: 37, total: 100, unit: 'credits', color: 'blue' },
  { label: 'Projects', used: 0, total: 3, unit: 'projects', color: 'purple' },
  { label: 'API Keys', used: 0, total: 1, unit: 'keys', color: 'green' },
  { label: 'Deployments', used: 2, total: 5, unit: 'deploys', color: 'orange' },
]

const HISTORY = [
  { date: 'Jun 1, 2026', desc: 'Free plan — monthly reset', amount: '$0.00', status: 'paid' },
  { date: 'May 1, 2026', desc: 'Free plan — monthly reset', amount: '$0.00', status: 'paid' },
]

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', orange: 'bg-orange-500',
}

export default function BillingPage() {
  const { user, loading } = useDashboardUser()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-5xl">
        <PageHeader title="Billing & Plans" subtitle="Manage your subscription and usage" />

        {/* Current usage */}
        <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Current Plan: Free</p>
              <p className="text-xs text-slate-400">Renews Jun 30, 2026 · 63 credits remaining</p>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Zap size={13} className="mr-1" /> Upgrade
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {USAGE.map((u) => {
              const pct = (u.used / u.total) * 100
              return (
                <div key={u.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{u.label}</span>
                    <span className="text-slate-300">{u.used}/{u.total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div className={`h-full rounded-full ${COLOR_MAP[u.color]} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Plans</h2>
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
            {(['monthly', 'annual'] as const).map((c) => (
              <button key={c} onClick={() => setBillingCycle(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${billingCycle === c ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                {c} {c === 'annual' && <span className="text-green-400 ml-1">-20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PLANS.map((plan) => {
            const price = billingCycle === 'annual' && plan.price.startsWith('$')
              ? '$' + Math.floor(parseInt(plan.price.slice(1)) * 0.8)
              : plan.price
            return (
              <div key={plan.id} className={`p-5 rounded-xl border flex flex-col ${plan.current ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-700/60 bg-slate-800/30'} relative`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-xs text-white font-semibold">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-white">{price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button size="sm" variant={plan.current ? 'outline' : 'default'}
                  className={plan.current ? 'text-slate-400 cursor-default' : plan.id === 'enterprise' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}
                  disabled={plan.current}>
                  {plan.current ? 'Current plan' : plan.id === 'enterprise' ? 'Contact Sales' : `Upgrade ${plan.name}`}
                  {!plan.current && <ArrowRight size={13} className="ml-1" />}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Payment method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-base font-semibold text-white mb-4">Payment Method</h2>
            <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <CreditCard size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">No payment method on file</p>
                  <p className="text-xs text-slate-500">Add a card to upgrade your plan</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <CreditCard size={13} className="mr-2" /> Add Payment Method
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white mb-4">Billing History</h2>
            <div className="rounded-xl border border-slate-700/60 overflow-hidden">
              {HISTORY.map((h, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < HISTORY.length - 1 ? 'border-b border-slate-800' : ''}`}>
                  <div>
                    <p className="text-xs font-medium text-white">{h.date}</p>
                    <p className="text-xs text-slate-500">{h.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-white">{h.amount}</p>
                    <span className="text-xs text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded">paid</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
