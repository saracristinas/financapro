import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { clsx } from 'clsx'

const TOAST_TYPES = {
  success: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    icon: CheckCircle,
    textColor: 'text-emerald-400',
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: AlertCircle,
    textColor: 'text-red-400',
  },
  info: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    icon: Info,
    textColor: 'text-blue-400',
  },
}

export function Toast({ id, type = 'info', title, message, onClose }) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(onClose, 5000) // Desaparece após 5 segundos
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={clsx(
      'fixed bottom-4 right-4 max-w-sm p-4 rounded-xl border animate-slide-up',
      'flex items-start gap-3 backdrop-blur-sm',
      config.bg,
      config.border
    )}>
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.textColor)} />
      <div className="flex-1">
        <p className={clsx('text-sm font-semibold', config.textColor)}>{title}</p>
        {message && <p className="text-xs text-gray-300 mt-1">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

