import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { createClient } from '@/lib/supabase'
import {
  LayoutDashboard, Sparkles, Code2, FolderOpen, Rocket,
  Key, Gamepad2, Users, Store, CreditCard, Settings,
  Globe, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: string }
type NavSection = { title: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/studio', label: 'AI Studio', icon: Sparkles, badge: 'NEW' },
      { href: '/dashboard/playground', label: 'Dev Playground', icon: Code2 },
    ],
  },
  {
    title: 'Develop',
    items: [
      { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
      { href: '/dashboard/deploy', label: 'Deploy', icon: Rocket },
      { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/dashboard/gamefi', label: 'GameFi', icon: Gamepad2, badge: 'BETA' },
      { href: '/dashboard/community', label: 'Community', icon: Users },
      { href: '/dashboard/marketplace', label: 'Marketplace', icon: Store },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      { href: '/dashboard/ecosystem', label: 'Ecosystem', icon: Globe },
    ],
  },
]

interface DashboardLayoutProps {
  user: User
  children: React.ReactNode
  fullHeight?: boolean
}

function SidebarContent({
  user,
  location,
  onLogout,
  onClose,
}: {
  user: User
  location: string
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <aside className="flex flex-col w-64 border-r border-slate-800 bg-slate-900/60 h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-none">Agunnaya AI</p>
            <p className="text-xs text-slate-500 mt-0.5">Studio</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-white md:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  location === item.href ||
                  (item.href !== '/dashboard' && location.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          item.badge === 'NEW'
                            ? 'bg-blue-600/40 text-blue-300'
                            : 'bg-purple-600/40 text-purple-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(user.email?.[0] ?? 'U').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-slate-500">Free plan</p>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export function DashboardLayout({ user, children, fullHeight = false }: DashboardLayoutProps) {
  const [location, navigate] = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className={`flex bg-slate-950 ${fullHeight ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-screen sticky top-0">
        <SidebarContent user={user} location={location} onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <SidebarContent
            user={user}
            location={location}
            onLogout={handleLogout}
            onClose={() => setSidebarOpen(false)}
          />
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col ${fullHeight ? 'h-screen overflow-hidden' : ''}`}>
        {/* Mobile top bar */}
        <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded" />
            <span className="font-bold text-white text-sm">Agunnaya AI</span>
          </div>
        </div>

        <div className={`flex-1 ${fullHeight ? 'overflow-hidden' : 'overflow-auto'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
}: {
  label: string
  value: string
  subtext: string
  icon?: React.ReactNode
  trend?: { value: string; up: boolean }
}) {
  return (
    <div className="p-5 rounded-xl border border-slate-700/60 bg-slate-800/30 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        {icon && <div className="text-slate-500">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{subtext}</p>
        {trend && (
          <span className={`text-xs font-medium ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
