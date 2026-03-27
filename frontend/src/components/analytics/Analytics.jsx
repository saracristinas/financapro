import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts'
import { useAppStore } from '../../store/useAppStore'
import { analyticsApi } from '../../services/api'
import { formatCurrency } from '../../utils'
import { clsx } from 'clsx'

const CHART_TYPES = [
  { id: 'bar',  label: '📊 Barras' },
  { id: 'area', label: '〜 Área' },
  { id: 'line', label: '↗ Linha' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2.5 text-xs shadow-2xl border border-white/10">
      <p className="font-semibold mb-2 text-slate-300">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="mb-0.5" style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-bold">{formatCurrency(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { selectedYear } = useAppStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState('bar')

  useEffect(() => {
    setLoading(true)
    analyticsApi.monthly(selectedYear)
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [selectedYear])

  const annualIncome   = data.reduce((s, d) => s + Number(d.income), 0)
  const annualExpenses = data.reduce((s, d) => s + Number(d.expenses), 0)
  const annualSavings  = data.reduce((s, d) => s + Number(d.savings), 0)
  const bestMonth      = [...data].sort((a, b) => Number(b.savings) - Number(a.savings))[0]
  const savingsRate    = annualIncome > 0 ? ((annualSavings / annualIncome) * 100).toFixed(0) : 0

  const chartData = data.map(d => ({
    name: d.month,
    Receitas: Number(d.income),
    Gastos: Number(d.expenses),
    Economias: Number(d.savings),
  }))

  const COLORS = { Receitas: '#10b981', Gastos: '#f43f5e', Economias: '#0ea5e9' }

  const axisStyle = { fontSize: 10, fill: 'rgba(148,163,184,0.7)' }

  return (
    <div className="space-y-4 pb-24 md:pb-6">
      {/* Annual KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Receita Anual', value: annualIncome,   color: 'text-emerald-400', emoji: '💰' },
          { label: 'Gastos Anuais', value: annualExpenses, color: 'text-rose-400',    emoji: '💸' },
          { label: 'Economizado',   value: annualSavings,  color: 'text-accent',      emoji: '🌊' },
          { label: 'Taxa Poupança', value: null, text: `${savingsRate}%`, color: 'text-violet-400', emoji: '📊' },
        ].map((c, i) => (
          <div key={c.label} className="card p-3 sm:p-4 animate-slide-up"
            style={{ animationDelay: `${i * 75}ms` }}>
            <div className="flex items-center gap-2 mb-1">
              <span>{c.emoji}</span>
              <p className="text-[10px] text-muted uppercase tracking-wider">{c.label}</p>
            </div>
            <p className={clsx('font-mono font-bold text-base sm:text-lg', c.color)}>
              {c.text || formatCurrency(c.value)}
            </p>
            {c.label === 'Taxa Poupança' && (
              <p className="text-[10px] text-muted mt-0.5">do total recebido</p>
            )}
            {c.label === 'Economizado' && bestMonth && (
              <p className="text-[10px] text-muted mt-0.5">Melhor mês: {bestMonth.month}</p>
            )}
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="card p-4 sm:p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <p className="font-display font-semibold">Evolução {selectedYear}</p>
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {CHART_TYPES.map(t => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={clsx('px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-all whitespace-nowrap',
                  chartType === t.id ? 'text-white' : 'text-muted'
                )}
                style={chartType === t.id ? { background: 'var(--gradient-accent)' } : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-64 skeleton rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            {chartType === 'bar' ? (
              <BarChart data={chartData} barCategoryGap="35%" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.8)' }}>{v}</span>} />
                {Object.entries(COLORS).map(([k, c]) => (
                  <Bar key={k} dataKey={k} fill={c} radius={[4,4,0,0]}
                    style={{ filter: `drop-shadow(0 0 6px ${c}60)` }} />
                ))}
              </BarChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  {Object.entries(COLORS).map(([k, c]) => (
                    <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.8)' }}>{v}</span>} />
                {Object.entries(COLORS).map(([k, c]) => (
                  <Area key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={2}
                    fill={`url(#g-${k})`} dot={false} />
                ))}
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.8)' }}>{v}</span>} />
                {Object.entries(COLORS).map(([k, c]) => (
                  <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={2.5}
                    dot={{ r: 3, fill: c, strokeWidth: 0 }}
                    activeDot={{ r: 5, style: { filter: `drop-shadow(0 0 6px ${c})` } }} />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly breakdown — responsive table */}
      <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '375ms' }}>
        <div className="px-4 sm:px-5 py-3 border-b border-white/5">
          <p className="font-semibold text-sm">Resumo por Mês</p>
        </div>

        {/* Mobile: card list */}
        <div className="sm:hidden divide-y divide-white/5">
          {data.map(d => {
            const balance = Number(d.income) - Number(d.expenses)
            return (
              <div key={d.month} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{d.month}</p>
                  <p className="text-[10px] text-muted">
                    ↑ {formatCurrency(d.income)} · ↓ {formatCurrency(d.expenses)}
                  </p>
                </div>
                <span className={clsx('font-mono font-bold text-sm',
                  balance >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
              <tr>
                {['Mês','Receitas','Gastos','Economias','Saldo'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-muted uppercase tracking-widest px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(d => {
                const balance = Number(d.income) - Number(d.expenses)
                return (
                  <tr key={d.month} className="border-t border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-medium">{d.month}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">{formatCurrency(d.income)}</td>
                    <td className="px-4 py-3 font-mono text-rose-400">{formatCurrency(d.expenses)}</td>
                    <td className="px-4 py-3 font-mono text-accent">{formatCurrency(d.savings)}</td>
                    <td className={clsx('px-4 py-3 font-mono font-bold',
                      balance >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                      {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}