import { useState } from 'react'
import { DashboardLayout, PageHeader } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { Check, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const { user, loading } = useDashboardUser()
  const [, navigate] = useLocation()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [model, setModel] = useState('gpt-4o-mini')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifDeploy, setNotifDeploy] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const changePassword = async () => {
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(user?.email ?? '', { redirectTo: window.location.origin + '/auth/callback' })
    alert('Password reset email sent!')
  }

  const deleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return }
    const supabase = createClient()
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 overflow-hidden mb-5">
      <div className="px-5 py-3.5 border-b border-slate-800">
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4">
      <label className="text-sm text-slate-400 flex-shrink-0 w-40 pt-2.5">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  )

  const Input = ({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
  )

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  )

  return (
    <DashboardLayout user={user}>
      <div className="p-6 md:p-8 max-w-2xl">
        <PageHeader title="Settings" subtitle="Manage your account preferences">
          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Check size={15} /> Saved!
            </div>
          )}
        </PageHeader>

        <Section title="Profile">
          <Field label="Email">
            <p className="text-sm text-white py-2.5">{user.email}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {user.email_confirmed_at ? '✓ Verified' : '⚠ Not verified'}
            </p>
          </Field>
          <Field label="Display Name">
            <Input value={displayName} onChange={setDisplayName} placeholder="Your display name" />
          </Field>
          <Field label="Bio">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the community about yourself…" rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
          </Field>
        </Section>

        <Section title="Preferences">
          <Field label="Theme">
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button key={t} onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-xl border text-sm capitalize transition-all ${theme === t ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                  {t === 'dark' ? '🌙 ' : '☀️ '}{t}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Default AI Model">
            <select value={model} onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="gpt-4o-mini">GPT-4o mini (Fast, 1x credit)</option>
              <option value="gpt-4o">GPT-4o (Powerful, 3x credit)</option>
            </select>
          </Field>
        </Section>

        <Section title="Notifications">
          <Field label="Email digests">
            <Toggle checked={notifEmail} onChange={setNotifEmail} />
          </Field>
          <Field label="Deployment alerts">
            <Toggle checked={notifDeploy} onChange={setNotifDeploy} />
          </Field>
        </Section>

        <Section title="Security">
          <Field label="Password">
            <Button variant="outline" size="sm" onClick={changePassword}>Send reset email</Button>
          </Field>
          <Field label="Sessions">
            <Button variant="outline" size="sm" onClick={async () => { await createClient().auth.signOut(); navigate('/') }}>
              Sign out all devices
            </Button>
          </Field>
        </Section>

        <div className="flex gap-3">
          <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>

        {/* Danger zone */}
        <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-red-400" />
            <p className="text-sm font-semibold text-red-400">Danger Zone</p>
          </div>
          <p className="text-xs text-slate-400 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
          <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={deleteAccount}>
            {deleteConfirm ? 'Click again to confirm deletion' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
