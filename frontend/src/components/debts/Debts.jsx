import React, { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react'
import { debtsApi } from '../../services/api'
import { formatCurrency, formatDate, daysUntil, isOverdue, getUpcomingDebts } from '../../utils'
import { useAppStore } from '../../store/useAppStore'
import { clsx } from 'clsx'

const STATUS_MAP = {
  PENDING: { label: 'Pendente', icon: Clock,         color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  PARTIAL: { label: 'Parcial',  icon: AlertTriangle, color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
  PAID:    { label: 'Pago',     icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
}

function DebtForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    creditor: initial?.creditor || '',
    description: initial?.description || '',
    amount: initial?.amount || '',
    paidAmount: initial?.paidAmount || '0',
    dueDate: initial?.dueDate || '',
    status: initial?.status || 'PENDING',
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...form, amount: parseFloat(form.amount), paidAmount: parseFloat(form.paidAmount || 0) }
      if (initial) await debtsApi.update(initial.id, data)
      else await debtsApi.create(data)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={submit} className="card card-glow p-4 sm:p-5 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold">{initial ? 'Editar Dívida' : 'Nova Dívida'}</p>
        <button type="button" onClick={onClose} className="text-muted hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Credor</label>
          <input className="input" value={form.creditor} onChange={e => set('creditor', e.target.value)} required
            placeholder="Ex: Banco, Loja..." />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Descrição</label>
          <input className="input" value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Detalhes..." />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Valor Total</label>
          <input type="number" step="0.01" min="0.01" className="input font-mono"
            value={form.amount} onChange={e => set('amount', e.target.value)} required placeholder="0,00" />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Valor Pago</label>
          <input type="number" step="0.01" min="0" className="input font-mono"
            value={form.paidAmount} onChange={e => set('paidAmount', e.target.value)} placeholder="0,00" />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Vencimento</label>
          <input type="date" className="input" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Status</label>
          <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="PENDING">Pendente</option>
            <option value="PARTIAL">Parcial</option>
            <option value="PAID">Pago</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-accent flex-1 justify-center">
          {saving ? 'Salvando...' : '✓ Salvar'}
        </button>
        <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  )
}

export default function Debts() {
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const { addNotification } = useAppStore()

  const load = () => {
    setLoading(true)
    debtsApi.list().then(r => {
      setDebts(r.data)
      // Check for upcoming/overdue debts
      const upcoming = getUpcomingDebts(r.data, 7)
      upcoming.forEach(d => {
        const days = daysUntil(d.dueDate)
        if (days !== null && days <= 0) {
          addNotification({ emoji: '⚓', title: 'Dívida vencida!', message: `${d.creditor} — ${formatCurrency(d.amount)}` })
        } else if (days !== null && days <= 7) {
          addNotification({ emoji: '⚠️', title: 'Vencimento próximo', message: `${d.creditor} vence em ${days} dia${days !== 1 ? 's' : ''}` })
        }
      })
    }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const remove = async (id) => { await debtsApi.delete(id); load() }

  const totalOwed = debts.reduce((s, d) => s + Math.max(0, Number(d.amount) - Number(d.paidAmount || 0)), 0)
  const totalPaid = debts.reduce((s, d) => s + Number(d.paidAmount || 0), 0)
  const overdueCount = debts.filter(d => d.status !== 'PAID' && d.dueDate && isOverdue(d.dueDate)).length

  return (
    <div className="space-y-4 pb-24 md:pb-6">
      {/* Overdue warning */}
      {overdueCount > 0 && (
        <div className="card p-4 flex items-center gap-3 animate-slide-up"
          style={{ borderColor: 'rgba(244,63,94,0.4)', background: 'rgba(244,63,94,0.08)' }}>
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-wave" />
          <p className="text-sm text-rose-300 font-medium">
            {overdueCount} dívida{overdueCount > 1 ? 's' : ''} vencida{overdueCount > 1 ? 's' : ''}! Atenção ⚓
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Em Aberto', value: totalOwed, color: 'text-rose-400' },
          { label: 'Total Pago', value: totalPaid, color: 'text-emerald-400' },
          { label: 'Pendentes', value: `${debts.filter(d => d.status !== 'PAID').length}`, color: 'text-amber-400', isMoney: false },
        ].map((s, i) => (
          <div key={s.label} className="card p-3 sm:p-4 animate-slide-up" style={{ animationDelay: `${i * 75}ms` }}>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">{s.label}</p>
            <p className={clsx('font-mono font-bold text-sm sm:text-base', s.color)}>
              {s.isMoney === false ? s.value : formatCurrency(s.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setShowForm(s => !s) }} className="btn-accent">
          <Plus className="w-4 h-4" /> Nova Dívida
        </button>
      </div>

      {showForm && !editing && (
        <DebtForm onSave={() => { load(); setShowForm(false) }} onClose={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : debts.length === 0 ? (
        <div className="card p-12 text-center text-muted animate-fade-in">
          <div className="text-5xl mb-4 animate-float">🐳</div>
          <p className="font-semibold mb-1">Nenhuma dívida! Incrível 🎉</p>
          <p className="text-sm">Continue assim, navegando livre pelos mares!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {debts.map((d, idx) => {
            const remaining = Math.max(0, Number(d.amount) - Number(d.paidAmount || 0))
            const pct = d.amount > 0 ? (Number(d.paidAmount || 0) / Number(d.amount)) * 100 : 0
            const s = STATUS_MAP[d.status] || STATUS_MAP.PENDING
            const SIcon = s.icon
            const overdue = d.status !== 'PAID' && d.dueDate && isOverdue(d.dueDate)
            const days = daysUntil(d.dueDate)

            return editing?.id === d.id ? (
              <DebtForm key={d.id} initial={d}
                onSave={() => { load(); setEditing(null) }}
                onClose={() => setEditing(null)} />
            ) : (
              <div key={d.id} className="card p-4 animate-slide-up group transition-all"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  borderColor: overdue ? 'rgba(244,63,94,0.35)' : undefined
                }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <p className="font-semibold text-sm truncate">{d.creditor}</p>
                      <span className="badge flex-shrink-0"
                        style={{ background: s.bg, color: s.color }}>
                        <SIcon className="w-3 h-3" /> {s.label}
                      </span>
                      {overdue && (
                        <span className="badge flex-shrink-0"
                          style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185' }}>
                          ⚠ Vencida
                        </span>
                      )}
                      {!overdue && days !== null && days <= 7 && d.status !== 'PAID' && (
                        <span className="badge flex-shrink-0"
                          style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                          ⏰ {days}d
                        </span>
                      )}
                    </div>

                    {d.description && (
                      <p className="text-xs text-muted mb-2">{d.description}</p>
                    )}

                    {/* Progress */}
                    <div className="progress-track mb-2">
                      <div style={{
                        height: '100%', borderRadius: '99px',
                        width: `${Math.min(pct, 100)}%`,
                        background: d.status === 'PAID'
                          ? 'linear-gradient(90deg,#10b981,#34d399)'
                          : 'linear-gradient(90deg,#0ea5e9,#06b6d4)',
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: 'var(--glow-sm)'
                      }} />
                    </div>

                    <div className="flex justify-between text-[11px] text-muted">
                      <span>Pago: <span className="font-mono text-emerald-400">{formatCurrency(d.paidAmount)}</span></span>
                      <span>Restante: <span className="font-mono text-rose-400">{formatCurrency(remaining)}</span></span>
                      <span>Total: <span className="font-mono">{formatCurrency(d.amount)}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {d.dueDate && (
                      <p className="text-[10px] text-muted">{formatDate(d.dueDate)}</p>
                    )}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditing(d)}
                        className="text-muted hover:text-accent transition-colors p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(d.id)}
                        className="text-muted hover:text-rose-400 transition-colors p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}