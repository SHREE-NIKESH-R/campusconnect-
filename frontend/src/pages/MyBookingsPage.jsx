import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, MapPin, Trash2 } from "lucide-react";
import { bookingApi } from "../utils/api";
import {
  GlassCard,
  Badge,
  Button,
  EmptyState,
  PageHeader,
  SkeletonCard,
} from "../components/ui";
import { format } from "date-fns";
import { useToast } from "../components/ui/Toast";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const toast = useToast();

  const load = () => {
    setLoading(true);
    bookingApi
      .getMyBookings()
      .then((r) => setBookings(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    setCancelling(id);
    try {
      await bookingApi.cancel(id);
      toast("Booking cancelled successfully", "success");
      load();
    } catch (e) {
      toast(e.response?.data?.message || "Failed to cancel booking", "error");
    } finally {
      setCancelling(null);
    }
  };

  const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];
  const displayed =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bookings"
        subtitle={`${bookings.length} total bookings`}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background:
                filter === s
                  ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
                  : "rgba(255,255,255,0.7)",
              color: filter === s ? "white" : "var(--text-secondary)",
              border: `1px solid ${filter === s ? "transparent" : "var(--border)"}`,
            }}
          >
            {s === "ALL" ? "All" : s[0] + s.slice(1).toLowerCase()}
            {s !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({bookings.filter((b) => b.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings found"
          description={
            filter === "ALL"
              ? "You haven't made any bookings yet."
              : `No ${filter.toLowerCase()} bookings.`
          }
        />
      ) : (
        <div className="space-y-4">
          {displayed.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="p-5" hover={false}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-display font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {b.resourceName}
                      </span>
                      <Badge status={b.status} />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarCheck
                          size={13}
                          style={{ color: "var(--text-muted)" }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {format(new Date(b.bookingDate), "dd MMM yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={13}
                          style={{ color: "var(--text-muted)" }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {b.startTime?.slice(0, 5)} – {b.endTime?.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin
                          size={13}
                          style={{ color: "var(--text-muted)" }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {b.resourceLocation}
                        </span>
                      </div>
                    </div>

                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Purpose:{" "}
                      </span>
                      {b.purpose}
                    </p>

                    {b.adminNotes && (
                      <div
                        className="p-2.5 rounded-lg text-xs"
                        style={{
                          background: "var(--accent-soft)",
                          color: "var(--accent-dark)",
                        }}
                      >
                        <span className="font-semibold">Admin note: </span>
                        {b.adminNotes}
                      </div>
                    )}
                  </div>

                  {(b.status === "PENDING" || b.status === "APPROVED") && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={cancelling === b.id}
                      onClick={() => cancel(b.id)}
                    >
                      <Trash2 size={14} /> Cancel
                    </Button>
                  )}
                </div>

                <div
                  className="mt-3 pt-3 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Booked on{" "}
                    {format(new Date(b.createdAt), "dd MMM yyyy · HH:mm")}
                  </span>
                  {b.approvedAt && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--success)" }}
                    >
                      Approved {format(new Date(b.approvedAt), "dd MMM")}
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
