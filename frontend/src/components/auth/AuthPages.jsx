import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { authApi } from '../../services/api'

function OceanBg() {
  return (
    <>
      <div className="ocean-bg" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {['🌊','🐋','🐬','🦈','🐠','🐙'].map((e, i) => (
          <div key={i} className="absolute text-5xl sm:text-7xl opacity-[0.04] animate-float select-none"
            style={{
              left: `${10 + i * 16}%`,
              top: `${10 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + i * 1.5}s`
            }}>
            {e}
          </div>
        ))}
      </div>
    </>
  )
}

function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 relative">
      <OceanBg />
      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl animate-pulse-glow"
            style={{ background: 'var(--gradient-accent)', boxShadow: 'var(--glow-md)' }}>
            🌊
          </div>
          <h1 className="font-display font-black text-3xl mb-1">
            Finança<span className="gradient-text">Pro</span>
          </h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>

        <div className="card card-glow p-6 shadow-2xl">
          <h2 className="font-display font-bold text-xl mb-5">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}

export function LoginPage({ onSwitch, onForgot }) {
  const { setAuth } = useAppStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await authApi.login(form)
      setAuth(res.data.token, res.data)
    } catch (err) {
      if (!err.response) {
        setError('O servidor está desligado. Ligue o backend Java na porta 8080.')
      } else {
        const msg = err.response.data?.message || 'E-mail ou senha incorretos'
        const fields = err.response.data?.fields
          ? Object.entries(err.response.data.fields).map(([f, m]) => `${f}: ${m}`).join(', ')
          : ''
        setError(fields ? `${msg} (${fields})` : msg)
      }
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Entrar" subtitle="Seu controle financeiro pessoal 🌊">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">E-mail</label>
          <input type="email" required className="input" value={form.email}
            onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />
        </div>
        <div>
          <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Senha</label>
          <input type="password" required className="input" value={form.password}
            onChange={e => set('password', e.target.value)} placeholder="••••••••" />
        </div>
        {error && (
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(244,63,94,0.1)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.25)' }}>
            ⚠ {error}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-accent w-full justify-center !py-3 text-base">
          {loading ? 'Entrando...' : '🌊 Entrar'}
        </button>
        <div className="text-right">
          <button type="button" onClick={onForgot} className="text-[10px] text-muted hover:text-accent transition-colors uppercase tracking-widest font-bold">
            Esqueceu a senha?
          </button>
        </div>
      </form>
      <div className="divider" />
      <p className="text-center text-xs text-muted">
        Não tem conta?{' '}
        <button onClick={onSwitch} className="text-accent hover:underline font-semibold">Criar conta</button>
      </p>
    </AuthCard>
  )
}

export function RegisterPage({ onSwitch }) {
  const { setAuth } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', securityQuestion: '', securityAnswer: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e) {
    e.preventDefault(); setError('')
    if (form.password !== form.confirm) { setError('Senhas não coincidem'); return }
    if (form.password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); return }
    setLoading(true)
    try {
      const res = await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer
      })
      setAuth(res.data.token, res.data)
    } catch (err) {
      if (!err.response) {
        setError('O servidor está desligado. Ligue o backend Java na porta 8080.')
      } else {
        const msg = err.response.data?.message || 'Erro ao criar conta'
        const fields = err.response.data?.fields
          ? Object.entries(err.response.data.fields).map(([f, m]) => `${m}`).join(' | ')
          : ''
        setError(fields || msg)
      }
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Criar Conta" subtitle="Comece a navegar suas finanças 🐬">
      <form onSubmit={submit} className="space-y-3">
        {[
          { k: 'name',     label: 'Nome',           type: 'text',     ph: 'Seu nome completo' },
          { k: 'email',    label: 'E-mail',          type: 'email',    ph: 'seu@email.com' },
          { k: 'securityQuestion', label: 'Pergunta de Segurança (ex: Nome do seu pet)', type: 'text', ph: 'Sua pergunta' },
          { k: 'securityAnswer', label: 'Resposta de Segurança', type: 'text', ph: 'Sua resposta' },
          { k: 'password', label: 'Senha',           type: 'password', ph: 'Mín. 6 caracteres' },
          { k: 'confirm',  label: 'Confirmar Senha', type: 'password', ph: 'Repita a senha' },
        ].map(f => (
          <div key={f.k}>
            <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">{f.label}</label>
            <input type={f.type} required className="input" value={form[f.k]}
              onChange={e => set(f.k, e.target.value)} placeholder={f.ph} />
          </div>
        ))}
        {error && (
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(244,63,94,0.1)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.25)' }}>
            ⚠ {error}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-accent w-full justify-center !py-3 text-base mt-2">
          {loading ? 'Criando...' : '🌊 Criar Conta'}
        </button>
      </form>
      <div className="divider" />
      <p className="text-center text-xs text-muted">
        Já tem conta?{' '}
        <button onClick={onSwitch} className="text-accent hover:underline font-semibold">Entrar</button>
      </p>
    </AuthCard>
  )
}

export function ForgotPasswordPage({ onSwitch }) {
  const [step, setStep] = useState(1) // 1: Email, 2: Answer & New Password
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGetQuestion(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await authApi.getForgotPasswordQuestion(email)
      setQuestion(res.data.securityQuestion)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'E-mail não encontrado')
    } finally { setLoading(false) }
  }

  async function handleReset(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await authApi.resetPassword({ email, securityAnswer: answer, newPassword })
      setMessage('Senha alterada com sucesso! Redirecionando...')
      setTimeout(() => onSwitch(), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Resposta incorreta ou erro ao alterar')
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Recuperar Senha" subtitle="Uma boia de segurança para sua conta 🛟">
      {step === 1 ? (
        <form onSubmit={handleGetQuestion} className="space-y-4">
          <div>
            <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Digite seu E-mail</label>
            <input type="email" required className="input" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
          </div>
          {error && <div className="text-xs text-rose-400 font-medium">⚠ {error}</div>}
          <button type="submit" disabled={loading} className="btn-accent w-full justify-center !py-3">
            {loading ? 'Buscando...' : 'Continuar'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Sua Pergunta:</span>
            <p className="text-sm font-medium">{question}</p>
          </div>
          <div>
            <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Sua Resposta</label>
            <input type="text" required className="input" value={answer}
              onChange={e => setAnswer(e.target.value)} placeholder="Resposta de segurança" />
          </div>
          <div>
            <label className="text-[11px] text-muted mb-1.5 block uppercase tracking-wider font-medium">Nova Senha</label>
            <input type="password" required className="input" value={newPassword}
              onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div className="text-xs text-rose-400 font-medium">⚠ {error}</div>}
          {message && <div className="text-xs text-emerald-400 font-medium">✓ {message}</div>}
          <button type="submit" disabled={loading} className="btn-accent w-full justify-center !py-3">
            {loading ? 'Alterando...' : 'Redefinir Senha'}
          </button>
        </form>
      )}
      <div className="divider" />
      <p className="text-center text-xs text-muted">
        Lembrou a senha?{' '}
        <button onClick={onSwitch} className="text-accent hover:underline font-semibold">Voltar ao login</button>
      </p>
    </AuthCard>
  )
}
