import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Copy, Check, Plus, Trash2, Globe, Terminal, Webhook, BarChart3, Key, Eye, EyeOff } from 'lucide-react'

type ApiKey = { id: string; name: string; key: string; created: string; lastUsed: string; calls: number }

const INITIAL_KEYS: ApiKey[] = [
  { id: '1', name: 'Production Key', key: 'aga_live_sk_0a1b2c3d4e5f6g7h8i9j', created: 'Jun 1, 2026', lastUsed: 'Just now', calls: 1240 },
]

const SDK_OPTIONS = [
  { lang: 'TypeScript', install: 'npm install @agunnaya/sdk', import: "import { AgunnayaClient } from '@agunnaya/sdk'" },
  { lang: 'Python', install: 'pip install agunnaya', import: 'from agunnaya import AgunnayaClient' },
  { lang: 'Go', install: 'go get github.com/agunnaya/go-sdk', import: 'import "github.com/agunnaya/go-sdk"' },
]

const WEBHOOKS = [
  { event: 'deploy.success', url: 'https://myapp.com/hooks/deploy', status: 'active' },
  { event: 'audit.complete', url: 'https://myapp.com/hooks/audit', status: 'active' },
]

const METRICS = [
  { label: 'API Calls (30d)', value: '1,240', delta: '+18%', up: true },
  { label: 'Avg Latency', value: '284ms', delta: '-12%', up: true },
  { label: 'Error Rate', value: '0.4%', delta: '-0.2%', up: true },
  { label: 'Tokens Used', value: '48.2k', delta: '+22%', up: false },
]

export default function EcosystemPage() {
  const { user, loading } = useDashboardUser()
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS)
  const [showKey, setShowKey] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)
  const [tab, setTab] = useState<'api' | 'sdk' | 'webhooks' | 'analytics'>('api')
  const [sdkLang, setSdkLang] = useState(0)
  const [newKeyName, setNewKeyName] = useState('')
  const [creating, setCreating] = useState(false)

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleShow = (id: string) => setShowKey((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const createKey = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    await new Promise((r) => setTimeout(r, 800))
    const newKey: ApiKey = {
      id: Date.now().toString(), name: newKeyName,
      key: 'aga_live_sk_' + Math.random().toString(36).slice(2, 22),
      created: 'Just now', lastUsed: 'Never', calls: 0,
    }
    setKeys((prev) => [...prev, newKey])
    setNewKeyName('')
    setCreating(false)
  }

  const deleteKey = (id: string) => setKeys((prev) => prev.filter((k) => k.id !== id))

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  const sdk = SDK_OPTIONS[sdkLang]

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-5xl">
        <PageHeader title="Ecosystem" subtitle="API keys, SDKs, webhooks, and platform analytics" />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1 w-fit">
          {([
            { id: 'api', label: 'API Keys', icon: Key },
            { id: 'sdk', label: 'SDK', icon: Terminal },
            { id: 'webhooks', label: 'Webhooks', icon: Webhook },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ] as const).map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                <Icon size={13} /> {t.label}
              </button>
            )
          })}
        </div>

        {tab === 'api' && (
          <div className="space-y-5">
            {/* Create key */}
            <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
              <p className="text-sm font-semibold text-white mb-3">Create API Key</p>
              <div className="flex gap-3">
                <input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createKey()}
                  placeholder="Key name (e.g. Production, CI/CD)"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                <Button onClick={createKey} disabled={creating || !newKeyName.trim()} className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={14} className="mr-1" /> {creating ? 'Creating…' : 'Create'}
                </Button>
              </div>
            </div>
            {/* Keys list */}
            <div className="space-y-3">
              {keys.map((k) => {
                const visible = showKey.has(k.id)
                const maskedKey = visible ? k.key : k.key.slice(0, 12) + '●'.repeat(8)
                return (
                  <div key={k.id} className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{k.name}</p>
                        <p className="text-xs text-slate-500">Created {k.created} · Last used {k.lastUsed} · {k.calls.toLocaleString()} calls</p>
                      </div>
                      <button onClick={() => deleteKey(k.id)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2 font-mono text-xs">
                      <Key size={11} className="text-slate-500 flex-shrink-0" />
                      <span className="flex-1 text-slate-300 truncate">{maskedKey}</span>
                      <button onClick={() => toggleShow(k.id)} className="text-slate-500 hover:text-slate-300 ml-1">
                        {visible ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button onClick={() => copy(k.key, k.id)} className="text-slate-500 hover:text-slate-300">
                        {copied === k.id ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-400">
              ⚠️ Keep your API keys secret. Never expose them in frontend code or public repos.
            </div>
          </div>
        )}

        {tab === 'sdk' && (
          <div className="space-y-5">
            <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1 w-fit">
              {SDK_OPTIONS.map((s, i) => (
                <button key={s.lang} onClick={() => setSdkLang(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sdkLang === i ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {s.lang}
                </button>
              ))}
            </div>
            {[
              { label: 'Install', code: sdk.install },
              { label: 'Import', code: sdk.import },
              { label: 'Initialize', code: `const client = new AgunnayaClient({ apiKey: process.env.AGUNNAYA_API_KEY })\n\n// Generate a smart contract\nconst { code } = await client.generate({\n  agent: 'solidity',\n  prompt: 'ERC-20 token with 1B supply',\n  model: 'gpt-4o-mini',\n})` },
              { label: 'Stream a response', code: `const stream = await client.stream({\n  agent: 'security',\n  prompt: 'Audit this contract for vulnerabilities',\n  context: solidityCode,\n})\n\nfor await (const chunk of stream) {\n  process.stdout.write(chunk)\n}` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-700/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                  <button onClick={() => copy(item.code, item.label)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-white">
                    {copied === item.label ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto bg-slate-900/50"><code>{item.code}</code></pre>
              </div>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" size="sm"><Globe size={13} className="mr-1.5" /> Full Docs</Button>
              <Button variant="outline" size="sm"><Terminal size={13} className="mr-1.5" /> CLI Reference</Button>
            </div>
          </div>
        )}

        {tab === 'webhooks' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/30 space-y-3">
              <p className="text-sm font-semibold text-white">Add Webhook</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Event</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option>deploy.success</option>
                    <option>deploy.failed</option>
                    <option>audit.complete</option>
                    <option>agent.response</option>
                    <option>credits.low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Endpoint URL</label>
                  <input placeholder="https://your-app.com/webhook" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Plus size={13} className="mr-1" /> Register Webhook</Button>
            </div>
            <div className="space-y-3">
              {WEBHOOKS.map((w) => (
                <div key={w.event} className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{w.event}</p>
                    <p className="text-xs text-slate-500 truncate font-mono">{w.url}</p>
                  </div>
                  <span className="text-xs text-green-400 bg-green-500/15 px-2 py-0.5 rounded">{w.status}</span>
                  <button className="text-slate-600 hover:text-red-400"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {METRICS.map((m) => (
                <div key={m.label} className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
                  <p className="text-xs text-slate-400 mb-2">{m.label}</p>
                  <p className="text-2xl font-bold text-white">{m.value}</p>
                  <span className={`text-xs font-medium ${m.up ? 'text-green-400' : 'text-red-400'}`}>{m.delta} vs last month</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-xl border border-slate-700/60 bg-slate-800/30">
              <p className="text-sm font-semibold text-white mb-4">API Calls — Last 30 Days</p>
              <div className="flex items-end gap-1 h-24">
                {Array.from({ length: 30 }, (_, i) => {
                  const h = Math.max(8, Math.round(Math.random() * 100))
                  return (
                    <div key={i} className="flex-1 rounded-sm bg-blue-500/40 hover:bg-blue-500/70 transition-colors" style={{ height: `${h}%` }} title={`Day ${i + 1}: ~${h * 15} calls`} />
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-600 mt-2">
                <span>Jun 1</span><span>Jun 15</span><span>Jun 30</span>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-slate-700/60 bg-slate-800/30">
              <p className="text-sm font-semibold text-white mb-4">Usage by Agent</p>
              {[
                { name: 'Solidity Agent', calls: 620, pct: 50 },
                { name: 'Security Auditor', calls: 248, pct: 20 },
                { name: 'Frontend Agent', calls: 186, pct: 15 },
                { name: 'Deploy Agent', calls: 124, pct: 10 },
                { name: 'Others', calls: 62, pct: 5 },
              ].map((a) => (
                <div key={a.name} className="flex items-center gap-3 mb-2.5">
                  <span className="text-xs text-slate-400 w-36">{a.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${a.pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-16 text-right">{a.calls.toLocaleString()} calls</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
