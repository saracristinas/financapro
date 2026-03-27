import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import {
  LayoutDashboard, CreditCard, PiggyBank, AlertCircle,
  BarChart2, Users, Bot, LogOut, ChevronRight, Bell, Trophy
} from 'lucide-react'
import { clsx } from 'clsx'
import { THEME_CREATURES } from '../../utils'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard, emoji: '🌊' },
  { id: 'expenses',     label: 'Gastos',       icon: CreditCard,      emoji: '💳' },
  { id: 'savings',      label: 'Economias',    icon: PiggyBank,       emoji: '🐠' },
  { id: 'debts',        label: 'Dívidas',      icon: AlertCircle,     emoji: '⚓' },
  { id: 'analytics',   label: 'Análise',      icon: BarChart2,       emoji: '📊' },
  { id: 'achievements', label: 'Conquistas',   icon: Trophy,          emoji: '🏆' },
  { id: 'team',         label: 'Equipe',       icon: Users,           emoji: '🐬' },
  { id: 'ai',           label: 'IA',           icon: Bot,             emoji: '🦑' },
]

const MOBILE_NAV = NAV.slice(0, 5) // show 5 on mobile bottom nav

export function MobileBottomNav() {
  const { activeTab, setActiveTab, notifications } = useAppStore()
  const unread = notifications.filter(n => !n.read).length

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {MOBILE_NAV.map(({ id, label, icon: Icon, emoji }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 relative"
            >
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                active
                  ? 'bg-accent/20 shadow-lg'
                  : 'text-slate-400'
              )} style={active ? { boxShadow: 'var(--glow-sm)' } : {}}>
                <Icon className={clsx('w-5 h-5 transition-all', active ? 'text-accent' : '')} />
              </div>
              <span className={clsx('text-[10px] font-medium transition-colors',
                active ? 'text-accent' : 'text-slate-500')}>
                {label}
              </span>
              {active && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function Sidebar() {
  const { activeTab, setActiveTab, user, logout, sidebarCollapsed, setSidebarCollapsed, themeKey, notifications } = useAppStore()
  const collapsed = sidebarCollapsed
  const unread = notifications.filter(n => !n.read).length
  const creatures = THEME_CREATURES[themeKey] || THEME_CREATURES.ocean

  return (
    <aside className={clsx(
      'hidden md:flex flex-col h-full transition-all duration-300 ease-in-out flex-shrink-0',
      'card rounded-none border-r border-t-0 border-b-0 border-l-0',
      collapsed ? 'w-[68px]' : 'w-[220px]'
    )}>
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 px-3 py-4 border-b border-white/5',
        collapsed && 'justify-center px-2'
      )}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow"
          style={{ background: 'var(--gradient-accent)' }}>
          <span className="text-white font-display font-black text-base">F</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-base leading-tight whitespace-nowrap">
              Finança<span className="gradient-text">Pro</span>
            </p>
            <p className="text-[10px] text-muted capitalize">{themeKey} edition 🌊</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setSidebarCollapsed(true)}
            className="ml-auto text-slate-500 hover:text-accent transition-colors p-1">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button onClick={() => setSidebarCollapsed(false)}
          className="flex justify-center pt-2 text-slate-500 hover:text-accent transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
      )}

      {/* Nav */}
      <nav className={clsx('flex-1 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden', collapsed ? 'px-1.5' : 'px-2')}>
        {NAV.map(({ id, label, icon: Icon, emoji }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={collapsed ? label : undefined}
              className={clsx(
                'w-full flex items-center gap-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                active
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )}
              style={active ? { background: 'var(--gradient-accent)', boxShadow: 'var(--glow-sm)' } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}
              {!collapsed && id === 'achievements' && (
                <span className="ml-auto text-xs">{emoji}</span>
              )}
              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs font-medium
                  bg-slate-900 text-white border border-white/10 whitespace-nowrap
                  opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {label}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* User section */}
      <div className={clsx('border-t border-white/5', collapsed ? 'p-2' : 'p-3')}>
        {/* Notifications */}
        <button
          onClick={() => setActiveTab('notifications')}
          className={clsx(
            'w-full flex items-center gap-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all relative',
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2'
          )}
        >
          <div className="relative flex-shrink-0">
            <Bell className="w-4 h-4" />
            {unread > 0 && <span className="notif-dot" />}
          </div>
          {!collapsed && <span>Notificações {unread > 0 && `(${unread})`}</span>}
        </button>

        {!collapsed && user && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--gradient-accent)' }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-muted truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={logout}
          className={clsx(
            'w-full flex items-center gap-2.5 rounded-xl text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all mt-1',
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2'
          )}>
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && 'Sair'}
        </button>
      </div>
    </aside>
  )
}