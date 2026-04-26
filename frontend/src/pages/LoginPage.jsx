import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button, Input } from '../components/ui'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  const fillDemo = (role) => {
    const demos = {
      admin:   { email: 'admin@campus.edu',   password: 'admin123'   },
      student: { email: 'student@campus.edu', password: 'student123' },
      faculty: { email: 'faculty@campus.edu', password: 'faculty123' },
    }
    setForm(demos[role])
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(91,108,248,0.4) 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,92,191,0.5) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}>
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Sign in to CampusConnect
          </p>
        </div>

        {/* Card */}
        <div className="glass-lg rounded-2xl p-8">
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@campus.edu"
              icon={Mail} value={form.email} onChange={set('email')} required />

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  <Lock size={16} />
                </span>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={set('password')} required
                  className="w-full rounded-xl border px-4 py-2.5 pl-10 pr-10 text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.8)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Sign in <ArrowRight size={16} />
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>Quick demo access</p>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'student', 'faculty'].map(role => (
                <button key={role} onClick={() => fillDemo(role)}
                  className="text-xs py-2 px-3 rounded-xl border font-medium capitalize transition-all hover:border-accent-muted"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.6)' }}>
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          New to CampusConnect?{' '}
          <Link to="/register" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
