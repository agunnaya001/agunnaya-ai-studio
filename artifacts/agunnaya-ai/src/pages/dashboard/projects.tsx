import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen, Rocket, Code2, MoreHorizontal, ExternalLink, Trash2, X } from 'lucide-react'

type Project = {
  id: string; name: string; desc: string; stack: string[]; network: string; status: 'active' | 'draft' | 'deployed'; contracts: number; created: string
}

const TEMPLATES = [
  { id: 'erc20', name: 'ERC-20 Token', desc: 'Standard fungible token', icon: '🪙' },
  { id: 'nft', name: 'NFT Collection', desc: 'ERC-721 with metadata', icon: '🖼' },
  { id: 'defi', name: 'DeFi Protocol', desc: 'AMM / lending starter', icon: '🏦' },
  { id: 'gamefi', name: 'GameFi Starter', desc: 'XP + rewards system', icon: '🎮' },
  { id: 'dao', name: 'DAO Governance', desc: 'On-chain voting', icon: '🗳' },
  { id: 'blank', name: 'Blank Project', desc: 'Start from scratch', icon: '📄' },
]

const STATUS_COLORS = { active: 'text-blue-400 bg-blue-500/15', draft: 'text-slate-400 bg-slate-700', deployed: 'text-green-400 bg-green-500/15' }

export default function ProjectsPage() {
  const { user, loading } = useDashboardUser()
  const [projects, setProjects] = useState<Project[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('blank')

  const createProject = () => {
    if (!newName.trim()) return
    const proj: Project = {
      id: Date.now().toString(), name: newName, desc: newDesc || TEMPLATES.find((t) => t.id === selectedTemplate)?.desc || '',
      stack: ['Solidity', 'TypeScript'], network: 'Base Sepolia', status: 'draft', contracts: 0,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    setProjects((prev) => [proj, ...prev])
    setShowModal(false)
    setNewName(''); setNewDesc(''); setSelectedTemplate('blank')
  }

  const deleteProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id))

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-5xl">
        <PageHeader title="Projects" subtitle="Manage your Web3 development projects">
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={15} className="mr-1.5" /> New Project
          </Button>
        </PageHeader>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
              <FolderOpen size={32} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No projects yet</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-sm">Create your first Web3 project to start building with AI-assisted development tools.</p>
            <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={15} className="mr-1.5" /> Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="group p-5 rounded-xl border border-slate-700/60 bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FolderOpen size={20} className="text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    <button onClick={() => deleteProject(p.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{p.name}</h3>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.desc}</p>
                <div className="flex gap-1.5 mb-4">
                  {p.stack.map((s) => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{s}</span>)}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{p.network}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{p.contracts} contracts · {p.created}</span>
                  <div className="flex gap-2">
                    <button className="hover:text-blue-400 transition-colors"><Code2 size={13} /></button>
                    <button className="hover:text-green-400 transition-colors"><Rocket size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Project Name</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createProject()}
                  placeholder="My DeFi Protocol" autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Description (optional)</label>
                <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="A brief description of your project"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Template</label>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((t) => (
                    <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${selectedTemplate === t.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                      <span className="text-xl block mb-1">{t.icon}</span>
                      <p className="text-xs font-medium text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-500">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={createProject} disabled={!newName.trim()}>Create Project</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
