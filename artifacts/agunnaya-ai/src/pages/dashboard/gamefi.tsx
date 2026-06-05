import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Trophy, Zap, Star, Gift, Lock, CheckCircle2, ChevronRight, Flame } from 'lucide-react'

const QUESTS = [
  { title: 'First Deployment', desc: 'Deploy your first smart contract to any testnet', xp: 50, progress: 0, total: 1, icon: '🚀' },
  { title: 'Code Generator', desc: 'Generate 5 smart contracts using AI Studio', xp: 100, progress: 2, total: 5, icon: '🤖' },
  { title: 'Security Scout', desc: 'Run 3 security audits with the Security Auditor agent', xp: 75, progress: 1, total: 3, icon: '🛡' },
  { title: 'Community Builder', desc: 'Share a project in the community feed', xp: 25, progress: 0, total: 1, icon: '🌐' },
]

const ACHIEVEMENTS = [
  { title: 'Early Adopter', desc: 'Joined Agunnaya AI in the first month', icon: '⭐', unlocked: true },
  { title: 'First Blood', desc: 'Generated first smart contract', icon: '⚡', unlocked: true },
  { title: 'Whale Hunter', desc: 'Deployed 10+ contracts', icon: '🐳', unlocked: false },
  { title: 'DeFi Architect', desc: 'Built a complete DeFi protocol', icon: '🏗', unlocked: false },
  { title: 'Audit Master', desc: 'Completed 20 security audits', icon: '🔍', unlocked: false },
  { title: 'GameFi Legend', desc: 'Reached level 50', icon: '🏆', unlocked: false },
  { title: 'Token Wizard', desc: 'Deployed 5 token contracts', icon: '🪄', unlocked: false },
  { title: 'DAO Builder', desc: 'Created a governance contract', icon: '🗳', unlocked: false },
]

const LEADERBOARD = [
  { rank: 1, name: 'vitalik.eth', xp: 14820, level: 48, badge: '👑' },
  { rank: 2, name: '0xSatoshi', xp: 12350, level: 42, badge: '🥈' },
  { rank: 3, name: 'defi_wizard', xp: 10100, level: 38, badge: '🥉' },
  { rank: 4, name: 'nft_king.base', xp: 8750, level: 33, badge: '' },
  { rank: 5, name: 'solidity_dev', xp: 7200, level: 29, badge: '' },
  { rank: 6, name: 'web3_builder', xp: 5400, level: 24, badge: '' },
  { rank: 7, name: 'chain_surfer', xp: 4100, level: 20, badge: '' },
  { rank: 8, name: 'basecamp.eth', xp: 3200, level: 17, badge: '' },
  { rank: 9, name: 'dapp_factory', xp: 2100, level: 12, badge: '' },
  { rank: 10, name: 'You', xp: 150, level: 2, badge: '📍', isUser: true },
]

export default function GameFiPage() {
  const { user, loading } = useDashboardUser()
  const [tab, setTab] = useState<'quests' | 'achievements' | 'leaderboard'>('quests')

  const userXP = 150
  const userLevel = 2
  const nextLevelXP = 500
  const xpProgress = (userXP / nextLevelXP) * 100

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-5xl">
        <PageHeader title="GameFi Engine" subtitle="Earn XP, complete quests, and climb the leaderboard" />

        {/* XP Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-cyan-900/50 border border-purple-500/20 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={18} className="text-orange-400" />
                <span className="text-sm font-semibold text-orange-400">Level {userLevel}</span>
              </div>
              <p className="text-2xl font-bold text-white">{userXP.toLocaleString()} XP</p>
              <p className="text-slate-400 text-sm">{nextLevelXP - userXP} XP until Level {userLevel + 1}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-xl font-bold text-white">#10</p><p className="text-xs text-slate-500">Rank</p></div>
              <div><p className="text-xl font-bold text-white">2</p><p className="text-xs text-slate-500">Quests</p></div>
              <div><p className="text-xl font-bold text-white">2</p><p className="text-xs text-slate-500">Badges</p></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progress to Level {userLevel + 1}</span>
              <span>{userXP} / {nextLevelXP} XP</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Daily Rewards */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-6">
          <Gift size={20} className="text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Daily Reward Available!</p>
            <p className="text-xs text-slate-400">Claim your 25 XP daily bonus</p>
          </div>
          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Claim +25 XP</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1 w-fit">
          {(['quests', 'achievements', 'leaderboard'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'quests' && (
          <div className="space-y-3">
            {QUESTS.map((q) => {
              const pct = (q.progress / q.total) * 100
              const done = q.progress >= q.total
              return (
                <div key={q.title} className={`p-5 rounded-xl border ${done ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700/60 bg-slate-800/30'}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{q.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-white">{q.title}</p>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={12} />
                          <span className="text-xs font-bold">+{q.xp} XP</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{q.desc}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{q.progress}/{q.total}</span>
                        {done && <CheckCircle2 size={14} className="text-green-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.title} className={`p-4 rounded-xl border text-center transition-all ${a.unlocked ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-slate-700/40 bg-slate-800/20 opacity-60'}`}>
                <div className="text-3xl mb-2">{a.unlocked ? a.icon : <Lock size={24} className="mx-auto text-slate-600" />}</div>
                <p className={`text-xs font-semibold mb-1 ${a.unlocked ? 'text-white' : 'text-slate-500'}`}>{a.title}</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div className="rounded-xl border border-slate-700/60 overflow-hidden">
            <div className="grid grid-cols-4 px-5 py-3 text-xs text-slate-500 border-b border-slate-800 bg-slate-800/30 font-medium">
              <span>Rank</span><span>Builder</span><span>Level</span><span className="text-right">XP</span>
            </div>
            {LEADERBOARD.map((p) => (
              <div key={p.rank} className={`grid grid-cols-4 items-center px-5 py-3.5 border-b border-slate-800 last:border-0 ${p.isUser ? 'bg-blue-600/10 border-blue-500/20' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${p.rank <= 3 ? 'text-yellow-400' : 'text-slate-500'}`}>#{p.rank}</span>
                  {p.badge && <span>{p.badge}</span>}
                </div>
                <span className={`text-sm font-medium ${p.isUser ? 'text-blue-300' : 'text-white'}`}>{p.name}</span>
                <div className="flex items-center gap-1">
                  <Zap size={11} className="text-purple-400" />
                  <span className="text-xs text-slate-400">Lv {p.level}</span>
                </div>
                <span className="text-sm font-bold text-right text-white">{p.xp.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
