import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Download, Star, Filter, Search, Lock, Zap } from 'lucide-react'

type Category = 'all' | 'defi' | 'nft' | 'gamefi' | 'dao' | 'security'

const TEMPLATES = [
  { id: 1, name: 'ERC-20 Token', cat: 'defi', desc: 'Standard fungible token with minting, burning, and owner controls', stars: 1240, installs: 8420, tags: ['ERC-20', 'Token'], free: true, author: 'OpenZeppelin' },
  { id: 2, name: 'Uniswap V2 Clone', cat: 'defi', desc: 'Full AMM DEX with liquidity pools, swaps, and price oracle', stars: 892, installs: 3100, tags: ['AMM', 'DEX', 'DeFi'], free: false, author: 'DeFi Labs' },
  { id: 3, name: 'NFT Collection', cat: 'nft', desc: 'ERC-721 with whitelist, reveal mechanic, and royalties (EIP-2981)', stars: 2100, installs: 14200, tags: ['ERC-721', 'NFT', 'Reveal'], free: true, author: 'NFT Studio' },
  { id: 4, name: 'ERC-1155 Multi-Token', cat: 'nft', desc: 'Multi-token standard for game items, semi-fungible assets', stars: 650, installs: 2800, tags: ['ERC-1155', 'Gaming'], free: true, author: 'OpenZeppelin' },
  { id: 5, name: 'GameFi Starter Kit', cat: 'gamefi', desc: 'Complete XP system, loot drops (VRF), tournament brackets, leaderboard', stars: 743, installs: 1900, tags: ['GameFi', 'XP', 'VRF'], free: false, author: 'Agunnaya Labs' },
  { id: 6, name: 'Staking Pool', cat: 'defi', desc: 'Token staking with time-weighted reward distribution', stars: 910, installs: 5200, tags: ['Staking', 'Rewards'], free: true, author: 'DeFi Labs' },
  { id: 7, name: 'DAO Governor', cat: 'dao', desc: 'On-chain governance with proposal, voting, timelock, and veto', stars: 580, installs: 1400, tags: ['DAO', 'Governance', 'Vote'], free: false, author: 'Compound Finance' },
  { id: 8, name: 'Multi-Sig Wallet', cat: 'security', desc: 'N-of-M multisignature wallet with transaction queue and expiry', stars: 1540, installs: 6800, tags: ['Security', 'MultiSig'], free: true, author: 'Gnosis' },
  { id: 9, name: 'Bonding Curve ICO', cat: 'defi', desc: 'Token launch with automated bonding curve pricing and reserve', stars: 310, installs: 680, tags: ['ICO', 'Bonding Curve'], free: false, author: 'Agunnaya Labs' },
  { id: 10, name: 'Battle Pass System', cat: 'gamefi', desc: 'Season pass with tiers, challenges, and NFT reward unlocks', stars: 220, installs: 450, tags: ['GameFi', 'Pass', 'NFT'], free: false, author: 'GameFi Studio' },
  { id: 11, name: 'Audit Report Template', cat: 'security', desc: 'Professional security audit report with severity classifications', stars: 430, installs: 1200, tags: ['Audit', 'Security'], free: true, author: 'Trail of Bits' },
  { id: 12, name: 'Revenue Share DAO', cat: 'dao', desc: 'Protocol revenue distribution to governance token holders', stars: 190, installs: 320, tags: ['DAO', 'Revenue', 'DeFi'], free: false, author: 'DeFi Labs' },
]

const AGENTS = [
  { name: 'Solidity Pro Agent', desc: 'Advanced Solidity patterns, gas tricks, and assembly optimizations', price: '50 credits/mo', tier: 'Pro', icon: '⬡', rating: 4.9 },
  { name: 'Security Auditor Pro', desc: 'Full security audit with formal verification and fuzzing support', price: '100 credits/mo', tier: 'Studio', icon: '🛡', rating: 4.8 },
  { name: 'Tokenomics Designer', desc: 'Custom tokenomics modeling with Monte Carlo simulations', price: '75 credits/mo', tier: 'Pro', icon: '💹', rating: 4.7 },
  { name: 'DeFi Protocol Architect', desc: 'End-to-end DeFi protocol design, from math to deployment', price: '150 credits/mo', tier: 'Studio', icon: '🏗', rating: 4.9 },
]

const CAT_LABELS: Record<Category, string> = {
  all: 'All', defi: 'DeFi', nft: 'NFT', gamefi: 'GameFi', dao: 'DAO', security: 'Security',
}

export default function MarketplacePage() {
  const { user, loading } = useDashboardUser()
  const [tab, setTab] = useState<'templates' | 'agents'>('templates')
  const [cat, setCat] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [installed, setInstalled] = useState<Set<number>>(new Set())

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = cat === 'all' || t.cat === cat
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-6xl">
        <PageHeader title="Marketplace" subtitle="Templates, agents, and plugins for Web3 development" />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1 w-fit">
          {(['templates', 'agents'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'templates' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates…"
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-52" />
              </div>
              <div className="flex gap-1 flex-wrap">
                {(Object.keys(CAT_LABELS) as Category[]).map((c) => (
                  <button key={c} onClick={() => setCat(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cat === c ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}>
                    {CAT_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => {
                const isInstalled = installed.has(t.id)
                return (
                  <div key={t.id} className="p-5 rounded-xl border border-slate-700/60 bg-slate-800/30 hover:bg-slate-800/50 transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-white">{t.name}</p>
                          {!t.free && <Lock size={11} className="text-yellow-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500">{t.author}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed flex-1 mb-3">{t.desc}</p>
                    <div className="flex gap-1.5 mb-4 flex-wrap">
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400" /> {t.stars.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Download size={11} /> {t.installs.toLocaleString()}</span>
                      </div>
                      <Button size="sm" variant={isInstalled ? 'outline' : 'default'}
                        className={isInstalled ? 'text-green-400 border-green-500/30' : t.free ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}
                        onClick={() => setInstalled((prev) => { const s = new Set(prev); s.add(t.id); return s })}>
                        {isInstalled ? '✓ Installed' : t.free ? 'Install' : 'Unlock'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {tab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {AGENTS.map((a) => (
              <div key={a.name} className="p-5 rounded-xl border border-slate-700/60 bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{a.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-white">{a.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${a.tier === 'Studio' ? 'bg-purple-600/30 text-purple-300' : 'bg-blue-600/30 text-blue-300'}`}>{a.tier}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < Math.floor(a.rating) ? 'text-yellow-400' : 'text-slate-700'} fill={i < Math.floor(a.rating) ? 'currentColor' : 'none'} />
                      ))}
                      <span className="text-xs text-slate-400 ml-1">{a.rating}</span>
                    </div>
                    <p className="text-xs text-slate-400">{a.price}</p>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Zap size={13} className="mr-1" /> Activate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
