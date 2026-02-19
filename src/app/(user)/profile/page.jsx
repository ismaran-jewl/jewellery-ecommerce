"use client";

import { apiUrl } from "@/lib/fetcher";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/account"))
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setRecentProducts(d.recentProducts || []);
          setRecommendedProducts(d.recommendedProducts || []);
        }
      });
  }, []);

  const notify = (text, type = "ok") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const saveName = async () => {
    setLoading(true);
    const r = await fetch("/api/account/update-name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: user.name }),
    });
    if (r.ok) { notify("Name saved!"); setEditingName(false); }
    else notify("Something went wrong.", "err");
    setLoading(false);
  };

  const savePw = async () => {
    if (newPw !== confirmPw) { notify("Passwords don't match.", "err"); return; }
    setLoading(true);
    const r = await fetch("/api/account/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
    });
    const d = await r.json();
    if (!r.ok) notify(d.message || "Update failed.", "err");
    else {
      notify("Password updated!");
      setOldPw(""); setNewPw(""); setConfirmPw(""); setShowPw(false);
    }
    setLoading(false);
  };

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "?";

  if (!user.email) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-teal-50">
      <div className="bg-white/50 backdrop-blur-xl border border-white/70 rounded-3xl p-12 flex flex-col items-center gap-4 shadow-xl">
        <div className="w-9 h-9 rounded-full border-[3px] border-orange-200 border-t-orange-400 animate-spin" />
        <p className="text-orange-400 font-semibold">Loading your profile…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-teal-50 relative overflow-hidden">

      {/* Ambient orbs */}
      <div className="fixed -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-orange-300/25 blur-[90px] pointer-events-none" />
      <div className="fixed -bottom-36 -left-28 w-[420px] h-[420px] rounded-full bg-teal-300/20 blur-[80px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-[280px] h-[280px] rounded-full bg-amber-200/25 blur-[70px] pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/50 backdrop-blur-xl shadow-lg text-sm font-semibold text-white ${toast.type === "ok" ? "bg-teal-400/85" : "bg-orange-400/90"}`}>
          <span>{toast.type === "ok" ? "✓" : "✕"}</span> {toast.text}
        </div>
      )}

      {/* ── PAGE GRID ── */}
      <div className="relative z-10 max-w-[1160px] mx-auto p-6 grid gap-5 min-h-screen"
        style={{
          gridTemplateColumns: "260px 1fr",
          gridTemplateRows: "auto 1fr auto",
          gridTemplateAreas: '"sidebar toprow" "sidebar products" "sidebar banner"',
        }}>

        {/* ════════════════════════════════
            SIDEBAR
        ════════════════════════════════ */}
        <aside
          className="bg-white/35 backdrop-blur-2xl border border-white/75 rounded-[26px] shadow-lg flex flex-col gap-5 p-6"
          style={{ gridArea: "sidebar" }}>

          {/* Avatar block */}
          <div className="flex flex-col items-center gap-2.5 pb-5 border-b border-white/60">
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {initials}
            </div>
            <p className="font-bold text-amber-900 text-base text-center leading-tight">{user.name || "—"}</p>
            <p className="text-xs text-amber-700/55 text-center break-all">{user.email}</p>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700/45">Display Name</span>
              <button
                onClick={() => setEditingName((v) => !v)}
                className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors cursor-pointer"
              >
                {editingName ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingName ? (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200/70 bg-white/60 backdrop-blur text-sm text-amber-900 placeholder-amber-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
                <button
                  onClick={saveName}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:translate-y-0 cursor-pointer"
                >
                  {loading ? "Saving…" : "Save Name"}
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-amber-900 py-0.5">{user.name || "—"}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700/45">Email</span>
            <input
              disabled
              value={user.email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-orange-100 bg-white/25 text-sm text-amber-700/55 cursor-not-allowed"
            />
          </div>

          <hr className="border-white/55" />

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700/45">Password</span>
              <button
                onClick={() => setShowPw((v) => !v)}
                className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors cursor-pointer"
              >
                {showPw ? "Cancel" : "Change"}
              </button>
            </div>

            {!showPw && (
              <p className="text-2xl tracking-[6px] text-teal-200 py-1">●●●●●●</p>
            )}

            {showPw && (
              <div className="flex flex-col gap-2">
                <input type="password" placeholder="Current password" value={oldPw} onChange={(e) => setOldPw(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/70 bg-white/60 backdrop-blur text-sm text-amber-900 placeholder-teal-300 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
                <input type="password" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/70 bg-white/60 backdrop-blur text-sm text-amber-900 placeholder-teal-300 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
                <input type="password" placeholder="Confirm new password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/70 bg-white/60 backdrop-blur text-sm text-amber-900 placeholder-teal-300 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
                <button
                  onClick={savePw}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:translate-y-0 cursor-pointer"
                >
                  {loading ? "Saving…" : "Update Password"}
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ════════════════════════════════
            TOP ROW — Stat Cards
        ════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-5" style={{ gridArea: "toprow" }}>
          {[
            { icon: "🛍️", num: recentProducts.length, label: "Recently Visited" },
            { icon: "🌿", num: recommendedProducts.length, label: "Suggested For You" },
          ].map((s, i) => (
            <div key={i} className="bg-white/35 backdrop-blur-2xl border border-white/75 rounded-[26px] shadow-lg flex items-center gap-5 px-7 py-5 hover:bg-white/45 hover:shadow-xl transition-all">
              <span className="text-4xl">{s.icon}</span>
              <div>
                <div className="text-3xl font-bold text-amber-900 leading-none">{s.num}</div>
                <div className="text-xs font-semibold text-amber-700/50 mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════
            PRODUCTS
        ════════════════════════════════ */}
        <div className="flex flex-col gap-4" style={{ gridArea: "products" }}>

          {/* Recently visited */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-bold text-amber-900 text-lg">Recently Visited 💖</h2>
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-orange-100 text-orange-500">{recentProducts.length} items</span>
            </div>
            {recentProducts.length === 0 ? (
              <div className="flex items-center justify-center py-7 border border-dashed border-amber-200 rounded-2xl bg-white/20 text-sm text-amber-700/40">
                No recent visits yet. Start exploring!
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recentProducts.map((p, i) => (
                  <div key={i} className="flex-shrink-0 w-36 bg-white/35 backdrop-blur-2xl border border-white/75 rounded-[22px] shadow-md p-3 flex flex-col gap-2 cursor-pointer hover:-translate-y-1.5 hover:bg-white/50 hover:shadow-xl transition-all">
                    <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200" />
                    <p className="text-xs font-semibold text-amber-900 truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-bold text-amber-900 text-lg">Suggested For You 🌿</h2>
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-teal-100 text-teal-600">{recommendedProducts.length} picks</span>
            </div>
            {recommendedProducts.length === 0 ? (
              <div className="flex items-center justify-center py-7 border border-dashed border-teal-200 rounded-2xl bg-white/20 text-sm text-amber-700/40">
                Recommendations coming soon!
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendedProducts.map((p, i) => (
                  <div key={i} className="flex-shrink-0 w-36 bg-white/35 backdrop-blur-2xl border border-white/75 rounded-[22px] shadow-md p-3 flex flex-col gap-2 cursor-pointer hover:-translate-y-1.5 hover:bg-white/50 hover:shadow-xl transition-all">
                    <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-200" />
                    <p className="text-xs font-semibold text-amber-900 truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════
            OFFERS BANNER
        ════════════════════════════════ */}
        <div
          className="relative overflow-hidden rounded-[26px] flex items-center justify-between gap-6 px-9 py-7 shadow-xl"
          style={{ gridArea: "banner" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-teal-400" />
          <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 left-[44%] w-28 h-28 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-[10px] font-bold tracking-[0.18em] text-white/70 uppercase mb-1">✦ Exclusive For You</p>
            <h2 className="text-xl font-bold text-white leading-tight">Tailored Offers & Discounts ✨</h2>
            <p className="text-sm text-white/75 mt-1">Crafted from your taste and vibe.</p>
          </div>

          <button className="relative z-10 flex-shrink-0 px-6 py-3 rounded-2xl border-2 border-white/50 bg-white/20 backdrop-blur text-white font-bold text-sm hover:bg-white/35 hover:scale-105 transition-all whitespace-nowrap cursor-pointer">
            View My Offers →
          </button>
        </div>

      </div>
    </div>
  );
}