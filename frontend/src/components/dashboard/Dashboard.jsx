import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, PiggyBank, Wallet, ArrowRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAppStore } from '../../store/useAppStore'
import { dashboardApi } from '../../services/api'
import { formatCurrency, formatDate, CATEGORIES, OCEAN_COLORS, THEME_CREATURES } from '../../utils'
import { clsx } from 'clsx'

function StatCard({ label, value, icon: Icon, gradient, sub, delay = 0, trend }) {
  return (
    <div
      className="card card-glow p-4 flex flex-col gap-2 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted uppercase tracking-widest">{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: gradient }}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <p className="font-display font-bold text-xl sm:text-2xl">{formatCurrency(value)}</p>
      {sub && (
        <p className={clsx('text-[11px]', trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-muted')}>
          {sub}
        </p>
      )}
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={10} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-xs shadow-2xl">
      <p className="font-semibold mb-1">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.color }}>{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function Dashboard() {
  const { selectedMonth, selectedYear, themeKey, setActiveTab } = useAppStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const creatures = THEME_CREATURES[themeKey] || THEME_CREATURES.ocean

  useEffect(() => {
    setLoading(true)
    dashboardApi.get(selectedMonth, selectedYear)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedMonth, selectedYear])

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
      </div>
      <div className="h-64 skeleton rounded-2xl" />
    </div>
  )

  const balance = Number(data?.balance ?? 0)
  const income = Number(data?.income ?? 0)
  const expenses = Number(data?.expenses ?? 0)
  const spendPct = income > 0 ? Math.min((expenses / income) * 100, 100) : 0

  const pieData = (data?.categorySummaries || []).map((c, i) => ({
    name: CATEGORIES[c.category]?.label || c.category,
    value: Number(c.total),
    color: CATEGORIES[c.category]?.color || OCEAN_COLORS[i % OCEAN_COLORS.length],
    emoji: CATEGORIES[c.category]?.emoji || '💳',
  }))

  return (
    <div className="space-y-4 pb-24 md:pb-6">

      {/* Floating ocean creature — decorative */}
      <div className="creature-float" style={{ right: '2%', top: '8%', animationDuration: '9s' }}>
        {creatures[0]}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Receita" value={income} icon={TrendingUp}
          gradient="linear-gradient(135deg,#10b981,#059669)"
          sub={income > 0 ? '✦ Este mês' : 'Nenhuma ainda'}
          trend="up" delay={0} />
        <StatCard label="Gastos" value={expenses} icon={TrendingDown}
          gradient="linear-gradient(135deg,#f43f5e,#e11d48)"
          sub={income > 0 ? `${spendPct.toFixed(0)}% da receita` : '—'}
          trend="down" delay={75} />
        <StatCard label="Saldo" value={balance} icon={Wallet}
          gradient={balance >= 0 ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "linear-gradient(135deg,#f97316,#ea580c)"}
          sub={balance >= 0 ? '🎉 Positivo!' : '⚠️ Negativo'}
          trend={balance >= 0 ? 'up' : 'down'} delay={150} />
        <StatCard label="Poupança" value={data?.savings} icon={PiggyBank}
          gradient="linear-gradient(135deg,#8b5cf6,#7c3aed)"
          sub="Saldo acumulado" delay={225} />
      </div>

      {/* Budget visual bar */}
      {income > 0 && (
        <div className="card p-4 sm:p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Orçamento do Mês</p>
            <span className="badge" style={{
              background: spendPct > 90 ? 'rgba(244,63,94,0.15)' : 'rgba(14,165,233,0.15)',
              color: spendPct > 90 ? '#f43f5e' : 'var(--accent)'
            }}>
              {spendPct.toFixed(0)}% usado
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{
              width: `${spendPct}%`,
              background: spendPct > 90
                ? 'linear-gradient(90deg,#f43f5e,#fb923c)'
                : spendPct > 70
                  ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                  : 'var(--gradient-accent)'
            }} />
          </div>
          <div className="flex justify-between text-[11px] text-muted mt-2">
            <span>Gastou {formatCurrency(expenses)}</span>
            <span>Sobra {formatCurrency(Math.max(0, income - expenses))}</span>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Pie chart */}
        <div className="lg:col-span-2 card p-4 sm:p-5 animate-slide-up" style={{ animationDelay: '375ms' }}>
          <p className="text-sm font-semibold mb-1">Por Categoria</p>
          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-44 text-muted gap-2">
              <span className="text-4xl animate-float">{creatures[1]}</span>
              <p className="text-sm">Nenhum gasto ainda</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%"
                  innerRadius={45} outerRadius={80}
                  labelLine={false} label={renderLabel} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7}
                  formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-3 card p-4 sm:p-5 animate-slide-up" style={{ animationDelay: '450ms' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Últimas Transações</p>
            <button onClick={() => setActiveTab('expenses')}
              className="text-[11px] text-accent hover:underline flex items-center gap-0.5">
              Ver tudo <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {(data?.recentTransactions || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted gap-2">
              <span className="text-3xl animate-float">{creatures[2]}</span>
              <p className="text-sm">Nenhuma transação ainda</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {data.recentTransactions.map((t, idx) => (
                <li key={t.id} className="flex items-center gap-3 group"
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: (CATEGORIES[t.category]?.color || '#64748b') + '25' }}>
                    {CATEGORIES[t.category]?.emoji || '💳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.description}</p>
                    <p className="text-[11px] text-muted">{formatDate(t.date)}</p>
                  </div>
                  <span className={clsx(
                    'text-sm font-mono font-semibold flex-shrink-0',
                    t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                  )}>
                    {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}