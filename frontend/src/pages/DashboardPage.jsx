import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Building2, CalendarCheck, Clock, Users,
  CheckCircle, TrendingUp, CalendarPlus, ArrowRight
} from 'lucide-react'
import { dashboardApi, resourceApi } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { StatCard, GlassCard, Badge, SkeletonCard, Button, PageHeader } from '../components/ui'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [resRes] = await Promise.all([resourceApi.getAll()])
        setResources(resRes.data.data?.slice(0, 4) || [])
        if (isAdmin) {
          const statsRes = await dashboardApi.getStats()
          setStats(statsRes.data.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAdmin])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greeting()}, ${user?.fullName?.split(' ')[0]} 👋`}
        subtitle={format(new Date(), 'EEEE, MMMM d yyyy')}
        action={
          <Button onClick={() => navigate('/book')}>
            <CalendarPlus size={16} /> Book Resource
          </Button>
        }
      />

      {/* Stats Grid */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Resources" value={stats?.totalResources ?? '—'} icon={Building2} color="accent" loading={loading} />
          <StatCard label="Available Now" value={stats?.availableResources ?? '—'} icon={CheckCircle} color="success" loading={loading} />
          <StatCard label="Today's Bookings" value={stats?.todayBookings ?? '—'} icon={CalendarCheck} color="warning" loading={loading} />
          <StatCard label="Pending Approval" value={stats?.pendingBookings ?? '—'} icon={Clock} color="danger" loading={loading} />
        </div>
      )}

      {!isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <GlassCard className="p-5 col-span-2 lg:col-span-1"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
            <TrendingUp size={24} className="text-white/70 mb-3" />
            <p className="text-white/70 text-sm">Your Role</p>
            <p className="text-white font-display font-bold text-xl mt-1">{user?.role}</p>
            <p className="text-white/60 text-xs mt-1">{user?.department || 'No department set'}</p>
          </GlassCard>
          <StatCard label="Book a Space" value="Quick Book" icon={CalendarPlus} color="accent" />
          <StatCard label="My Bookings" value="View All" icon={CalendarCheck} color="violet" />
        </div>
      )}

      {/* Resources Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            Available Resources
          </h2>
          <button onClick={() => navigate('/resources')}
            className="flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: 'var(--accent)' }}>
            View all <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : resources.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-5 h-full flex flex-col" onClick={() => navigate(`/book/${r.id}`)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--accent-soft)' }}>
                      <Building2 size={20} style={{ color: 'var(--accent)' }} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.available ? 'badge-approved' : 'badge-rejected'}`}>
                      {r.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{r.name}</h3>
                  <p className="text-xs mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{r.location}</p>
                  <div className="flex items-center gap-2">
                    <Users size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Capacity: {r.capacity}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          }
        </div>
      </div>

      {/* Recent Bookings (Admin) */}
      {isAdmin && stats?.recentBookings?.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Bookings
          </h2>
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['User', 'Resource', 'Date', 'Time', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((b, i) => (
                    <tr key={b.id} className="hover:bg-white/40 transition-colors"
                      style={{ borderBottom: i < stats.recentBookings.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-5 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.userName}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.resourceName}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.bookingDate}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{b.startTime} – {b.endTime}</td>
                      <td className="px-5 py-3"><Badge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
