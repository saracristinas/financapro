import { format, isAfter, addDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

export const formatDate = (d) =>
  d ? format(new Date(d), 'dd/MM/yyyy', { locale: ptBR }) : '—'

export const formatDateShort = (d) =>
  d ? format(new Date(d), 'dd/MM', { locale: ptBR }) : '—'

export const formatMonth = (d) =>
  d ? format(new Date(d), 'MMM yyyy', { locale: ptBR }) : '—'

export const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]
export const MONTH_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export const CATEGORIES = {
  HOUSING:    { label: 'Moradia',      color: '#6366f1', emoji: '🏠', gradient: 'from-indigo-500 to-violet-500' },
  FOOD:       { label: 'Alimentação',  color: '#f59e0b', emoji: '🍔', gradient: 'from-amber-500 to-orange-400' },
  TRANSPORT:  { label: 'Transporte',   color: '#06b6d4', emoji: '🚗', gradient: 'from-cyan-500 to-blue-400' },
  HEALTH:     { label: 'Saúde',        color: '#10b981', emoji: '💊', gradient: 'from-emerald-500 to-teal-400' },
  LEISURE:    { label: 'Lazer',        color: '#f43f5e', emoji: '🎮', gradient: 'from-rose-500 to-pink-400' },
  EDUCATION:  { label: 'Educação',     color: '#8b5cf6', emoji: '📚', gradient: 'from-violet-500 to-purple-400' },
  CLOTHING:   { label: 'Vestuário',    color: '#ec4899', emoji: '👕', gradient: 'from-pink-500 to-rose-400' },
  OTHERS:     { label: 'Outros',       color: '#64748b', emoji: '📦', gradient: 'from-slate-500 to-zinc-400' },
  SALARY:     { label: 'Salário',      color: '#22c55e', emoji: '💰', gradient: 'from-green-500 to-emerald-400' },
  FREELANCE:  { label: 'Freelance',    color: '#a3e635', emoji: '💻', gradient: 'from-lime-500 to-green-400' },
  INVESTMENT: { label: 'Investimento', color: '#0ea5e9', emoji: '📈', gradient: 'from-sky-500 to-blue-400' },
}

// Ocean theme palette for charts
export const OCEAN_COLORS = [
  '#0ea5e9','#06b6d4','#22d3ee','#10b981','#6366f1',
  '#f43f5e','#f59e0b','#8b5cf6','#ec4899','#a3e635'
]

export const THEME_OPTIONS = [
  { key: 'ocean',   label: 'Oceano 🌊',  class: '',              preview: '#0ea5e9' },
  { key: 'safari',  label: 'Safari 🦁',  class: 'theme-safari',  preview: '#f59e0b' },
  { key: 'space',   label: 'Espaço 🚀',  class: 'theme-space',   preview: '#8b5cf6' },
  { key: 'cinema',  label: 'Cinema 🎬',  class: 'theme-cinema',  preview: '#ef4444' },
  { key: 'forest',  label: 'Floresta 🌿',class: 'theme-forest',  preview: '#10b981' },
  { key: 'rose',    label: 'Rosa 🌸',    class: 'theme-rose',    preview: '#ec4899' },
]

export const THEME_CREATURES = {
  ocean:  ['🐋','🐬','🦈','🐙','🦑','🐠','🦞','🐡'],
  safari: ['🦁','🐘','🦒','🦓','🦏','🐆','🦛','🦍'],
  space:  ['🚀','🛸','⭐','🌙','🪐','☄️','🌌','👾'],
  cinema: ['🎬','🎭','🎪','🎠','🎡','🎢','🎥','🎞️'],
  forest: ['🦋','🌿','🍄','🦔','🦌','🐻','🌲','🍃'],
  rose:   ['🌸','🌹','🌺','🌻','🦩','🦢','🦜','🌷'],
}

// ── Achievements ─────────────────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_transaction', emoji: '🌊', title: 'Primeira Onda', desc: 'Registrou sua primeira transação', points: 50 },
  { id: 'first_saving',      emoji: '🐠', title: 'Peixe Poupador', desc: 'Criou sua primeira meta de economia', points: 100 },
  { id: 'first_debt_paid',   emoji: '🐙', title: 'Tentáculo Livre', desc: 'Quitou uma dívida completamente', points: 200 },
  { id: 'savings_50pct',     emoji: '🐬', title: 'Golfinho Veloz', desc: 'Meta de economia chegou a 50%', points: 150 },
  { id: 'savings_100pct',    emoji: '🐳', title: 'Baleia Campeã', desc: 'Meta de economia concluída!', points: 500 },
  { id: 'no_debt',           emoji: '🦈', title: 'Tubarão Livre', desc: 'Sem dívidas pendentes', points: 300 },
  { id: 'budget_3months',    emoji: '🦑', title: 'Calamar Persistente', desc: 'Registrou dados por 3 meses', points: 250 },
  { id: 'positive_balance',  emoji: '🌟', title: 'Estrela do Mar', desc: 'Saldo positivo por todo o mês', points: 100 },
  { id: 'team_member',       emoji: '🐡', title: 'Cardume', desc: 'Adicionou um colaborador', points: 75 },
  { id: 'ai_chat',           emoji: '🦐', title: 'Consultor', desc: 'Conversou com a IA financeira', points: 50 },
]

// ── Notification helpers ──────────────────────────────────────────────────────
export const getUpcomingDebts = (debts, daysAhead = 7) => {
  const cutoff = addDays(new Date(), daysAhead)
  return debts.filter(d => {
    if (d.status === 'PAID') return false
    if (!d.dueDate) return false
    const due = parseISO(d.dueDate)
    return isAfter(cutoff, due) || isAfter(new Date(), due)
  })
}

export const isOverdue = (dueDate) => {
  if (!dueDate) return false
  return isAfter(new Date(), parseISO(dueDate))
}

export const daysUntil = (dueDate) => {
  if (!dueDate) return null
  const diff = parseISO(dueDate) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ── CSV Export ────────────────────────────────────────────────────────────────
export const exportToCSV = (transactions, filename = 'financas.csv') => {
  const header = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor']
  const rows = transactions.map(t => [
    formatDate(t.date),
    `"${t.description}"`,
    t.type === 'INCOME' ? 'Receita' : 'Gasto',
    CATEGORIES[t.category]?.label || t.category,
    formatCurrency(t.amount).replace('R$\u00a0', '').replace('.', '').replace(',', '.')
  ])
  const csv = [header, ...rows].map(r => r.join(';')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Points calculation ────────────────────────────────────────────────────────
export const calcPoints = (achievements) =>
  ACHIEVEMENTS.filter(a => achievements.includes(a.id)).reduce((s, a) => s + a.points, 0)

export const calcLevel = (points) => {
  if (points >= 2000) return { level: 5, title: 'Lenda do Mar 🐋', next: null }
  if (points >= 1000) return { level: 4, title: 'Capitão 🦈', next: 2000 }
  if (points >= 500)  return { level: 3, title: 'Mergulhador 🤿', next: 1000 }
  if (points >= 150)  return { level: 2, title: 'Marinheiro 🐬', next: 500 }
  return { level: 1, title: 'Explorador 🐠', next: 150 }
}

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)