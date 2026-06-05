import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Rocket, ExternalLink, CheckCircle2, Clock, XCircle, Wallet, ChevronDown, Copy, Check } from 'lucide-react'

const NETWORKS = [
  { id: 'base-sepolia', name: 'Base Sepolia', chain: 'Base Testnet', color: '#0052ff', badge: 'Testnet', rpc: 'https://sepolia.base.org' },
  { id: 'base', name: 'Base Mainnet', chain: 'Base', color: '#0052ff', badge: 'Mainnet' },
  { id: 'ethereum', name: 'Ethereum', chain: 'ETH Mainnet', color: '#627eea', badge: 'Mainnet' },
  { id: 'polygon', name: 'Polygon', chain: 'MATIC', color: '#8247e5', badge: 'Mainnet' },
]

const HISTORY = [
  { name: 'MyToken.sol', network: 'Base Sepolia', address: '0x1234...abcd', status: 'verified', time: '2 min ago', gas: '0.00042 ETH', explorer: 'https://sepolia.basescan.org' },
  { name: 'NFTCollection.sol', network: 'Base Sepolia', address: '0xdead...beef', status: 'success', time: '1 hr ago', gas: '0.00089 ETH', explorer: 'https://sepolia.basescan.org' },
  { name: 'StakingPool.sol', network: 'Ethereum', address: '0xface...cafe', status: 'failed', time: '3 hr ago', gas: '—', explorer: '' },
]

const STATUS_ICON = {
  verified: <CheckCircle2 size={14} className="text-green-400" />,
  success: <CheckCircle2 size={14} className="text-blue-400" />,
  failed: <XCircle size={14} className="text-red-400" />,
  pending: <Clock size={14} className="text-yellow-400" />,
}

export default function DeployPage() {
  const { user, loading } = useDashboardUser()
  const [selectedNet, setSelectedNet] = useState('base-sepolia')
  const [walletConnected, setWalletConnected] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [code, setCode] = useState('')
  const [constructorArgs, setConstructorArgs] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [deployMsg, setDeployMsg] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [showNetMenu, setShowNetMenu] = useState(false)

  const net = NETWORKS.find((n) => n.id === selectedNet)!

  const simulateDeploy = async () => {
    if (!code.trim()) { setDeployMsg('⚠️ Paste your contract bytecode or ABI first.'); return }
    setDeploying(true); setDeployMsg('')
    await new Promise((r) => setTimeout(r, 2500))
    setDeployMsg('✅ Deployed to ' + net.name + '! Address: 0x' + Math.random().toString(16).slice(2, 10) + '…' + Math.random().toString(16).slice(2, 6))
    setDeploying(false)
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-5xl">
        <PageHeader title="Web3 Deployment" subtitle="Deploy smart contracts to EVM chains with one click">
          {walletConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              0x71C...3F8a
            </div>
          ) : (
            <Button onClick={() => setShowWalletModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Wallet size={15} className="mr-2" /> Connect Wallet
            </Button>
          )}
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Deploy form */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white">Deploy Contract</h2>
            {/* Network selector */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Network</label>
              <div className="relative">
                <button onClick={() => setShowNetMenu(!showNetMenu)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-left transition-colors">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: net.color + '33' }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: net.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{net.name}</p>
                    <p className="text-xs text-slate-500">{net.chain}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${net.badge === 'Testnet' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{net.badge}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                {showNetMenu && (
                  <div className="absolute inset-x-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl py-1 z-10">
                    {NETWORKS.map((n) => (
                      <button key={n.id} onClick={() => { setSelectedNet(n.id); setShowNetMenu(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 text-left transition-colors ${n.id === selectedNet ? 'text-blue-300' : 'text-slate-300'}`}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: n.color + '33' }}>
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.color }} />
                        </div>
                        <span className="text-sm">{n.name}</span>
                        <span className={`ml-auto text-xs ${n.badge === 'Testnet' ? 'text-yellow-400' : 'text-green-400'}`}>{n.badge}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Bytecode/ABI */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Contract Bytecode or ABI</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={'Paste your compiled bytecode (0x...) or ABI JSON here\n\nTip: Use the Dev Playground to compile your contract first'}
                rows={6}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            {/* Constructor args */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Constructor Arguments (ABI-encoded, optional)</label>
              <input
                value={constructorArgs}
                onChange={(e) => setConstructorArgs(e.target.value)}
                placeholder="0x000000000000000000000000..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Gas estimate */}
            <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400">
              <div><span className="text-slate-500">Est. Gas</span><p className="text-white font-mono mt-0.5">~250,000</p></div>
              <div><span className="text-slate-500">Gas Price</span><p className="text-white font-mono mt-0.5">0.001 Gwei</p></div>
              <div><span className="text-slate-500">Est. Cost</span><p className="text-white font-mono mt-0.5">~0.00025 ETH</p></div>
            </div>
            {deployMsg && <p className="text-sm text-green-400 font-mono bg-green-500/10 border border-green-500/20 rounded-xl p-3">{deployMsg}</p>}
            <Button onClick={simulateDeploy} disabled={deploying || !walletConnected} className="w-full bg-blue-600 hover:bg-blue-700 h-11">
              {deploying ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Deploying…</> : !walletConnected ? 'Connect wallet to deploy' : <><Rocket size={15} className="mr-2" /> Deploy to {net.name}</>}
            </Button>
            {!walletConnected && <p className="text-xs text-slate-500 text-center">Connect your wallet to enable deployment</p>}
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white">Supported Chains</h2>
            {NETWORKS.map((n) => (
              <div key={n.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-800/30">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: n.color + '22' }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: n.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{n.name}</p>
                  <p className="text-xs text-slate-500">{n.chain} · Auto-verify</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${n.badge === 'Testnet' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-green-500/15 text-green-400'}`}>{n.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment history */}
        <h2 className="text-base font-semibold text-white mb-4">Deployment History</h2>
        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          <div className="grid grid-cols-5 px-5 py-2.5 text-xs text-slate-500 border-b border-slate-800 font-medium bg-slate-800/30">
            <span>Contract</span><span>Network</span><span>Address</span><span>Gas</span><span>Status</span>
          </div>
          {HISTORY.map((h, i) => (
            <div key={i} className={`grid grid-cols-5 items-center px-5 py-3.5 text-sm ${i < HISTORY.length - 1 ? 'border-b border-slate-800' : ''}`}>
              <span className="text-white font-medium">{h.name}</span>
              <span className="text-slate-400">{h.network}</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-mono text-xs">{h.address}</span>
                <button onClick={() => copy(h.address, h.address)} className="text-slate-600 hover:text-slate-300">
                  {copied === h.address ? <Check size={11} /> : <Copy size={11} />}
                </button>
              </div>
              <span className="text-slate-400 text-xs">{h.gas}</span>
              <div className="flex items-center gap-1.5">
                {STATUS_ICON[h.status as keyof typeof STATUS_ICON]}
                <span className="text-xs capitalize text-slate-400">{h.status}</span>
                {h.explorer && <a href={h.explorer} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-400 ml-1"><ExternalLink size={11} /></a>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-1">Connect Wallet</h3>
            <p className="text-sm text-slate-400 mb-5">Choose your preferred wallet</p>
            {[
              { name: 'Coinbase Wallet', recommended: true },
              { name: 'MetaMask', recommended: false },
              { name: 'WalletConnect', recommended: false },
              { name: 'Coinbase Smart Wallet', recommended: false },
            ].map((w) => (
              <button key={w.name} onClick={() => { setWalletConnected(true); setShowWalletModal(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors mb-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-lg">
                  {w.name === 'MetaMask' ? '🦊' : w.name === 'WalletConnect' ? '🔗' : '🟦'}
                </div>
                <span className="text-sm text-white flex-1">{w.name}</span>
                {w.recommended && <span className="text-xs text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded">Recommended</span>}
              </button>
            ))}
            <Button variant="outline" className="w-full mt-2" onClick={() => setShowWalletModal(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
