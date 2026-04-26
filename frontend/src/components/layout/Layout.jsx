import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen mesh-bg">
      <Sidebar />
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
