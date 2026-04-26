import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  MapPin,
  Search,
  X,
  Wifi,
  Wind,
  Monitor,
  Mic,
} from "lucide-react";
import { resourceApi } from "../utils/api";
import {
  GlassCard,
  SkeletonCard,
  Button,
  Input,
  Select,
  PageHeader,
  EmptyState,
} from "../components/ui";
import { useAuth } from "../hooks/useAuth";

const RESOURCE_TYPES = [
  "ALL",
  "CLASSROOM",
  "LAB",
  "SEMINAR_HALL",
  "LIBRARY_ROOM",
  "AUDITORIUM",
  "CONFERENCE_ROOM",
  "SPORTS_FACILITY",
  "EQUIPMENT",
];

const typeColors = {
  LAB: "#5b6cf8",
  CLASSROOM: "#22c55e",
  SEMINAR_HALL: "#f59e0b",
  AUDITORIUM: "#ef4444",
  LIBRARY_ROOM: "#7c5cbf",
  CONFERENCE_ROOM: "#0ea5e9",
  SPORTS_FACILITY: "#14b8a6",
  EQUIPMENT: "#f97316",
};

function ResourceDetailModal({ resource, onClose, onBook }) {
  if (!resource) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl p-6 relative"
        style={{
          background: "rgba(255,255,255,0.97)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${typeColors[resource.type]}20` }}
          >
            <Building2 size={22} style={{ color: typeColors[resource.type] }} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "var(--text-primary)" }}
            >
              {resource.name}
            </h2>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: typeColors[resource.type] }}
            >
              {resource.type?.replace("_", " ")}
            </span>
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          {resource.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ background: "var(--accent-soft)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} style={{ color: "var(--accent)" }} />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Location
              </span>
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {resource.location}
            </p>
            {resource.roomNumber && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Room {resource.roomNumber}
              </p>
            )}
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ background: "var(--accent-soft)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} style={{ color: "var(--accent)" }} />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Capacity
              </span>
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {resource.capacity} people
            </p>
          </div>
        </div>

        <div className="mb-5">
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            AMENITIES
          </p>
          <div className="flex flex-wrap gap-2">
            {resource.amenities?.length > 0 ? (
              resource.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  {a}
                </span>
              ))
            ) : (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                No amenities listed
              </span>
            )}
          </div>
        </div>

        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className={`text-sm font-semibold px-3 py-1.5 rounded-full ${resource.available ? "badge-approved" : "badge-rejected"}`}
          >
            {resource.available ? "● Available" : "● Unavailable"}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => onBook(resource)}
              disabled={!resource.available}
            >
              Book Now
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ResourcesPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [availFilter, setAvailFilter] = useState("ALL");
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    resourceApi
      .getAll()
      .then((r) => {
        const data = r.data?.data || [];
        setResources(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Failed to load resources:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = resources;
    if (search)
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.location.toLowerCase().includes(search.toLowerCase()) ||
          r.type?.toLowerCase().includes(search.toLowerCase()),
      );
    if (typeFilter !== "ALL") list = list.filter((r) => r.type === typeFilter);
    if (availFilter === "AVAILABLE") list = list.filter((r) => r.available);
    if (availFilter === "UNAVAILABLE") list = list.filter((r) => !r.available);
    setFiltered(list);
  }, [search, typeFilter, availFilter, resources]);

  const handleBook = (resource) => {
    setSelectedResource(null);
    navigate(`/book/${resource.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Resources"
        subtitle={`${filtered.length} of ${resources.length} resources`}
      />

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by name, location or type…"
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="sm:w-52"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "ALL" ? "All Types" : t.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
          <Select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            className="sm:w-44"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="UNAVAILABLE">Unavailable Only</option>
          </Select>
        </div>

        {/* Active filters */}
        {(search || typeFilter !== "ALL" || availFilter !== "ALL") && (
          <div
            className="flex items-center gap-2 mt-3 pt-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Active filters:
            </span>
            {search && (
              <span
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                "{search}"{" "}
                <button onClick={() => setSearch("")}>
                  <X size={10} />
                </button>
              </span>
            )}
            {typeFilter !== "ALL" && (
              <span
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                {typeFilter.replace("_", " ")}{" "}
                <button onClick={() => setTypeFilter("ALL")}>
                  <X size={10} />
                </button>
              </span>
            )}
            {availFilter !== "ALL" && (
              <span
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                {availFilter}{" "}
                <button onClick={() => setAvailFilter("ALL")}>
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
        )}
      </GlassCard>

      {/* Stats row */}
      {!loading && (
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Total", count: resources.length, color: "var(--accent)" },
            {
              label: "Available",
              count: resources.filter((r) => r.available).length,
              color: "#22c55e",
            },
            {
              label: "Unavailable",
              count: resources.filter((r) => !r.available).length,
              color: "#ef4444",
            },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.count}
                </span>{" "}
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No resources found"
          description="Try adjusting your search or filter criteria"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setAvailFilter("ALL");
              }}
            >
              Clear all filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard
                className="p-5 flex flex-col h-full"
                onClick={() => setSelectedResource(r)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${typeColors[r.type]}18` }}
                    >
                      <Building2
                        size={18}
                        style={{ color: typeColors[r.type] || "var(--accent)" }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{
                        background: typeColors[r.type] || "var(--accent)",
                      }}
                    >
                      {r.type?.replace(/_/g, " ")}
                    </span>
                  </div>
                  {/* Availability badge - clearly visible */}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.available ? "badge-approved" : "badge-rejected"}`}
                  >
                    {r.available ? "● Available" : "● Unavailable"}
                  </span>
                </div>

                {/* Name & Location */}
                <h3
                  className="font-display font-semibold text-base mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.name}
                </h3>
                <p
                  className="text-xs mb-1 flex items-center gap-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <MapPin size={11} /> {r.location}
                </p>
                <p
                  className="text-xs mb-3 line-clamp-2 flex-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {r.description}
                </p>

                {/* Capacity */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Users size={13} style={{ color: "var(--text-muted)" }} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Capacity: {r.capacity} people
                  </span>
                </div>

                {/* All amenities visible, no +N */}
                {r.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {r.amenities.map((a) => (
                      <span
                        key={a}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "var(--accent-soft)",
                          color: "var(--accent)",
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResource(r);
                    }}
                  >
                    View Details
                  </Button>
                  {!isAdmin && (
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={!r.available}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${r.id}`);
                      }}
                    >
                      {r.available ? "Book Now" : "Unavailable"}
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <ResourceDetailModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
            onBook={handleBook}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
