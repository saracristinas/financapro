import React, { useEffect, useState } from 'react'
import { UserPlus, Trash2, Crown, Edit2, Eye, X } from 'lucide-react'
import { teamApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import { clsx } from 'clsx'

const ROLE_MAP = {
  ADMIN:  { label: 'Admin',        icon: Crown, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  EDITOR: { label: 'Editor',       icon: Edit2, color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
  VIEWER: { label: 'Visualizador', icon: Eye,   color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
}

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'EDITOR' })
  const [inviting, setInviting] = useState(false)
  const { addNotification, unlockAchievement } = useAppStore()

  const load = () => {
    setLoading(true)
    teamApi.list().then(r => setMembers(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const invite = async (e) => {
    e.preventDefault()
    setInviting(true)
    try {
      const response = await teamApi.invite(form)
      const { emailStatus } = response.data

      setForm({ email: '', role: 'EDITOR' })
      setShowForm(false)
      unlockAchievement('team_member')

      // Mostrar notificação com status real do email
      if (emailStatus.enviado) {
        addNotification({
          emoji: '✉️',
          title: 'Email enviado com sucesso!',
          message: emailStatus.mensagem
        })
      } else {
        addNotification({
          emoji: '⚠️',
          title: 'Convite criado, mas email não foi enviado',
          message: emailStatus.mensagem
        })
      }

      load()
    } catch (error) {
      addNotification({
        emoji: '❌',
        title: 'Erro ao convidar',
        message: error.response?.data?.message || 'Erro desconhecido'
      })
    } finally { setInviting(false) }
  }

  const remove = async (id) => { await teamApi.remove(id); load() }
  const initials = (name) => name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'

  return (
    <div className="space-y-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{members.length} membro{members.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowForm(s => !s)} className="btn-accent">
          <UserPlus className="w-4 h-4" /> Convidar
        </button>
      </div>

      {showForm && (
        <form onSubmit={invite} className="card card-glow p-4 sm:p-5 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold">Convidar Colaborador</p>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">E-mail</label>
              <input type="email" required className="input"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="colaborador@email.com" />
            </div>
            <div>
              <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Permissão</label>
              <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="ADMIN">Admin — acesso total</option>
                <option value="EDITOR">Editor — pode editar</option>
                <option value="VIEWER">Visualizador — só leitura</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={inviting} className="btn-accent flex-1 justify-center">
              {inviting ? 'Enviando...' : '🐬 Enviar Convite'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
          </div>
        </form>
      )}

      {/* Role info */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(ROLE_MAP).map(([key, r]) => {
          const Icon = r.icon
          return (
            <div key={key} className="card p-3">
              <div className="flex items-center gap-1.5 mb-1.5 text-xs font-medium"
                style={{ color: r.color }}>
                <Icon className="w-3 h-3" /> {r.label}
              </div>
              <p className="text-[10px] text-muted leading-relaxed">
                {key === 'ADMIN' && 'Acesso total ao sistema.'}
                {key === 'EDITOR' && 'Edita transações e metas.'}
                {key === 'VIEWER' && 'Somente visualização.'}
              </p>
            </div>
          )
        })}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="card p-12 text-center text-muted animate-fade-in">
          <div className="text-5xl mb-4 animate-float">🐬</div>
          <p className="font-semibold mb-1">Nenhum colaborador</p>
          <p className="text-sm">Convide alguém para nadar junto!</p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-slide-up">
          {members.map((m, idx) => {
            const role = ROLE_MAP[m.role] || ROLE_MAP.VIEWER
            const RIcon = role.icon
            return (
              <div key={m.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: m.avatarColor || 'var(--gradient-accent)' }}>
                  {initials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-[10px] text-muted truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="badge" style={{ background: role.bg, color: role.color }}>
                    <RIcon className="w-3 h-3" /> {role.label}
                  </span>
                  <span className="badge" style={{
                    background: m.status === 'ACTIVE' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                    color: m.status === 'ACTIVE' ? '#34d399' : '#fbbf24'
                  }}>
                    {m.status === 'ACTIVE' ? 'Ativo' : 'Pendente'}
                  </span>
                  <button onClick={() => remove(m.id)}
                    className="text-muted hover:text-rose-400 transition-colors p-1 ml-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}