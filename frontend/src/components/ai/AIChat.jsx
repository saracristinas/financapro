import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RefreshCw, X } from 'lucide-react'
import { aiApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import { clsx } from 'clsx'

const SUGGESTIONS = [
  { text: 'Como reduzir gastos mensais?',     emoji: '💡' },
  { text: 'Dicas para quitar dívidas rápido', emoji: '⚓' },
  { text: 'Como montar reserva de emergência?',emoji: '🌊' },
  { text: 'Melhor forma de investir?',         emoji: '📈' },
  { text: 'Analise meu perfil financeiro',     emoji: '🐋' },
  { text: 'Meta de economia para uma viagem',  emoji: '✈️' },
]

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={clsx('flex gap-2.5 animate-slide-up', isUser && 'flex-row-reverse')}>
      <div className={clsx(
        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
        isUser ? 'text-white' : 'bg-white/5 border border-white/10'
      )} style={isUser ? { background: 'var(--gradient-accent)' } : {}}>
        {isUser ? <User className="w-4 h-4" /> : <span className="text-base">🦑</span>}
      </div>

      <div className={clsx(
        'max-w-[78%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
        isUser
          ? 'text-white rounded-tr-sm'
          : 'card rounded-tl-sm whitespace-pre-wrap text-slate-200'
      )} style={isUser ? { background: 'var(--gradient-accent)' } : {}}>
        {msg.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <span className="animate-wave text-base">🦑</span>
      </div>
      <div className="card px-4 py-3 rounded-tl-sm flex items-center gap-1.5">
        {[0,1,2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: 'var(--accent)', animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

export default function AIChat() {
  const { addNotification, unlockAchievement } = useAppStore()
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '🌊 Olá! Sou a IA do FinançaPro, seu consultor financeiro pessoal dos mares!\n\nPosso te ajudar com análises, dicas de economia, planejamento e muito mais. Como posso te ajudar hoje?'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return

    setMessages(prev => [...prev, { role: 'user', content }])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await aiApi.chat({ message: content, history })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
      unlockAchievement('ai_chat')
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Erro ao conectar com a IA. Verifique se a chave da API está configurada corretamente no backend (application.yml).'
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const reset = () => {
    setMessages([{
      role: 'assistant',
      content: '🌊 Nova conversa! Como posso te ajudar hoje?'
    }])
  }

  return (
    <div className="flex flex-col pb-20 md:pb-0" style={{ height: 'calc(100dvh - 10rem)' }}>
      {/* Header */}
      <div className="card card-glow p-3 sm:p-4 mb-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl animate-pulse-glow"
            style={{ background: 'var(--gradient-accent)' }}>
            🦑
          </div>
          <div>
            <p className="font-display font-semibold text-sm">FinançaPro IA</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[10px] text-muted">Powered by Claude · Online</p>
            </div>
          </div>
        </div>
        <button onClick={reset} title="Nova conversa"
          className="text-muted hover:text-accent p-2 rounded-xl hover:bg-white/5 transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
        {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions — only when first message */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3 flex-shrink-0">
          {SUGGESTIONS.map(s => (
            <button key={s.text} onClick={() => send(s.text)}
              className="text-[11px] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
              style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', color: 'var(--accent-light)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--glow-sm)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <span>{s.emoji}</span> {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          className="input flex-1"
          placeholder="Pergunte sobre suas finanças..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
            input.trim() && !loading ? 'text-white' : 'text-muted cursor-not-allowed'
          )}
          style={input.trim() && !loading
            ? { background: 'var(--gradient-accent)', boxShadow: 'var(--glow-sm)' }
            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}