import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "var(--accent-soft)" }}
        >
          <AlertTriangle size={36} style={{ color: "var(--accent)" }} />
        </div>
        <h1
          className="font-display font-bold text-5xl mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          404
        </h1>
        <p
          className="font-display font-semibold text-lg mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Page not found
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          The page you're looking for doesn't exist or was moved.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          <Home size={16} /> Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
