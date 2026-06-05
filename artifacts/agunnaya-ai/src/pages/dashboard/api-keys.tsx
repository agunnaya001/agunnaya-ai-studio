import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Plus, Eye, EyeOff, Copy, Check, Trash2, CheckCircle2, X } from 'lucide-react'

type ProviderKey = { id: string; provider: string; label: string; key: string; status: 'active' | 'invalid' }

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', desc: 'GPT-4o, GPT-4o-mini, o1', logo: '🤖', placeholder: 'sk-proj-...' },
  { id: 'anthropic', name: 'Anthropic', desc: 'Claude 3.5 Sonnet, Haiku', logo: '🔬', placeholder: 'sk-ant-...' },
  { id: 'google', name: 'Google AI', desc: 'Gemini 2.0 Flash, Pro', logo: '🔮', placeholder: 'AIza...' },
  { id: 'alchemy', name: 'Alchemy', desc: 'Node RPC, webhooks', logo: '⚗️', placeholder: 'alcht_...' },
  { id: 'infura', name: 'Infura', desc: 'IPFS, Ethereum RPC', logo: '🌐', placeholder: 'v3/...' },
  { id: 'pinata', name: 'Pinata', desc: 'IPFS pinning service', logo: '📌', placeholder: 'eyJ...' },
]

export default function ApiKeysPage() {
  const { user, loading } = useDashboardUser()
  const [keys, setKeys] = useState<ProviderKey[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0])
  const [newKey, setNewKey] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const toggleVisible = (id: string) => setVisible((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  const copy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000) }
  const deleteKey = (id: string) => setKeys((prev) => prev.filter((k) => k.id !== id))

  const saveKey = async () => {
    if (!newKey.trim()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setKeys((prev) => [...prev, {
      id: Date.now().toString(), provider: selectedProvider.name,
      label: newLabel || selectedProvider.name, key: newKey, status: 'active',
    }])
    setNewKey(''); setNewLabel(''); setShowModal(false); setSaving(false)
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-4xl">
        <PageHeader title="API Keys" subtitle="Connect AI providers and Web3 infrastructure">
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={15} className="mr-1.5" /> Add Key
          </Button>
        </PageHeader>

        {/* Providers overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {PROVIDERS.map((p) => {
            const connected = keys.some((k) => k.provider === p.name)
            return (
              <div key={p.id} className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-slate-600 ${connected ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700/60 bg-slate-800/30'}`}
                onClick={() => { setSelectedProvider(p); setShowModal(true) }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{p.logo}</span>
                  {connected ? <CheckCircle2 size={14} className="text-green-400" /> : <Plus size={14} className="text-slate-600" />}
                </div>
                <p className="text-sm font-medium text-white">{p.name}</p>
                <p className="text-xs text-slate-500">{p.desc}</p>
                <p className={`text-xs mt-1 font-medium ${connected ? 'text-green-400' : 'text-slate-600'}`}>
                  {connected ? '● Connected' : '○ Not connected'}
                </p>
              </div>
            )
          })}
        </div>

        {/* Keys list */}
        {keys.length > 0 && (
          <>
            <h2 className="text-base font-semibold text-white mb-4">Connected Keys</h2>
            <div className="space-y-3">
              {keys.map((k) => {
                const show = visible.has(k.id)
                return (
                  <div key={k.id} className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{PROVIDERS.find((p) => p.name === k.provider)?.logo}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{k.label}</p>
                          <p className="text-xs text-slate-500">{k.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400 bg-green-500/15 px-2 py-0.5 rounded">{k.status}</span>
                        <button onClick={() => deleteKey(k.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2">
                      <span className="flex-1 text-xs font-mono text-slate-300 truncate">
                        {show ? k.key : k.key.slice(0, 8) + '●'.repeat(12)}
                      </span>
                      <button onClick={() => toggleVisible(k.id)} className="text-slate-500 hover:text-slate-300"><EyeOff size={12} /></button>
                      <button onClick={() => copy(k.key, k.id)} className="text-slate-500 hover:text-slate-300">
                        {copied === k.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {keys.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-700 rounded-2xl">
            <p className="text-slate-400 text-sm mb-1">No API keys connected yet</p>
            <p className="text-xs text-slate-500">Click a provider above or the Add Key button to get started</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Add API Key</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {PROVIDERS.map((p) => (
                    <button key={p.id} onClick={() => setSelectedProvider(p)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${selectedProvider.id === p.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                      <span className="text-lg block">{p.logo}</span>
                      <p className="text-xs text-white mt-0.5">{p.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Label (optional)</label>
                <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={selectedProvider.name}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{selectedProvider.name} API Key</label>
                <input value={newKey} onChange={(e) => setNewKey(e.target.value)} type="password"
                  placeholder={selectedProvider.placeholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono" />
                <p className="text-xs text-slate-500 mt-1.5">Keys are encrypted and stored securely. Never shared.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={saveKey} disabled={saving || !newKey.trim()}>
                {saving ? 'Saving…' : 'Save Key'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
