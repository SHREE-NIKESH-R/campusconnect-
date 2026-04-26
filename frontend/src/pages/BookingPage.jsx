import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Building2,
} from "lucide-react";
import { resourceApi, bookingApi } from "../utils/api";
import {
  GlassCard,
  Button,
  Select,
  Input,
  SkeletonCard,
  PageHeader,
} from "../components/ui";
import { useToast } from "../components/ui/Toast";

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export default function BookingPage() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [attendees, setAttendees] = useState(1);
  const toast = useToast();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRes, setLoadingRes] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const today = startOfToday();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(addDays(today, weekOffset * 7), i),
  );

  useEffect(() => {
    resourceApi
      .getAll()
      .then((r) => {
        const data = r.data?.data || [];
        setResources(data);
        if (resourceId) {
          const found = data.find((x) => x.id === parseInt(resourceId));
          if (found) setSelectedResource(found);
        }
      })
      .catch((err) => console.error("Failed to load resources:", err))
      .finally(() => setLoadingRes(false));
  }, [resourceId]);

  const handleSubmit = async () => {
    if (!selectedResource || !startTime || !endTime || !purpose) {
      setError("Please fill in all required fields");
      return;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }
    if (attendees > selectedResource.capacity) {
      setError(
        `Attendees cannot exceed the resource capacity of ${selectedResource.capacity}`,
      );
      return;
    }
    setError("");
    setLoading(true);
    try {
      await bookingApi.create({
        resourceId: selectedResource.id,
        bookingDate: format(selectedDate, "yyyy-MM-dd"),
        startTime: startTime + ":00",
        endTime: endTime + ":00",
        purpose,
        notes,
        attendeesCount: attendees,
      });
      setSuccess(true);
    } catch (e) {
      setError(
        toast(
          e.response?.data?.message || "Booking failed. Please try again.",
          "error",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "var(--accent-soft)" }}
          >
            <CheckCircle size={40} style={{ color: "var(--accent)" }} />
          </div>
          <h2
            className="font-display font-bold text-2xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Booking Submitted!
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Your booking is pending admin approval. You'll be notified once
            confirmed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => navigate("/my-bookings")}
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => {
                setSuccess(false);
                setStartTime("");
                setEndTime("");
                setPurpose("");
              }}
            >
              Book Another
            </Button>
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book a Resource"
        subtitle="Select a resource, date and time slot"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Resource picker + Date + Time */}
        <div className="lg:col-span-2 space-y-5">
          {/* Resource selector */}
          <GlassCard className="p-5">
            <h3
              className="font-semibold text-sm mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Select Resource
            </h3>
            {loadingRes ? (
              <SkeletonCard />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resources.length === 0 && (
                  <p
                    className="text-sm col-span-2 text-center py-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No resources found. Please check backend connection.
                  </p>
                )}
                {resources.map((r) => (
                  <motion.button
                    key={r.id}
                    whileTap={{ scale: r.available ? 0.98 : 1 }}
                    onClick={() => r.available && setSelectedResource(r)}
                    disabled={!r.available}
                    className="text-left p-3 rounded-xl border transition-all"
                    style={{
                      borderColor:
                        selectedResource?.id === r.id
                          ? "var(--accent)"
                          : "var(--border)",
                      background: !r.available
                        ? "rgba(239,68,68,0.05)"
                        : selectedResource?.id === r.id
                          ? "var(--accent-soft)"
                          : "rgba(255,255,255,0.6)",
                      opacity: r.available ? 1 : 0.6,
                      cursor: r.available ? "pointer" : "not-allowed",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {r.name}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.available ? "badge-approved" : "badge-rejected"}`}
                      >
                        {r.available ? "● Available" : "● Unavailable"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {r.location}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        • Cap. {r.capacity}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </GlassCard>
          {/* Faculty priority note */}
          {user?.role === "FACULTY" && (
            <div
              className="p-3 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(124,92,191,0.1)",
                color: "var(--violet)",
              }}
            >
              ⭐ Faculty bookings are prioritised for admin approval
            </div>
          )}
          {/* Date picker */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-semibold text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Select Date
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                  className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
                  disabled={weekOffset === 0}
                >
                  <ChevronLeft
                    size={16}
                    style={{ color: "var(--text-muted)" }}
                  />
                </button>
                <button
                  onClick={() => setWeekOffset((w) => w + 1)}
                  className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
                >
                  <ChevronRight
                    size={16}
                    style={{ color: "var(--text-muted)" }}
                  />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isPast = day < today;
                return (
                  <button
                    key={day.toISOString()}
                    disabled={isPast}
                    onClick={() => setSelectedDate(day)}
                    className="flex flex-col items-center py-2.5 px-1 rounded-xl transition-all text-center"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
                        : "transparent",
                      opacity: isPast ? 0.35 : 1,
                      cursor: isPast ? "not-allowed" : "pointer",
                    }}
                  >
                    <span
                      className="text-xs mb-1"
                      style={{
                        color: isSelected
                          ? "rgba(255,255,255,0.8)"
                          : "var(--text-muted)",
                      }}
                    >
                      {format(day, "EEE")}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: isSelected ? "white" : "var(--text-primary)",
                      }}
                    >
                      {format(day, "d")}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Time slots */}
          <GlassCard className="p-5">
            <h3
              className="font-semibold text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Select Time Slot
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Start Time
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_SLOTS.slice(0, -1).map((t) => (
                    <button
                      key={t}
                      onClick={() => setStartTime(t)}
                      className="py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background:
                          startTime === t
                            ? "var(--accent)"
                            : "rgba(255,255,255,0.6)",
                        color:
                          startTime === t ? "white" : "var(--text-secondary)",
                        border: `1px solid ${startTime === t ? "var(--accent)" : "var(--border)"}`,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  End Time
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_SLOTS.slice(1).map((t) => (
                    <button
                      key={t}
                      onClick={() => setEndTime(t)}
                      disabled={startTime && t <= startTime}
                      className="py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
                      style={{
                        background:
                          endTime === t
                            ? "var(--accent)"
                            : "rgba(255,255,255,0.6)",
                        color:
                          endTime === t ? "white" : "var(--text-secondary)",
                        border: `1px solid ${endTime === t ? "var(--accent)" : "var(--border)"}`,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Booking summary form */}
        <div className="space-y-5">
          <GlassCard className="p-5 space-y-4">
            <h3
              className="font-display font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Booking Details
            </h3>

            {selectedResource && (
              <div
                className="p-3 rounded-xl"
                style={{ background: "var(--accent-soft)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={14} style={{ color: "var(--accent)" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {selectedResource.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} style={{ color: "var(--accent-muted)" }} />
                  <span
                    className="text-xs"
                    style={{ color: "var(--accent-muted)" }}
                  >
                    {selectedResource.location}
                  </span>
                </div>
              </div>
            )}

            <div
              className="p-3 rounded-xl space-y-1"
              style={{ background: "rgba(255,255,255,0.6)" }}
            >
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>Date</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {format(selectedDate, "dd MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>Time</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {startTime && endTime ? `${startTime} – ${endTime}` : "—"}
                </span>
              </div>
            </div>

            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Purpose <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Group study for semester exams"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none resize-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Attendees
                </label>
                <input
                  type="number"
                  min={1}
                  value={attendees}
                  onChange={(e) => setAttendees(+e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Notes (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any additional requirements…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                {error}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              loading={loading}
              onClick={handleSubmit}
              disabled={!selectedResource || !startTime || !endTime || !purpose}
            >
              Submit Booking
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
