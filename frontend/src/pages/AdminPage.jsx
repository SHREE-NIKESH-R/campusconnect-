import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Plus,
  Filter,
} from "lucide-react";
import { bookingApi, resourceApi } from "../utils/api";
import { useToast } from "../components/ui/Toast";
import {
  GlassCard,
  Badge,
  Button,
  EmptyState,
  PageHeader,
  SkeletonCard,
  StatCard,
} from "../components/ui";
import { format } from "date-fns";

const TABS = ["bookings", "resources"];

export default function AdminPage() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loadingB, setLoadingB] = useState(true);
  const [loadingR, setLoadingR] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [bookingFilter, setBookingFilter] = useState("ALL");
  const toast = useToast();

  const loadBookings = () => {
    setLoadingB(true);
    bookingApi
      .getAllBookings()
      .then((r) => setBookings(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoadingB(false));
  };

  const loadResources = () => {
    setLoadingR(true);
    resourceApi
      .getAll()
      .then((r) => {
        console.log("[DEBUG] Loaded resources:", r.data.data);
        setResources(r.data.data || []);
      })
      .catch((err) => {
        console.error("[DEBUG] Failed to load resources:", err);
      })
      .finally(() => setLoadingR(false));
  };

  useEffect(() => {
    loadBookings();
    loadResources();
  }, []);

  const updateStatus = async (id, status, adminNotes = "") => {
    setActionLoading(id + status);
    try {
      await bookingApi.updateStatus(id, { status, adminNotes });
      toast(`Booking ${status.toLowerCase()} successfully`, "success");
      loadBookings();
    } catch (e) {
      toast(e.response?.data?.message || "Action failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAvailability = async (id) => {
    setActionLoading("res" + id);
    try {
      await resourceApi.toggleAvailability(id);
      toast("Resource availability updated", "success");
      loadResources();
    } catch (e) {
      toast("Failed to update resource", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.bookingDate + "T" + (a.startTime || "00:00"));
    const dateB = new Date(b.bookingDate + "T" + (b.startTime || "00:00"));
    return dateA - dateB;
  });

  const filteredBookings =
    bookingFilter === "ALL"
      ? sortedBookings
      : sortedBookings.filter((b) => b.status === bookingFilter);

  const stats = {
    pending: bookings.filter((b) => b.status === "PENDING").length,
    approved: bookings.filter((b) => b.status === "APPROVED").length,
    total: bookings.length,
    resources: resources.length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage bookings, resources and users"
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="warning"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          label="Total Bookings"
          value={stats.total}
          icon={Clock}
          color="accent"
        />
        <StatCard
          label="Resources"
          value={stats.resources}
          icon={Building2}
          color="violet"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background:
                tab === t
                  ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
                  : "rgba(255,255,255,0.7)",
              color: tab === t ? "white" : "var(--text-secondary)",
              border: `1px solid ${tab === t ? "transparent" : "var(--border)"}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setBookingFilter(s)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background:
                      bookingFilter === s
                        ? "var(--accent-soft)"
                        : "rgba(255,255,255,0.6)",
                    color:
                      bookingFilter === s
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    border: `1px solid ${bookingFilter === s ? "var(--accent-muted)" : "var(--border)"}`,
                  }}
                >
                  {s[0] + s.slice(1).toLowerCase()} (
                  {s === "ALL"
                    ? bookings.length
                    : bookings.filter((b) => b.status === s).length}
                  )
                </button>
              ),
            )}
          </div>

          {loadingB ? (
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No bookings"
              description="No bookings match the selected filter"
            />
          ) : (
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {[
                        "User",
                        "Resource",
                        "Date & Time",
                        "Purpose",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, i) => (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-white/40 transition-colors"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <p
                              className="text-sm font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {b.userName}
                            </p>
                            {b.userRole === "FACULTY" && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded font-bold"
                                style={{
                                  background: "rgba(124,92,191,0.15)",
                                  color: "var(--violet)",
                                }}
                              >
                                FACULTY
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {b.userEmail}
                          </p>
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {b.resourceName}
                        </td>
                        <td className="px-4 py-3">
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {b.bookingDate
                              ? format(new Date(b.bookingDate), "dd MMM yyyy")
                              : "—"}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {b.startTime?.slice(0, 5)} –{" "}
                            {b.endTime?.slice(0, 5)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm max-w-[180px]">
                          <p
                            className="truncate"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {b.purpose}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge status={b.status} />
                        </td>
                        <td className="px-4 py-3">
                          {b.status === "PENDING" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateStatus(
                                    b.id,
                                    "APPROVED",
                                    "Approved by admin",
                                  )
                                }
                                disabled={!!actionLoading}
                                className="p-1.5 rounded-lg transition-all hover:bg-green-50"
                                title="Approve"
                              >
                                <CheckCircle
                                  size={18}
                                  style={{
                                    color:
                                      actionLoading === b.id + "APPROVED"
                                        ? "#ccc"
                                        : "#22c55e",
                                  }}
                                />
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(
                                    b.id,
                                    "REJECTED",
                                    "Rejected by admin",
                                  )
                                }
                                disabled={!!actionLoading}
                                className="p-1.5 rounded-lg transition-all hover:bg-red-50"
                                title="Reject"
                              >
                                <XCircle
                                  size={18}
                                  style={{
                                    color:
                                      actionLoading === b.id + "REJECTED"
                                        ? "#ccc"
                                        : "#ef4444",
                                  }}
                                />
                              </button>
                            </div>
                          )}
                          {b.status !== "PENDING" && (
                            <span
                              className="text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {tab === "resources" && (
        <div className="space-y-4">
          {/* Add Resource Form */}
          <GlassCard className="p-5">
            <h3
              className="font-display font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Add New Resource
            </h3>
            <AddResourceForm onSuccess={loadResources} />
          </GlassCard>

          {/* Resources Table */}
          {loadingR ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : (
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {[
                        "Name",
                        "Type",
                        "Location",
                        "Capacity",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r, i) => (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-white/40 transition-colors"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td className="px-4 py-3">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {r.name}
                          </p>
                          {r.roomNumber && (
                            <p
                              className="text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Room {r.roomNumber}
                            </p>
                          )}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {r.type?.replace("_", " ")}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {r.location}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {r.capacity}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.available ? "badge-approved" : "badge-rejected"}`}
                          >
                            {r.available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleAvailability(r.id)}
                            disabled={actionLoading === "res" + r.id}
                            className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:bg-white"
                            style={{
                              borderColor: "var(--border)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {actionLoading === "res" + r.id
                              ? "..."
                              : r.available
                                ? "Disable"
                                : "Enable"}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
  function AddResourceForm({ onSuccess }) {
    const [form, setForm] = useState({
      name: "",
      description: "",
      type: "CLASSROOM",
      location: "",
      building: "",
      floor: "",
      roomNumber: "",
      capacity: "",
      imageUrl: "",
      amenities: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async () => {
      if (!form.name || !form.location || !form.capacity) {
        setError("Name, location and capacity are required");
        return;
      }
      setLoading(true);
      setError("");
      setSuccess(false);
      try {
        const payload = {
          ...form,
          capacity: parseInt(form.capacity),
          amenities: form.amenities
            ? form.amenities.split(",").map((a) => a.trim())
            : [],
        };
        console.log("[DEBUG] Creating resource with payload:", payload);
        const response = await resourceApi.create(payload);
        console.log("[DEBUG] Create resource response:", response.data);
        setSuccess(true);
        setForm({
          name: "",
          description: "",
          type: "CLASSROOM",
          location: "",
          building: "",
          floor: "",
          roomNumber: "",
          capacity: "",
          imageUrl: "",
          amenities: "",
        });
        onSuccess();
      } catch (e) {
        const status = e.response?.status;
        const data = e.response?.data;
        if (status === 403) {
          setError("Access denied. Only admins can add resources.");
        } else if (status === 400 && data?.data) {
          // validation errors
          const messages = Object.entries(data.data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join("; ");
          setError(`Validation failed — ${messages}`);
        } else {
          setError(data?.message || "Failed to create resource");
        }
      } finally {
        setLoading(false);
      }
    };

    const fieldStyle = {
      background: "rgba(255,255,255,0.8)",
      borderColor: "var(--border)",
      color: "var(--text-primary)",
    };
    const inputCls =
      "w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all";
    const labelCls = "text-xs font-medium block mb-1.5";

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Name *
            </label>
            <input
              className={inputCls}
              style={fieldStyle}
              placeholder="e.g. CS Lab A"
              value={form.name}
              onChange={set("name")}
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Type *
            </label>
            <select
              className={inputCls}
              style={fieldStyle}
              value={form.type}
              onChange={set("type")}
            >
              {[
                "CLASSROOM",
                "LAB",
                "SEMINAR_HALL",
                "LIBRARY_ROOM",
                "AUDITORIUM",
                "CONFERENCE_ROOM",
                "SPORTS_FACILITY",
                "EQUIPMENT",
              ].map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Capacity *
            </label>
            <input
              type="number"
              className={inputCls}
              style={fieldStyle}
              placeholder="e.g. 40"
              value={form.capacity}
              onChange={set("capacity")}
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Location *
            </label>
            <input
              className={inputCls}
              style={fieldStyle}
              placeholder="e.g. Block A, Ground Floor"
              value={form.location}
              onChange={set("location")}
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Building
            </label>
            <input
              className={inputCls}
              style={fieldStyle}
              placeholder="e.g. Block A"
              value={form.building}
              onChange={set("building")}
            />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Room Number
            </label>
            <input
              className={inputCls}
              style={fieldStyle}
              placeholder="e.g. A001"
              value={form.roomNumber}
              onChange={set("roomNumber")}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Description
            </label>
            <input
              className={inputCls}
              style={fieldStyle}
              placeholder="Brief description of the resource"
              value={form.description}
              onChange={set("description")}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Amenities (comma separated)
            </label>
            <input
              className={inputCls}
              style={fieldStyle}
              placeholder="e.g. AC, Projector, Whiteboard"
              value={form.amenities}
              onChange={set("amenities")}
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && (
          <p className="text-xs text-green-600 font-medium">
            ✅ Resource added successfully!
          </p>
        )}

        <Button onClick={handleSubmit} loading={loading}>
          <Plus size={16} /> Add Resource
        </Button>
      </div>
    );
  }
}
