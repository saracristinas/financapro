import React, { useEffect, useState } from 'react'
import { Plus, Trash2, Download, Tag, TrendingUp, TrendingDown, X, Search } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { transactionsApi } from '../../services/api'
import { formatCurrency, formatDate, CATEGORIES, exportToCSV } from '../../utils'
import { clsx } from 'clsx'

const CATEGORY_OPTS = Object.entries(CATEGORIES)

function TransactionForm({ onSave, onClose }) {
  const { selectedMonth, selectedYear, customTags, addNotification } = useAppStore()
  const today = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
  const [form, setForm] = useState({
    description: '', amount: '', type: 'EXPENSE',
    category: 'OTHERS', date: today, tags: []
  })
  const [saving, setSaving] = useState(false)
  const { customTags: tags } = useAppStore()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleTag = (tag) => set('tags',
    form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]
  )

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await transactionsApi.create({
        ...form, amount: parseFloat(form.amount),
        notes: form.tags.length ? form.tags.join(',') : undefined
      })
      addNotification({
        emoji: form.type === 'INCOME' ? '💚' : '🔴',
        title: form.type === 'INCOME' ? 'Receita registrada!' : 'Gasto registrado!',
        message: `${form.description} — ${formatCurrency(parseFloat(form.amount))}`
      })
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={submit} className="card card-glow p-4 sm:p-5 space-y-4 mb-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold">Nova Transação</p>
        <button type="button" onClick={onClose} className="text-muted hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {[['EXPENSE','💸 Gasto'],['INCOME','💰 Receita']].map(([v, l]) => (
          <button key={v} type="button" onClick={() => set('type', v)}
            className={clsx('py-2 text-sm font-medium rounded-xl transition-all',
              form.type === v ? 'text-white' : 'text-muted'
            )}
            style={form.type === v ? { background: 'var(--gradient-accent)', boxShadow: 'var(--glow-sm)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[11px] text-muted mb-1.5 block font-medium uppercase tracking-wider">Descrição</label>
          <input className="input" value={form.description}
            onChange={e => set('description', e.target.value)} required
            placeholder="Ex: Mercado, Salário..." />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block font-medium uppercase tracking-wider">Valor (R$)</label>
          <input type="number" step="0.01" min="0.01" className="input font-mono"
            value={form.amount} onChange={e => set('amount', e.target.value)} required
            placeholder="0,00" />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block font-medium uppercase tracking-wider">Data</label>
          <input type="date" className="input" value={form.date}
            onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="col-span-2">
          <label className="text-[11px] text-muted mb-1.5 block font-medium uppercase tracking-wider">Categoria</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {CATEGORY_OPTS.map(([k, v]) => (
              <button key={k} type="button" onClick={() => set('category', k)}
                className={clsx('flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-medium transition-all',
                  form.category === k ? 'text-white' : 'text-muted hover:bg-white/5'
                )}
                style={form.category === k
                  ? { background: v.color + '30', border: `1px solid ${v.color}60`, color: v.color }
                  : { border: '1px solid rgba(255,255,255,0.05)' }}>
                <span>{v.emoji}</span>
                <span className="truncate hidden sm:block">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="col-span-2">
          <label className="text-[11px] text-muted mb-1.5 block font-medium uppercase tracking-wider">
            <Tag className="w-3 h-3 inline mr-1" />Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={clsx('tag-chip', form.tags.includes(tag) && 'active')}>
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="btn-accent flex-1 justify-center">
          {saving ? 'Salvando...' : '✓ Salvar'}
        </button>
        <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  )
}

export default function Expenses() {
  const { selectedMonth, selectedYear } = useAppStore()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState('ALL')
  const [filterCat, setFilterCat] = useState('ALL')
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const { customTags } = useAppStore()

  const load = () => {
    setLoading(true)
    transactionsApi.list(selectedMonth, selectedYear)
      .then(r => setTransactions(r.data))
      .finally(() => setLoading(false))
  }
  useEffect(load, [selectedMonth, selectedYear])

  const remove = async (id) => { await transactionsApi.delete(id); load() }

  const filtered = transactions.filter(t => {
    if (filterType !== 'ALL' && t.type !== filterType) return false
    if (filterCat !== 'ALL' && t.category !== filterCat) return false
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'INCOME') acc.income += Number(t.amount)
    else acc.expense += Number(t.amount)
    return acc
  }, { income: 0, expense: 0 })

  const byCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const key = t.category || 'OTHERS'
      acc[key] = (acc[key] || 0) + Number(t.amount)
      return acc
    }, {})

  return (
    <div className="space-y-4 pb-24 md:pb-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3 sm:p-4 flex items-center gap-3 animate-slide-up">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Receitas</p>
            <p className="font-mono font-bold text-emerald-400 text-sm sm:text-base">{formatCurrency(totals.income)}</p>
          </div>
        </div>
        <div className="card p-3 sm:p-4 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '75ms' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#f43f5e,#e11d48)' }}>
            <TrendingDown className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Gastos</p>
            <p className="font-mono font-bold text-rose-400 text-sm sm:text-base">{formatCurrency(totals.expense)}</p>
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[140px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input !pl-8 !py-2 text-sm" placeholder="Buscar..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {['ALL','INCOME','EXPENSE'].map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              className={clsx('px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap',
                filterType === type ? 'text-white' : 'text-muted'
              )}
              style={filterType === type ? { background: 'var(--gradient-accent)' } : {}}>
              {{ ALL: 'Todos', INCOME: '↑ Receitas', EXPENSE: '↓ Gastos' }[type]}
            </button>
          ))}
        </div>
        <button onClick={() => exportToCSV(transactions, `financas-${selectedMonth}-${selectedYear}.csv`)}
          className="btn-ghost !py-1.5 !px-3 text-xs">
          <Download className="w-3.5 h-3.5" /> CSV
        </button>
        <button onClick={() => setShowForm(s => !s)} className="btn-accent !py-1.5 !px-3 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      {showForm && (
        <TransactionForm onSave={() => { load(); setShowForm(false) }} onClose={() => setShowForm(false)} />
      )}

      {/* Category chips */}
      {Object.keys(byCategory).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilterCat('ALL')}
            className={clsx('tag-chip', filterCat === 'ALL' && 'active')}>
            Todos
          </button>
          {Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).map(([cat, val]) => (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? 'ALL' : cat)}
              className={clsx('tag-chip', filterCat === cat && 'active')}>
              {CATEGORIES[cat]?.emoji} {CATEGORIES[cat]?.label} · {formatCurrency(val)}
            </button>
          ))}
        </div>
      )}

      {/* Transactions list — card per item on mobile */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-muted">
          <p className="text-4xl mb-3">🐠</p>
          <p className="text-sm">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="space-y-2 sm:hidden">
            {filtered.map((t, idx) => (
              <div key={t.id} className="card p-3 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: (CATEGORIES[t.category]?.color || '#64748b') + '25' }}>
                  {CATEGORIES[t.category]?.emoji || '💳'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description}</p>
                  <p className="text-[10px] text-muted">{CATEGORIES[t.category]?.label} · {formatDate(t.date)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={clsx('text-sm font-mono font-semibold',
                    t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400')}>
                    {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <button onClick={() => remove(t.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="card overflow-hidden hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {['Descrição','Categoria','Data','Tipo','Valor',''].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-muted uppercase tracking-widest px-4 py-3 first:pl-5 last:pr-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, idx) => (
                    <tr key={t.id}
                      className="border-t border-white/5 hover:bg-white/3 transition-colors animate-slide-up"
                      style={{ animationDelay: `${idx * 30}ms` }}>
                      <td className="px-5 py-3 font-medium">{t.description}</td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {CATEGORIES[t.category]?.emoji} {CATEGORIES[t.category]?.label}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">{formatDate(t.date)}</td>
                      <td className="px-4 py-3">
                        <span className="badge" style={{
                          background: t.type === 'INCOME' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                          color: t.type === 'INCOME' ? '#34d399' : '#fb7185'
                        }}>
                          {t.type === 'INCOME' ? '↑ Receita' : '↓ Gasto'}
                        </span>
                      </td>
                      <td className={clsx('px-4 py-3 font-mono font-semibold',
                        t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400')}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => remove(t.id)}
                          className="text-slate-600 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}