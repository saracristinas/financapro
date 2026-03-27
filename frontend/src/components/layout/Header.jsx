import React, { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Palette, ChevronDown, Bell, BellOff } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { MONTHS, THEME_OPTIONS, THEME_CREATURES } from '../../utils'
import { clsx } from 'clsx'

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

const PAGE_TITLES = {
  dashboard:    { title: 'Dashboard', emoji: '🌊' },
  expenses:     { title: 'Gastos',    emoji: '💳' },
  savings:      { title: 'Economias', emoji: '🐠' },
  debts:        { title: 'Dívidas',   emoji: '⚓' },
  analytics:    { title: 'Análise',   emoji: '📊' },
  achievements: { title: 'Conquistas',emoji: '🏆' },
  team:         { title: 'Equipe',    emoji: '🐬' },
  ai:           { title: 'IA Financeira', emoji: '🦑' },
  notifications:{ title: 'Notificações', emoji: '🔔' },
}

export default function Header() {
  const {
    dark, toggleDark, themeKey, setTheme,
    selectedMonth, selectedYear, setMonth, setYear,
    activeTab, notifications, markAllRead
  } = useAppStore()

  const [showPalette, setShowPalette] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const paletteRef = useRef(null)
  const notifRef = useRef(null)

  const unread = notifications.filter(n => !n.read).length
  const page = PAGE_TITLES[activeTab] || PAGE_TITLES.dashboard
  const creatures = THEME_CREATURES[themeKey] || THEME_CREATURES.ocean

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) setShowPalette(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4
      card rounded-none border-l-0 border-r-0 border-t-0 sticky top-0 z-40">

      {/* Page title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xl hidden sm:block">{page.emoji}</span>
        <h1 className="font-display font-bold text-base sm:text-xl truncate">{page.title}</h1>
      </div>

      {/* Month/Year — compact on mobile */}
      <div className="flex items-center gap-1.5">
        <select
          value={selectedMonth}
          onChange={e => setMonth(Number(e.target.value))}
          className="input !w-auto !py-1.5 !px-2 text-xs sm:text-sm cursor-pointer"
          style={{ minWidth: 0 }}
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{window.innerWidth < 400 ? m.slice(0,3) : m}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={e => setYear(Number(e.target.value))}
          className="input !w-[72px] !py-1.5 !px-2 text-xs sm:text-sm cursor-pointer"
        >
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Icon buttons */}
      <div className="flex items-center gap-1">
        {/* Theme palette */}
        <div className="relative" ref={paletteRef}>
          <button onClick={() => setShowPalette(p => !p)}
            className={clsx(
              'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all',
              showPalette ? 'bg-accent/20 text-accent' : 'text-slate-400 hover:text-accent hover:bg-white/5'
            )}>
            <Palette className="w-4 h-4" />
          </button>

          {showPalette && (
            <div className="absolute right-0 top-11 card shadow-2xl p-3 z-50 w-52 animate-scale-in">
              <p className="text-xs text-muted mb-2 font-medium">Tema da aplicação</p>
              <div className="grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map(t => (
                  <button key={t.key} onClick={() => { setTheme(t.key); setShowPalette(false) }}
                    className={clsx(
                      'flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all',
                      themeKey === t.key
                        ? 'bg-white/10 border border-accent/40'
                        : 'hover:bg-white/5 border border-transparent'
                    )}>
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ background: t.preview, borderColor: themeKey === t.key ? '#fff' : 'transparent' }}>
                      {themeKey === t.key && <span className="text-white text-[8px]">✓</span>}
                    </span>
                    <span className="text-[10px] leading-tight text-center">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="divider" />
              <p className="text-[10px] text-muted text-center">
                Criaturas: {creatures.slice(0,4).join(' ')}
              </p>
            </div>
          )}
        </div>

        {/* Dark/Light toggle */}
        <button onClick={toggleDark}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-accent hover:bg-white/5 transition-all">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setShowNotifs(p => !p); if (unread > 0) markAllRead() }}
            className={clsx(
              'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all relative',
              showNotifs ? 'bg-accent/20 text-accent' : 'text-slate-400 hover:text-accent hover:bg-white/5'
            )}>
            <Bell className="w-4 h-4" />
            {unread > 0 && <span className="notif-dot" />}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-11 card shadow-2xl z-50 w-72 sm:w-80 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <p className="text-sm font-semibold">Notificações</p>
                <span className="text-[10px] text-muted">{notifications.length} no total</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-muted">
                    <BellOff className="w-6 h-6 opacity-40" />
                    <p className="text-sm">Tudo certo por aqui!</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div key={n.id} className={clsx(
                      'flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0',
                      !n.read && 'bg-accent/5'
                    )}>
                      <span className="text-lg flex-shrink-0 mt-0.5">{n.emoji || '🔔'}</span>
                      <div>
                        <p className="text-xs font-medium">{n.title}</p>
                        <p className="text-[11px] text-muted mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}