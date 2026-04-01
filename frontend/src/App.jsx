import React, { useEffect, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import Sidebar, { MobileBottomNav } from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './components/dashboard/Dashboard'
import Expenses from './components/expenses/Expenses'
import Savings from './components/savings/Savings'
import Debts from './components/debts/Debts'
import Analytics from './components/analytics/Analytics'
import { LoginPage, RegisterPage, ForgotPasswordPage } from './components/auth/AuthPages'
import Achievements from './components/achievements/Achievements'
import Team from './components/team/Team'
import Toast from './components/Toast'
import { THEME_OPTIONS, THEME_CREATURES } from './utils'

const TABS = {
  dashboard:    { component: Dashboard },
  expenses:     { component: Expenses },
  debts:        { component: Debts },
  analytics:    { component: Analytics },
  achievements: { component: Achievements },
  team:         { component: Team },
}

// Ocean background creatures — ambient decoration
function AmbientCreatures({ themeKey }) {
  const creatures = THEME_CREATURES[themeKey] || THEME_CREATURES.ocean
  const positions = [
    { right: '3%',  top: '15%', delay: '0s',   duration: '10s', opacity: 0.04 },
    { left:  '2%',  top: '55%', delay: '2.5s', duration: '14s', opacity: 0.03 },
    { right: '8%',  top: '70%', delay: '5s',   duration: '12s', opacity: 0.035 },
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <div key={i} className="fixed pointer-events-none z-0 text-6xl sm:text-8xl select-none animate-float"
          style={{
            right: pos.right, left: pos.left,
            top: pos.top, opacity: pos.opacity,
            animationDelay: pos.delay, animationDuration: pos.duration
          }}>
          {creatures[i % creatures.length]}
        </div>
      ))}
    </>
  )
}

export default function App() {
  const { token, dark, themeKey, activeTab, toasts, removeToast } = useAppStore()
  const [authMode, setAuthMode] = useState('login')

  // Apply dark class
  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
    document.body.classList.toggle('light', !dark)
  }, [dark])

  // Apply theme class
  useEffect(() => {
    const themeClasses = THEME_OPTIONS.map(t => t.class).filter(Boolean)
    document.documentElement.classList.remove(...themeClasses)
    document.documentElement.classList.add(themeKey)
  }, [themeKey])

  // Auth pages
  if (!token) {
    if (authMode === 'login') return <LoginPage onSwitch={() => setAuthMode('register')} onForgot={() => setAuthMode('forgot')} />
    if (authMode === 'register') return <RegisterPage onSwitch={() => setAuthMode('login')} />
    if (authMode === 'forgot') return <ForgotPasswordPage onSwitch={() => setAuthMode('login')} />
  }

  const tab = TABS[activeTab] || TABS.dashboard
  const PageComponent = tab.component

  return (
    <div className="flex h-dvh overflow-hidden relative">
      {/* Ocean background */}
      <div className="ocean-bg" />
      <AmbientCreatures themeKey={themeKey} />

      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto px-3 sm:px-5 pt-4 relative">
          <PageComponent />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

