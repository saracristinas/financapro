import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { ACHIEVEMENTS, calcPoints, calcLevel } from '../../utils'
import { clsx } from 'clsx'

export default function Achievements() {
  const { unlockedAchievements } = useAppStore()
  const points = calcPoints(unlockedAchievements)
  const { level, title, next } = calcLevel(points)
  const pct = next ? Math.min((points / next) * 100, 100) : 100

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      {/* Level card */}
      <div className="card card-glow p-5 sm:p-6 animate-slide-up relative overflow-hidden">
        {/* Background creature */}
        <div className="absolute right-4 top-4 text-6xl opacity-10 animate-float select-none pointer-events-none">
          🐋
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl animate-pulse-glow"
            style={{ background: 'var(--gradient-accent)' }}>
            {'🌊🐬🤿🦈🐋'[level - 1] || '🌊'}
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-0.5">Nível {level}</p>
            <p className="font-display font-bold text-xl">{title}</p>
            <p className="text-sm text-muted mt-0.5">
              <span className="font-mono font-bold text-accent">{points}</span>
              {next ? ` / ${next} pontos` : ' pontos — Máximo! 🎉'}
            </p>
          </div>
        </div>
        {next && (
          <>
            <div className="progress-track mb-1.5">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[11px] text-muted">
              {next - points} pontos até o próximo nível
            </p>
          </>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Conquistas', value: unlockedAchievements.length, total: ACHIEVEMENTS.length, emoji: '🏆' },
          { label: 'Pontos', value: points, total: null, emoji: '⭐' },
          { label: 'Nível', value: level, total: 5, emoji: '🎯' },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center animate-slide-up">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <p className="font-display font-bold text-lg">
              {s.value}{s.total ? <span className="text-sm text-muted">/{s.total}</span> : ''}
            </p>
            <p className="text-[10px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements grid */}
      <div>
        <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">
          Todas as conquistas
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a, idx) => {
            const unlocked = unlockedAchievements.includes(a.id)
            return (
              <div key={a.id}
                className={clsx(
                  'card p-4 flex items-center gap-4 transition-all duration-300 animate-slide-up',
                  unlocked ? 'card-glow' : 'opacity-50'
                )}
                style={{ animationDelay: `${idx * 60}ms` }}>
                <div className={clsx(
                  'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all',
                  unlocked ? 'animate-pulse-glow' : 'grayscale'
                )}
                  style={{ background: unlocked ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)' }}>
                  {a.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{a.title}</p>
                    {unlocked && (
                      <span className="badge flex-shrink-0"
                        style={{ background: 'rgba(14,165,233,0.15)', color: 'var(--accent)' }}>
                        ✓ Desbloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">{a.desc}</p>
                  <p className="text-[10px] mt-1.5">
                    <span className="font-mono font-bold text-accent">+{a.points}</span>
                    <span className="text-muted"> pontos</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="card p-4 text-center text-muted text-sm">
        🌊 Continue registrando suas finanças para desbloquear novas conquistas!
      </div>
    </div>
  )
}