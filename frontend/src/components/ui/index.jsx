import { motion } from 'framer-motion'
import { clsx } from 'clsx'

// ── GlassCard ─────────────────────────────────────────────────────────────────
export function GlassCard({ children, className = '', hover = true, onClick, style = {} }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -3, boxShadow: '0 20px 60px rgba(91,108,248,0.14), 0 4px 16px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.2 }}
      className={clsx(
        'glass rounded-2xl overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'accent', change, loading }) {
  const colors = {
    accent:  { bg: 'rgba(91,108,248,0.12)',  icon: '#5b6cf8', text: '#3d4fd4' },
    violet:  { bg: 'rgba(124,92,191,0.12)',  icon: '#7c5cbf', text: '#5b3fa8' },
    success: { bg: 'rgba(34,197,94,0.12)',   icon: '#22c55e', text: '#166534' },
    warning: { bg: 'rgba(245,158,11,0.12)',  icon: '#f59e0b', text: '#92400e' },
    danger:  { bg: 'rgba(239,68,68,0.12)',   icon: '#ef4444', text: '#991b1b' },
  }
  const c = colors[color] || colors.accent

  if (loading) return (
    <div className="glass rounded-2xl p-5">
      <div className="skeleton h-4 w-24 mb-3" />
      <div className="skeleton h-8 w-16 mb-2" />
      <div className="skeleton h-3 w-20" />
    </div>
  )

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.bg }}>
          <Icon size={20} style={{ color: c.icon }} />
        </div>
        {change !== undefined && (
          <span className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ background: change >= 0 ? '#dcfce7' : '#fee2e2', color: change >= 0 ? '#166534' : '#991b1b' }}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </GlassCard>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    PENDING:   { label: 'Pending',   cls: 'badge-pending'   },
    APPROVED:  { label: 'Approved',  cls: 'badge-approved'  },
    REJECTED:  { label: 'Rejected',  cls: 'badge-rejected'  },
    CANCELLED: { label: 'Cancelled', cls: 'badge-cancelled' },
    COMPLETED: { label: 'Completed', cls: 'badge-completed' },
  }
  const b = map[status] || { label: status, cls: 'badge-pending' }
  return (
    <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full', b.cls)}>
      {b.label}
    </span>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) {
  const variants = {
    primary: 'text-white shadow-md hover:shadow-lg active:scale-95',
    secondary: 'border hover:bg-white/80 active:scale-95',
    ghost: 'hover:bg-white/60 active:scale-95',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-95',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={variant === 'primary'
        ? { background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }
        : variant === 'secondary'
        ? { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.6)' }
        : { color: 'var(--text-secondary)' }
      }
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      {label && <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            <Icon size={16} />
          </span>
        )}
        <input
          className={clsx(
            'w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200',
            'focus:ring-2 focus:ring-offset-0',
            Icon && 'pl-10',
            error && 'border-red-300',
          )}
          style={{
            background: 'rgba(255,255,255,0.8)',
            borderColor: error ? '#fca5a5' : 'var(--border)',
            color: 'var(--text-primary)',
            '--tw-ring-color': 'rgba(91,108,248,0.25)',
          }}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      {label && <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
      <select
        className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.8)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-12 rounded-full" />
      </div>
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-16 text-center">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: 'var(--accent-soft)' }}>
        <Icon size={28} style={{ color: 'var(--accent)' }} />
      </div>
      <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>{description}</p>
      {action}
    </motion.div>
  )
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
