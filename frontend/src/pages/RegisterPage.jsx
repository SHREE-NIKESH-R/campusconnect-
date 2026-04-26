import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Hash, Phone, GraduationCap, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button, Input, Select } from '../components/ui'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    studentId: "",
    phone: "",
    role: "",
  });

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: value };
      if (k === "role" && value === "FACULTY") {
        next.studentId = "";
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,191,0.5) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--violet))",
            }}
          >
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1
            className="font-display font-bold text-2xl mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Create account
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Join CampusConnect today
          </p>
        </div>

        <div className="glass-lg rounded-2xl p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Arjun Krishnan"
              icon={User}
              value={form.fullName}
              onChange={set("fullName")}
              required
            />

            <Select
              label="Role"
              value={form.role}
              onChange={set("role")}
              required
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
            </Select>

            <Input
              label="Email"
              type="email"
              placeholder="you@campus.edu"
              icon={Mail}
              value={form.email}
              onChange={set("email")}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              icon={Lock}
              value={form.password}
              onChange={set("password")}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Department"
                placeholder="Computer Science"
                value={form.department}
                onChange={set("department")}
              />
              <Input
                label="Phone"
                placeholder="+91 9000000000"
                icon={Phone}
                value={form.phone}
                onChange={set("phone")}
              />
            </div>

            {form.role === "STUDENT" && (
              <Input
                label="Student ID"
                placeholder="CS2024001"
                icon={Hash}
                value={form.studentId}
                onChange={set("studentId")}
                required
              />
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
              size="lg"
            >
              Create Account <ArrowRight size={16} />
            </Button>
          </form>
        </div>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--text-muted)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
