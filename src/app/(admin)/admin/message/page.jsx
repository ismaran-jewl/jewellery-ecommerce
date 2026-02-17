"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconMic = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const IconVideo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconStop = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

// ─── Recording Modal ───────────────────────────────────────────────────────────
function RecordingModal({ mode, onClose, onSave }) {
  const [status, setStatus] = useState("idle"); // idle | recording | preview
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const liveVideoRef = useRef(null);
  const previewRef = useRef(null);
  const previewUrlRef = useRef(null);

  const isVideo = mode === "video";

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
  };

  const startRecording = async () => {
    setError("");
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        isVideo ? { video: true, audio: true } : { audio: true }
      );
      streamRef.current = stream;

      if (isVideo && liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const mimeType = isVideo ? "video/webm" : "audio/webm";
        const recorded = new Blob(chunksRef.current, { type: mimeType });
        setBlob(recorded);
        const url = URL.createObjectURL(recorded);
        previewUrlRef.current = url;
        if (previewRef.current) {
          previewRef.current.src = url;
        }
        setStatus("preview");
      };

      recorder.start();
      setStatus("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      setError("Could not access " + (isVideo ? "camera/microphone" : "microphone") + ". Check permissions.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const resetRecording = () => {
    setBlob(null);
    setSeconds(0);
    setStatus("idle");
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const handleSave = () => {
    if (blob) onSave(blob, blob.type);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>
            <span style={{ ...styles.modeBadge, background: isVideo ? "#3b82f6" : "#8b5cf6" }}>
              {isVideo ? <IconVideo /> : <IconMic />}
            </span>
            <span>{isVideo ? "Video Message" : "Voice Message"}</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}><IconX /></button>
        </div>

        {/* Body */}
        <div style={styles.modalBody}>
          {error && <div style={styles.errorBanner}>{error}</div>}

          {/* Live preview (video only, while recording) */}
          {isVideo && status === "recording" && (
            <video
              ref={liveVideoRef}
              autoPlay
              muted
              playsInline
              style={styles.videoEl}
            />
          )}

          {/* Preview after recording */}
          {status === "preview" && (
            isVideo
              ? <video ref={previewRef} controls style={styles.videoEl} />
              : <audio ref={previewRef} controls style={styles.audioEl} />
          )}

          {/* Idle placeholder */}
          {status === "idle" && !isVideo && (
            <div style={styles.audioPlaceholder}>
              <div style={styles.waveIcon}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} style={{ ...styles.waveBar, height: `${12 + Math.sin(i) * 10}px` }} />
                ))}
              </div>
              <p style={styles.placeholderText}>Ready to record your voice message</p>
            </div>
          )}

          {status === "idle" && isVideo && (
            <div style={styles.videoPlaceholder}>
              <IconVideo />
              <p style={styles.placeholderText}>Camera will activate when you start recording</p>
            </div>
          )}

          {/* Timer */}
          {status === "recording" && (
            <div style={styles.timerRow}>
              <span style={styles.recDot} />
              <span style={styles.timerText}>{fmt(seconds)}</span>
              <span style={styles.recLabel}>REC</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={styles.modalFooter}>
          {status === "idle" && (
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={startRecording}>
              {isVideo ? <IconVideo /> : <IconMic />}
              Start Recording
            </button>
          )}
          {status === "recording" && (
            <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={stopRecording}>
              <IconStop />
              Stop
            </button>
          )}
          {status === "preview" && (
            <>
              <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={resetRecording}>
                <IconRefresh />
                Re-record
              </button>
              <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={handleSave}>
                Save Message
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Playback Modal ────────────────────────────────────────────────────────────
function PlaybackModal({ message, onClose }) {
  const isVideo = message.contentType?.startsWith("video");
  const src = `data:${message.contentType};base64,${message.contentBase64}`;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.modal, maxWidth: 600 }}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>
            <span style={{ ...styles.modeBadge, background: isVideo ? "#3b82f6" : "#8b5cf6" }}>
              {isVideo ? <IconVideo /> : <IconMic />}
            </span>
            <div>
              <div>{isVideo ? "Video" : "Voice"} Message</div>
              <div style={styles.senderSub}>
                {message.sender?.name || message.sender?.email || "Unknown"}
              </div>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}><IconX /></button>
        </div>
        <div style={styles.modalBody}>
          {isVideo
            ? <video src={src} controls autoPlay style={styles.videoEl} />
            : <audio src={src} controls autoPlay style={styles.audioEl} />
          }
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordMode, setRecordMode] = useState(null); // null | 'audio' | 'video'
  const [playback, setPlayback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/message");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMessages(data);
    } catch {
      showToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleSave = async (blob, contentType) => {
    setSaving(true);
    setRecordMode(null);
    try {
      const formData = new FormData();
      formData.append("media", blob, `recording.${contentType.split("/")[1]}`);
      const res = await fetch("/api/admin/message", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      showToast("Message saved successfully");
      await fetchMessages();
    } catch {
      showToast("Failed to save message", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/message?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      showToast("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#ef4444" : "#22c55e" }}>
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {recordMode && (
        <RecordingModal
          mode={recordMode}
          onClose={() => setRecordMode(null)}
          onSave={handleSave}
        />
      )}
      {playback && (
        <PlaybackModal
          message={playback}
          onClose={() => setPlayback(null)}
        />
      )}

      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Message Center</h1>
          <p style={styles.pageSubtitle}>Voice & video messages from users</p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={{ ...styles.btn, ...styles.btnAudio }}
            onClick={() => setRecordMode("audio")}
            disabled={saving}
          >
            <IconMic />
            Voice Message
          </button>
          <button
            style={{ ...styles.btn, ...styles.btnVideo }}
            onClick={() => setRecordMode("video")}
            disabled={saving}
          >
            <IconVideo />
            Video Message
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { label: "Total Messages", value: messages.length },
          { label: "Voice", value: messages.filter(m => m.contentType?.startsWith("audio")).length },
          { label: "Video", value: messages.filter(m => m.contentType?.startsWith("video")).length },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <span style={styles.tableTitle}>All Messages</span>
          <button style={styles.refreshBtn} onClick={fetchMessages} disabled={loading}>
            <IconRefresh /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.spinner} />
            <p>Loading messages…</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><IconMic /></div>
            <p style={styles.emptyText}>No messages yet</p>
            <p style={styles.emptyHint}>Use the buttons above to record a message</p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["#", "Sender", "Type", "Date & Time", "Actions"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, idx) => {
                  const isVideo = msg.contentType?.startsWith("video");
                  return (
                    <tr key={msg._id} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.rowNum}>{idx + 1}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.senderCell}>
                          <div style={styles.avatar}>
                            {msg.sender?.image
                              ? <img src={msg.sender.image} alt="" style={styles.avatarImg} />
                              : <span>{(msg.sender?.name || msg.sender?.email || "?")[0].toUpperCase()}</span>
                            }
                          </div>
                          <div>
                            <div style={styles.senderName}>{msg.sender?.name || "—"}</div>
                            <div style={styles.senderEmail}>{msg.sender?.email || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.typeBadge,
                          background: isVideo ? "#dbeafe" : "#f3e8ff",
                          color: isVideo ? "#1d4ed8" : "#7c3aed",
                        }}>
                          {isVideo ? <IconVideo /> : <IconMic />}
                          {isVideo ? "Video" : "Voice"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.dateText}>{formatDate(msg.createdAt)}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionBtns}>
                          <button
                            style={styles.playBtn}
                            onClick={() => setPlayback(msg)}
                            title="Play"
                          >
                            <IconPlay /> Play
                          </button>
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDelete(msg._id)}
                            title="Delete"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f13",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "32px 24px",
    position: "relative",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "12px 20px",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    zIndex: 9999,
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: "4px 0 0",
  },
  headerActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: "#1a1a24",
    border: "1px solid #2d2d3d",
    borderRadius: 12,
    padding: "16px 20px",
  },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#e2e8f0",
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  tableCard: {
    background: "#1a1a24",
    border: "1px solid #2d2d3d",
    borderRadius: 16,
    overflow: "hidden",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid #2d2d3d",
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#e2e8f0",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: "1px solid #2d2d3d",
    color: "#94a3b8",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 20px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: "#16161f",
    borderBottom: "1px solid #2d2d3d",
  },
  tr: {
    borderBottom: "1px solid #1e1e2e",
    transition: "background 0.15s",
  },
  td: {
    padding: "14px 20px",
    fontSize: 14,
    verticalAlign: "middle",
  },
  rowNum: {
    color: "#475569",
    fontWeight: 600,
    fontSize: 13,
  },
  senderCell: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    color: "#fff",
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  senderName: {
    fontWeight: 600,
    color: "#e2e8f0",
    fontSize: 14,
  },
  senderEmail: {
    fontSize: 12,
    color: "#64748b",
  },
  typeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  dateText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  actionBtns: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  playBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "opacity 0.15s",
  },
  deleteBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "#ef4444",
    border: "1px solid #3f1c1c",
    borderRadius: 8,
    padding: 7,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#475569",
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#1e1e2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    color: "#475569",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#64748b",
    margin: "0 0 4px",
  },
  emptyHint: {
    fontSize: 13,
    color: "#334155",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #2d2d3d",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    margin: "0 auto 16px",
    animation: "spin 0.8s linear infinite",
  },

  // ── Modal ────────────────────────────────────────
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#1a1a24",
    border: "1px solid #2d2d3d",
    borderRadius: 20,
    width: "100%",
    maxWidth: 480,
    overflow: "hidden",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    borderBottom: "1px solid #2d2d3d",
  },
  modalTitle: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 17,
    fontWeight: 700,
    color: "#e2e8f0",
  },
  senderSub: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 400,
  },
  modeBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
  },
  modalBody: {
    padding: "20px",
  },
  modalFooter: {
    padding: "16px 20px",
    borderTop: "1px solid #2d2d3d",
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },
  errorBanner: {
    background: "#3f1c1c",
    border: "1px solid #7f1d1d",
    color: "#fca5a5",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 14,
  },
  videoEl: {
    width: "100%",
    borderRadius: 12,
    background: "#000",
    display: "block",
  },
  audioEl: {
    width: "100%",
    marginTop: 8,
  },
  audioPlaceholder: {
    background: "#13131d",
    borderRadius: 12,
    padding: "32px 20px",
    textAlign: "center",
  },
  videoPlaceholder: {
    background: "#13131d",
    borderRadius: 12,
    padding: "48px 20px",
    textAlign: "center",
    color: "#475569",
  },
  placeholderText: {
    fontSize: 13,
    color: "#475569",
    margin: "12px 0 0",
  },
  waveIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    height: 40,
  },
  waveBar: {
    width: 4,
    borderRadius: 4,
    background: "#6366f1",
    opacity: 0.7,
  },
  timerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 14,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#ef4444",
    animation: "pulse 1s ease-in-out infinite",
  },
  timerText: {
    fontVariantNumeric: "tabular-nums",
    fontSize: 22,
    fontWeight: 700,
    color: "#e2e8f0",
    letterSpacing: "0.05em",
  },
  recLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#ef4444",
    letterSpacing: "0.1em",
  },

  // ── Buttons ──────────────────────────────────────
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 18px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.15s, transform 0.1s",
  },
  btnPrimary: { background: "#6366f1", color: "#fff" },
  btnDanger:  { background: "#ef4444", color: "#fff" },
  btnSuccess: { background: "#22c55e", color: "#fff" },
  btnGhost:   { background: "#1e1e2e", color: "#94a3b8", border: "1px solid #2d2d3d" },
  btnAudio:   { background: "#5b21b6", color: "#fff" },
  btnVideo:   { background: "#1d4ed8", color: "#fff" },
};