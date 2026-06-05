import { useState, useRef, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Send, Plus, Copy, Check, Shield, Code, Rocket,
  Gamepad2, TrendingUp, MessageCircle, Cpu, Zap, ChevronDown,
} from 'lucide-react'

const AGENTS = [
  { id: 'solidity', name: 'Solidity Agent', icon: Cpu, color: '#3b82f6', badge: 'Popular', desc: 'Smart contracts & DeFi' },
  { id: 'frontend', name: 'Frontend Agent', icon: Code, color: '#8b5cf6', desc: 'React + wagmi + Web3 UI' },
  { id: 'backend', name: 'Backend Agent', icon: Zap, color: '#10b981', desc: 'APIs & infrastructure' },
  { id: 'security', name: 'Security Auditor', icon: Shield, color: '#ef4444', badge: 'Pro', desc: 'Audit & vulnerabilities' },
  { id: 'deployment', name: 'Deploy Agent', icon: Rocket, color: '#f97316', desc: 'Multi-chain deployment' },
  { id: 'gamefi', name: 'GameFi Agent', icon: Gamepad2, color: '#ec4899', desc: 'Games, XP & rewards' },
  { id: 'tokenomics', name: 'Tokenomics', icon: TrendingUp, color: '#06b6d4', desc: 'Token design & DeFi econ' },
  { id: 'telegram', name: 'Telegram Bot', icon: MessageCircle, color: '#6366f1', desc: 'Telegram bots & mini apps' },
]

const MODELS = [
  { id: 'gpt-4o-mini', label: 'GPT-4o mini ⚡' },
  { id: 'gpt-4o', label: 'GPT-4o 🧠' },
]

const STARTERS: Record<string, string[]> = {
  solidity: ['Write an ERC-20 token with 1B supply and fee-on-transfer', 'Create a Uniswap V2-style AMM pool contract', 'Audit this code for reentrancy: function withdraw() { msg.sender.call{value: bal}(""); bal=0; }'],
  frontend: ['Build a wagmi hook to fetch ERC-20 token balance', 'Create a RainbowKit wallet connection component', 'Add ENS reverse lookup to a React component'],
  backend: ['Set up a The Graph subgraph for ERC-20 transfers', 'Build an Alchemy webhook handler in Express', 'Create a Redis caching layer for on-chain data'],
  security: ['Explain the most common Solidity attack vectors', 'Write a Slither config for a DeFi protocol audit', 'What are the risks in this: delegatecall(payload)'],
  deployment: ['Write a Hardhat Ignition script for Base Sepolia', 'How do I set up a UUPS upgradeable proxy?', 'Verify my contract on BaseScan programmatically'],
  gamefi: ['Design an on-chain XP leveling system in Solidity', 'Create a tournament bracket smart contract', 'Build a Chainlink VRF loot drop system'],
  tokenomics: ['Design a dual-token economy for a GameFi protocol', 'Model a 5-year vesting schedule for 1B token supply', 'Compare bonding curve formulas for a launchpad'],
  telegram: ['Create a Telegram price alert bot with web3.js', 'Build a whale wallet tracker for Telegram', 'Add TON Connect payments to a Telegram Mini App'],
}

type Message = { id: string; role: 'user' | 'assistant'; content: string }

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden my-2">
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{lang || 'code'}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors"
        >
          {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto bg-slate-900/80 leading-relaxed">
        <code>{code.trimEnd()}</code>
      </pre>
    </div>
  )
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g)
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {parts.map((part, i) => {
        const m = part.match(/```([\w]*)\n([\s\S]*?)```/)
        if (m) return <CodeBlock key={i} lang={m[1]} code={m[2]} />
        return <p key={i} className="whitespace-pre-wrap">{part}</p>
      })}
    </div>
  )
}

export default function StudioPage() {
  const { user, loading } = useDashboardUser()
  const [activeAgentId, setActiveAgentId] = useState('solidity')
  const [model, setModel] = useState('gpt-4o-mini')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeAgent = AGENTS.find((a) => a.id === activeAgentId)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim()
    if (!userText || streaming) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' }
    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }))
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: history, agentId: activeAgentId, model }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error ?? `HTTP ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: acc } : m))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: `⚠️ ${msg}` } : m))
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }, [messages, streaming, activeAgentId, model])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const switchAgent = (id: string) => {
    setActiveAgentId(id)
    setMessages([])
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  }
  if (!user) return null

  return (
    <DashboardLayout user={user} fullHeight>
      <div className="flex h-full">
        {/* Agents sidebar */}
        <div className="hidden md:flex flex-col w-52 border-r border-slate-800 bg-slate-900/40 flex-shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Agents</p>
          </div>
          <div className="p-2 space-y-0.5 flex-1">
            {AGENTS.map((agent) => {
              const Icon = agent.icon
              const active = agent.id === activeAgentId
              return (
                <button
                  key={agent.id}
                  onClick={() => switchAgent(agent.id)}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg text-left transition-all ${active ? 'bg-slate-700/60 border border-slate-600/50' : 'hover:bg-slate-800/50'}`}
                >
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: agent.color + '22' }}>
                    <Icon size={14} style={{ color: agent.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className={`text-xs font-medium truncate ${active ? 'text-white' : 'text-slate-300'}`}>{agent.name}</p>
                      {agent.badge && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-blue-600/30 text-blue-300 font-semibold flex-shrink-0">{agent.badge}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{agent.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/40 flex-shrink-0">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: activeAgent.color + '22' }}>
              <activeAgent.icon size={14} style={{ color: activeAgent.color }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{activeAgent.name}</p>
              <p className="text-xs text-slate-500">{activeAgent.desc}</p>
            </div>
            {/* Model selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
              >
                {MODELS.find((m) => m.id === model)?.label}
                <ChevronDown size={12} />
              </button>
              {showModelMenu && (
                <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg py-1 z-10 min-w-36">
                  {MODELS.map((m) => (
                    <button key={m.id} onClick={() => { setModel(m.id); setShowModelMenu(false) }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-700 transition-colors ${model === m.id ? 'text-blue-300' : 'text-slate-300'}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={() => setMessages([])} className="text-xs">
              <Plus size={13} className="mr-1" /> New Chat
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: activeAgent.color + '22' }}>
                  <activeAgent.icon size={28} style={{ color: activeAgent.color }} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{activeAgent.name}</h2>
                <p className="text-slate-400 text-sm mb-8 max-w-sm">{activeAgent.desc} — ask me anything!</p>
                <div className="grid grid-cols-1 gap-2 w-full max-w-xl">
                  {(STARTERS[activeAgentId] ?? []).map((s) => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="text-left text-sm px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: activeAgent.color + '22' }}>
                    <activeAgent.icon size={13} style={{ color: activeAgent.color }} />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-bl-sm'}`}>
                  {msg.content === '' && msg.role === 'assistant' ? (
                    <div className="flex gap-1 py-1">
                      {[0, 150, 300].map((d) => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  ) : msg.role === 'assistant' ? (
                    <MessageContent content={msg.content} />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex-shrink-0">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${activeAgent.name}… (Shift+Enter for new line)`}
                rows={1}
                className="flex-1 resize-none bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 max-h-32"
                style={{ minHeight: 46 }}
                onInput={(e) => {
                  const t = e.currentTarget
                  t.style.height = 'auto'
                  t.style.height = Math.min(t.scrollHeight, 128) + 'px'
                }}
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming}
                className="bg-blue-600 hover:bg-blue-700 h-[46px] w-[46px] p-0 flex-shrink-0"
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="text-xs text-slate-600 mt-2 text-center">
              Agunnaya AI can make mistakes. Verify smart contract code before deployment.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
