import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, PiggyBank, X } from 'lucide-react'
import { savingsApi } from '../../services/api'
import { formatCurrency, formatDate } from '../../utils'
import { useAppStore } from '../../store/useAppStore'
import { clsx } from 'clsx'

const EMOJIS = ['🏠','🚗','✈️','📱','💍','🎓','🏖️','🐾','🎸','⛵','🏋️','💰','🌊','🐋','🦈','🐬']
const COLORS = ['#0ea5e9','#06b6d4','#10b981','#8b5cf6','#f43f5e','#f59e0b','#ec4899','#22c55e']

function SavingForm({ initial, onSave, onClose }) {
  const { addNotification, unlockAchievement } = useAppStore()
  const [form, setForm] = useState({
    name: initial?.name || '',
    goal: initial?.goal || '',
    current: initial?.current || '',
    emoji: initial?.emoji || '🌊',
    color: initial?.color || '#0ea5e9',
    deadline: initial?.deadline || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...form, goal: parseFloat(form.goal), current: parseFloat(form.current || 0) }
      if (initial) await savingsApi.update(initial.id, data)
      else {
        await savingsApi.create(data)
        unlockAchievement('first_saving')
        addNotification({ emoji: '🐠', title: 'Meta criada!', message: `"${form.name}" — alvo: ${formatCurrency(parseFloat(form.goal))}` })
      }
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={submit} className="card card-glow p-4 sm:p-5 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold">{initial ? 'Editar Meta' : 'Nova Meta'}</p>
        <button type="button" onClick={onClose} className="text-muted hover:text-white"><X className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Nome da meta</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required
            placeholder="Ex: Viagem para o Caribe 🌴" />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Valor Alvo</label>
          <input type="number" step="0.01" min="1" className="input font-mono"
            value={form.goal} onChange={e => set('goal', e.target.value)} required placeholder="0,00" />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Já Economizei</label>
          <input type="number" step="0.01" min="0" className="input font-mono"
            value={form.current} onChange={e => set('current', e.target.value)} placeholder="0,00" />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Prazo</label>
          <input type="date" className="input" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Emoji</label>
          <div className="flex flex-wrap gap-1">
            {EMOJIS.map(e => (
              <button key={e} type="button" onClick={() => set('emoji', e)}
                className={clsx('text-xl p-1 rounded-lg transition-all',
                  form.emoji === e ? 'scale-125' : 'opacity-60 hover:opacity-100'
                )}
                style={form.emoji === e ? { background: 'var(--gradient-accent)', filter: 'drop-shadow(0 0 6px var(--accent))' } : {}}>
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Cor</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  background: c,
                  border: form.color === c ? '3px solid white' : '3px solid transparent',
                  boxShadow: form.color === c ? `0 0 10px ${c}80` : 'none',
                  transform: form.color === c ? 'scale(1.15)' : 'scale(1)'
                }} />
            ))}
          </div>
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

export default function Savings() {
  const [savings, setSavings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = () => {
    setLoading(true)
    savingsApi.list().then(r => setSavings(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const remove = async (id) => { await savingsApi.delete(id); load() }

  const totalGoal = savings.reduce((s, g) => s + Number(g.goal), 0)
  const totalSaved = savings.reduce((s, g) => s + Number(g.current), 0)
  const overallPct = totalGoal > 0 ? (totalSaved / totalGoal) * 100 : 0

  return (
    <div className="space-y-4 pb-24 md:pb-6">
      {/* Overview */}
      {savings.length > 0 && (
        <div className="card card-glow p-4 sm:p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Progresso Geral</p>
            <span className="font-mono text-sm font-bold text-accent">{overallPct.toFixed(0)}%</span>
          </div>
          <div className="progress-track mb-2">
            <div className="progress-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Economizado: <span className="font-mono text-emerald-400">{formatCurrency(totalSaved)}</span></span>
            <span>Meta total: <span className="font-mono">{formatCurrency(totalGoal)}</span></span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted">{savings.length} meta{savings.length !== 1 ? 's' : ''}</p>
        <button onClick={() => { setEditing(null); setShowForm(s => !s) }} className="btn-accent">
          <Plus className="w-4 h-4" /> Nova Meta
        </button>
      </div>

      {showForm && !editing && (
        <SavingForm onSave={() => { load(); setShowForm(false) }} onClose={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 skeleton rounded-2xl" />)}
        </div>
      ) : savings.length === 0 ? (
        <div className="card p-12 text-center text-muted animate-fade-in">
          <div className="text-5xl mb-4 animate-float">🐠</div>
          <p className="font-semibold mb-1">Nenhuma meta ainda</p>
          <p className="text-sm">Crie sua primeira meta de economia!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savings.map((s, idx) => (
            <div key={s.id} style={{ animationDelay: `${idx * 60}ms` }}>
              {editing?.id === s.id ? (
                <SavingForm initial={s}
                  onSave={() => { load(); setEditing(null) }}
                  onClose={() => setEditing(null)} />
              ) : (
                <div className="card p-4 sm:p-5 space-y-4 animate-slide-up hover:card-glow transition-all group">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: s.color + '25', boxShadow: s.percentage >= 100 ? `0 0 16px ${s.color}60` : 'none' }}>
                        {s.emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{s.name}</p>
                        {s.deadline && (
                          <p className="text-[10px] text-muted">📅 {formatDate(s.deadline)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditing(s)}
                        className="text-muted hover:text-accent transition-colors p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(s.id)}
                        className="text-muted hover:text-rose-400 transition-colors p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted">Progresso</span>
                      <span className="font-mono font-bold" style={{ color: s.color }}>
                        {s.percentage >= 100 ? '🎉 Concluída!' : `${s.percentage.toFixed(0)}%`}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{
                        width: `${Math.min(s.percentage, 100)}%`,
                        background: s.percentage >= 100
                          ? 'linear-gradient(90deg,#10b981,#34d399)'
                          : `linear-gradient(90deg, ${s.color}, ${s.color}bb)`
                      }} />
                    </div>
                  </div>

                  {/* Values */}
                  <div className="flex justify-between text-xs">
                    <div>
                      <p className="text-muted">Economizado</p>
                      <p className="font-mono font-bold text-emerald-400">{formatCurrency(s.current)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted">Meta</p>
                      <p className="font-mono font-bold">{formatCurrency(s.goal)}</p>
                    </div>
                  </div>

                  {/* Remaining */}
                  {s.percentage < 100 && (
                    <p className="text-[11px] text-muted text-center border-t border-white/5 pt-3">
                      Faltam <span className="font-mono font-bold text-accent">
                        {formatCurrency(Number(s.goal) - Number(s.current))}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}