import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Repeat2, Share2, TrendingUp, Star, ExternalLink } from 'lucide-react'

const FEED = [
  {
    id: 1, author: 'vitalik.eth', handle: '@vitalik', avatar: 'V', color: '#627eea', time: '2h ago',
    content: 'Just deployed a gas-optimized AMM on Base with only 85k gas per swap. Key insight: pack storage slots and use assembly for the core math. Full write-up coming soon 🔥',
    tags: ['DeFi', 'Base', 'Solidity'],
    likes: 248, comments: 34, reposts: 67, hasCode: false,
  },
  {
    id: 2, author: '0xSatoshi', handle: '@0xSatoshi', avatar: 'S', color: '#f97316', time: '4h ago',
    content: 'Built a Chainlink VRF-powered loot drop system for my GameFi project. Provably fair randomness on-chain is underrated. Here\'s the contract:',
    code: `function requestLoot(uint256 characterId) external returns (uint256 requestId) {
    requestId = COORDINATOR.requestRandomWords(
        s_keyHash, s_subscriptionId, 3, 100000, 1
    );
    s_requests[requestId] = LootRequest(msg.sender, characterId);
}`,
    tags: ['GameFi', 'Chainlink', 'VRF'],
    likes: 183, comments: 22, reposts: 41, hasCode: true,
  },
  {
    id: 3, author: 'defi_wizard', handle: '@defi_wizard', avatar: 'D', color: '#8b5cf6', time: '6h ago',
    content: 'Thread on tokenomics for sustainable GameFi protocols 🧵\n\n1/ The core problem: most P2E games die because token emission > demand. Here\'s how to fix it...',
    tags: ['Tokenomics', 'GameFi', 'Thread'],
    likes: 412, comments: 89, reposts: 156, hasCode: false,
  },
  {
    id: 4, author: 'nft_king.base', handle: '@nftking', avatar: 'N', color: '#10b981', time: '8h ago',
    content: 'Launched my ERC-4907 rental NFT collection on Base — zero gas for renters! The marketplace integration was surprisingly smooth with Agunnaya AI Studio generating most of the contract logic 🤝',
    tags: ['NFT', 'Base', 'ERC-4907'],
    likes: 97, comments: 15, reposts: 28, hasCode: false,
  },
]

const TRENDING = [
  { name: 'Base AMM', desc: 'Gas-optimized DEX', stars: 234, lang: 'Solidity' },
  { name: 'GameFi Starter', desc: 'XP + reward system', stars: 189, lang: 'Solidity' },
  { name: 'VRF Loot Box', desc: 'Chainlink random drops', stars: 156, lang: 'Solidity' },
  { name: 'DAO Governor', desc: 'On-chain governance', stars: 128, lang: 'Solidity' },
  { name: 'Staking Pool', desc: 'Token staking rewards', stars: 97, lang: 'Solidity' },
]

const BUILDERS = [
  { name: 'vitalik.eth', role: 'Protocol Developer', followers: '12.4k', avatar: 'V', color: '#627eea' },
  { name: '0xSatoshi', role: 'GameFi Builder', followers: '8.1k', avatar: 'S', color: '#f97316' },
  { name: 'defi_wizard', role: 'DeFi Researcher', followers: '6.3k', avatar: 'D', color: '#8b5cf6' },
  { name: 'nft_king.base', role: 'NFT Creator', followers: '3.2k', avatar: 'N', color: '#10b981' },
]

function FeedPost({ post }: { post: typeof FEED[0] }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  return (
    <div className="p-5 rounded-xl border border-slate-700/60 bg-slate-800/30 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: post.color }}>
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{post.author}</p>
            <p className="text-xs text-slate-500">{post.handle} · {post.time}</p>
          </div>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed whitespace-pre-line">{post.content}</p>
          {post.hasCode && post.code && (
            <pre className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>{post.code}</code>
            </pre>
          )}
          <div className="flex gap-2 mt-3 flex-wrap">
            {post.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-blue-600/15 text-blue-400 border border-blue-500/20">{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 text-slate-500 text-xs pt-1 border-t border-slate-800">
        <button onClick={() => { setLiked(!liked); setLikes((l) => liked ? l - 1 : l + 1) }} className={`flex items-center gap-1.5 hover:text-red-400 transition-colors ${liked ? 'text-red-400' : ''}`}>
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {likes}
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <MessageCircle size={14} /> {post.comments}
        </button>
        <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
          <Repeat2 size={14} /> {post.reposts}
        </button>
        <button className="flex items-center gap-1.5 hover:text-slate-300 transition-colors ml-auto">
          <Share2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const { user, loading } = useDashboardUser()
  const [postInput, setPostInput] = useState('')

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-6xl">
        <PageHeader title="Community" subtitle="Connect with Web3 builders and share your work" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Compose */}
            <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={postInput}
                    onChange={(e) => setPostInput(e.target.value)}
                    placeholder="Share a project, code snippet, or Web3 insight…"
                    rows={3}
                    className="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <div className="flex gap-2 text-xs text-slate-500">
                      {['DeFi', 'NFT', 'GameFi', 'Solidity'].map((t) => (
                        <button key={t} onClick={() => setPostInput((p) => p + ' #' + t)} className="hover:text-slate-300 transition-colors">#{t}</button>
                      ))}
                    </div>
                    <Button size="sm" disabled={!postInput.trim()} className="bg-blue-600 hover:bg-blue-700">Post</Button>
                  </div>
                </div>
              </div>
            </div>
            {FEED.map((post) => <FeedPost key={post.id} post={post} />)}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Trending */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} className="text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Trending Projects</h3>
              </div>
              <div className="space-y-3">
                {TRENDING.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={11} />
                      <span className="text-xs">{p.stars}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Builders */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Featured Builders</h3>
              <div className="space-y-3">
                {BUILDERS.map((b) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: b.color }}>
                      {b.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{b.name}</p>
                      <p className="text-xs text-slate-500">{b.role} · {b.followers} followers</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">Follow</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
