import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),

      // ── Theme ──────────────────────────────────────────
      dark: true,
      themeKey: 'ocean',
      setTheme: (key) => set({ themeKey: key }),
      toggleDark: () => set(s => ({ dark: !s.dark })),

      // ── Navigation ─────────────────────────────────────
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // ── Month/Year ─────────────────────────────────────
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      setMonth: (m) => set({ selectedMonth: m }),
      setYear: (y) => set({ selectedYear: y }),

      // ── Notifications ──────────────────────────────────
      notifications: [],
      addNotification: (notif) => set(s => ({
        notifications: [
          { id: Date.now(), read: false, createdAt: new Date().toISOString(), ...notif },
          ...s.notifications
        ].slice(0, 30)
      })),
      markAllRead: () => set(s => ({
        notifications: s.notifications.map(n => ({ ...n, read: true }))
      })),
      clearNotifications: () => set({ notifications: [] }),

      // ── Toast (Pop-up) ─────────────────────────────────
      toasts: [],
      addToast: (type, title, message) => set(s => ({
        toasts: [
          { id: Date.now(), type, title, message },
          ...s.toasts
        ]
      })),
      removeToast: (id) => set(s => ({
        toasts: s.toasts.filter(t => t.id !== id)
      })),

      // ── Achievements ───────────────────────────────────
      unlockedAchievements: [],
      unlockAchievement: (id) => set(s => {
        if (s.unlockedAchievements.includes(id)) return {}
        return { unlockedAchievements: [...s.unlockedAchievements, id] }
      }),

      // ── Tags ───────────────────────────────────────────
      customTags: ['urgente', 'parcelado', 'recorrente', 'trabalho', 'família'],
      addTag: (tag) => set(s => ({
        customTags: [...new Set([...s.customTags, tag.toLowerCase()])]
      })),
      removeTag: (tag) => set(s => ({
        customTags: s.customTags.filter(t => t !== tag)
      })),

      // ── Sidebar ────────────────────────────────────────
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
    }),
    { name: 'financapro-v2' }
  )
)

