import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CalendarPlus,
  CalendarCheck,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/resources", icon: BookOpen, label: "Resources" },
  {
    to: "/book",
    icon: CalendarPlus,
    label: "Book Resource",
    hideForAdmin: true,
  },
  {
    to: "/my-bookings",
    icon: CalendarCheck,
    label: "My Bookings",
    hideForAdmin: true,
  },
];

const adminItems = [{ to: "/admin", icon: ShieldCheck, label: "Admin Panel" }];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--violet))",
          }}
        >
          <GraduationCap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <p
                className="font-display font-bold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                CampusConnect
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Resource System
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems
          .filter((item) => !(isAdmin && item.hideForAdmin))
          .map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
               ${isActive ? "text-white shadow-md" : "hover:bg-white/50"}`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    }
                  : { color: "var(--text-secondary)" }
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1">
              {!collapsed && (
                <p
                  className="text-xs font-semibold px-3 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Admin
                </p>
              )}
            </div>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                   ${isActive ? "text-white shadow-md" : "hover:bg-white/50"}`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, var(--violet), #5b3fa8)",
                      }
                    : { color: "var(--text-secondary)" }
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User + Logout */}
      <div
        className="p-3 border-t space-y-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--violet))",
            }}
          >
            {user?.fullName?.[0] || "U"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p
                  className="text-xs font-semibold truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user?.fullName}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group"
          style={{ color: "var(--text-muted)" }}
        >
          <LogOut
            size={18}
            className="group-hover:text-red-500 transition-colors flex-shrink-0"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium group-hover:text-red-500 transition-colors"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 220 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 overflow-hidden relative"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center shadow-md border z-10"
          style={{ background: "white", borderColor: "var(--border)" }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Top Bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--violet))",
            }}
          >
            <GraduationCap size={14} className="text-white" />
          </div>
          <span
            className="font-display font-bold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            CampusConnect
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid var(--border)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
