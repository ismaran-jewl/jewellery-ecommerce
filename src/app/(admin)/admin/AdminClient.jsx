"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus, Edit, Trash2, LayoutDashboard, Package, ShoppingCart,
  MessageSquare, Menu, Search, X, TrendingUp, TrendingDown,
  IndianRupee, Users, AlertTriangle, RefreshCw, ChevronDown,
  Eye, CheckCircle, Truck, Clock, XCircle, Loader2, Volume2, Video,
  Tag,
} from "lucide-react";
import { apiUrl } from "@/lib/fetcher";
import { motion, AnimatePresence } from "framer-motion";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ── Status pill ───────────────────────────────────────────────
const ORDER_STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const STATUS_STYLE = {
  Processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Confirmed:  "bg-blue-50 text-blue-700 border-blue-200",
  Shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  Delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled:  "bg-red-50 text-red-700 border-red-200",
};
function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLE[status] || "bg-stone-50 text-stone-600"}`}>
      {status}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, trend, loading }) {
  const positive = trend >= 0;
  return (
    <Card className="shadow-sm border-stone-200 overflow-hidden">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-stone-600" />
          </div>
          {trend !== undefined && !loading && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}>
              {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-7 w-24 bg-stone-200 rounded" />
            <div className="h-3 w-32 bg-stone-100 rounded" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-stone-800">{value}</div>
            <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/stats"));
      if (res.ok) setStats(await res.json());
      else toast.error("Failed to load dashboard stats");
    } catch { toast.error("Could not reach server"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const statusIcons = {
    Processing: Clock,
    Confirmed: CheckCircle,
    Shipped: Truck,
    Delivered: CheckCircle,
    Cancelled: XCircle,
  };

  return (
    <div className="space-y-6">
      {/* Refresh */}
      <div className="flex justify-end">
        <button onClick={fetchStats} disabled={loading} className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue" icon={IndianRupee}
          value={fmt(stats?.totalRevenue)} sub="From all paid orders"
          trend={stats?.revenueGrowth} loading={loading}
        />
        <StatCard
          title="Total Orders" icon={ShoppingCart}
          value={stats?.totalOrders ?? "—"} sub={`${stats?.ordersThisMonth ?? 0} this month`}
          trend={stats?.orderGrowth} loading={loading}
        />
        <StatCard
          title="Products" icon={Package}
          value={stats?.totalProducts ?? "—"} sub="Active in catalogue"
          loading={loading}
        />
        <StatCard
          title="Customers" icon={Users}
          value={stats?.totalUsers ?? "—"} sub="Registered accounts"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-stone-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-stone-800 text-sm font-semibold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {loading ? (
                <div className="px-6 py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-stone-400" /></div>
              ) : !stats?.recentOrders?.length ? (
                <div className="px-6 py-8 text-center text-stone-400 text-sm">No orders yet.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-stone-400 uppercase border-b border-stone-100">
                      <th className="px-6 py-2 font-medium">Customer</th>
                      <th className="px-6 py-2 font-medium">Amount</th>
                      <th className="px-6 py-2 font-medium">Status</th>
                      <th className="px-6 py-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-medium text-stone-800 text-sm">{order.user?.name ?? "Guest"}</p>
                          <p className="text-xs text-stone-400">{order.user?.email}</p>
                        </td>
                        <td className="px-6 py-3 font-semibold text-stone-800">{fmt(order.totalPrice)}</td>
                        <td className="px-6 py-3"><StatusBadge status={order.status} /></td>
                        <td className="px-6 py-3 text-xs text-stone-400">{fmtDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Orders by status */}
          <Card className="shadow-sm border-stone-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-stone-800 text-sm font-semibold">Orders by Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? <div className="h-24 animate-pulse bg-stone-50 rounded" /> :
                ORDER_STATUSES.map((s) => {
                  const Icon = statusIcons[s] || Clock;
                  const count = stats?.ordersByStatus?.[s] ?? 0;
                  const total = stats?.totalOrders || 1;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-xs text-stone-600 flex-1">{s}</span>
                      <div className="flex-1 bg-stone-100 rounded-full h-1.5 mx-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / total) * 100}%` }}
                          className="h-full bg-stone-600 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-semibold text-stone-700 w-4 text-right">{count}</span>
                    </div>
                  );
                })
              }
            </CardContent>
          </Card>

          {/* Low stock alerts */}
          {(stats?.lowStockProducts?.length > 0) && (
            <Card className="shadow-sm border-orange-200 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-800 text-sm font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p._id} className="flex items-center gap-2">
                    <img src={p.image} alt={p.name} className="w-7 h-7 rounded object-cover border border-orange-200 shrink-0" />
                    <span className="text-xs text-orange-800 flex-1 truncate">{p.name}</span>
                    <span className={`text-xs font-bold ${p.stock === 0 ? "text-red-600" : "text-orange-600"}`}>{p.stock} left</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders]     = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch]     = useState("");
  const [updating, setUpdating] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ status: statusFilter, limit: "50" });
      const res = await fetch(apiUrl(`/api/admin/orders?${q}`));
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
        setTotal(data.total ?? 0);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating((u) => ({ ...u, [orderId]: true }));
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order marked as ${newStatus}`);
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Failed to update status");
      }
    } catch { toast.error("Network error"); }
    finally { setUpdating((u) => ({ ...u, [orderId]: false })); }
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o._id?.toString().toLowerCase().includes(s) ||
      o.user?.name?.toLowerCase().includes(s) ||
      o.user?.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", ...ORDER_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                statusFilter === s
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {s === "all" ? "All Orders" : s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-stone-400" />
            <input
              className="pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 w-44"
              placeholder="Search name, email, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={fetchOrders} disabled={loading} className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors text-stone-500 disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Total */}
      <p className="text-xs text-stone-400">{total} total order{total !== 1 ? "s" : ""}</p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-stone-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                    {search ? "No orders match your search" : "No orders found"}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <>
                    <tr
                      key={order._id}
                      className="hover:bg-stone-50/60 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-stone-500">
                        #{order._id?.toString().slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-800">{order.user?.name ?? "—"}</p>
                        <p className="text-xs text-stone-400 truncate max-w-[140px]">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-stone-800">{fmt(order.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${order.isPaid ? "text-emerald-600" : "text-orange-500"}`}>
                          {order.isPaid ? "✓ Paid" : "Pending"}{order.paymentMethod ? ` · ${order.paymentMethod}` : ""}
                        </span>
                        {order.discountAmount > 0 && (
                          <p className="text-[10px] text-emerald-500">−{fmt(order.discountAmount)} ({order.promoCode})</p>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-xs text-stone-400">{fmtDate(order.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {updating[order._id] ? (
                            <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                          ) : (
                            <Select
                              value={order.status}
                              onValueChange={(val) => updateStatus(order._id, val)}
                            >
                              <SelectTrigger className="h-7 text-xs w-32 border-stone-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Expanded row — order items */}
                    {expandedId === order._id && (
                      <tr key={`${order._id}-exp`}>
                        <td colSpan={7} className="px-4 py-3 bg-stone-50 border-t border-stone-100">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Order Items</p>
                            {order.orderItems?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-stone-800 truncate">{item.name}</p>
                                  <p className="text-[10px] text-stone-400">Qty: {item.quantity} · {fmt(item.price)} each</p>
                                </div>
                                <p className="text-xs font-semibold text-stone-700">{fmt(item.price * item.quantity)}</p>
                              </div>
                            ))}
                            <div className="border-t border-stone-200 pt-2 mt-2 text-xs text-stone-500 space-y-1">
                              <div className="flex justify-between"><span>Ship to:</span><span className="text-stone-700 font-medium">{order.shippingAddress?.address}, {order.shippingAddress?.city} — {order.shippingAddress?.postalCode}</span></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Messages Tab ──────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState({});

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/message"));
      if (res.ok) setMessages(await res.json());
      else toast.error("Failed to fetch messages");
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    setDeleting((d) => ({ ...d, [id]: true }));
    try {
      const res = await fetch(`/api/admin/message?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted");
        setMessages((m) => m.filter((msg) => msg._id !== id));
      } else toast.error("Failed to delete");
    } catch { toast.error("Network error"); }
    finally { setDeleting((d) => ({ ...d, [id]: false })); }
  };

  const renderMedia = (msg) => {
    if (!msg.contentBase64 || !msg.contentType) return null;
    const src = `data:${msg.contentType};base64,${msg.contentBase64}`;
    if (msg.contentType.startsWith("audio")) {
      return <audio controls src={src} className="w-full h-8 mt-2" />;
    }
    if (msg.contentType.startsWith("video")) {
      return <video controls src={src} className="w-full rounded-lg mt-2 max-h-48" />;
    }
    return null;
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-stone-500">{messages.length} message{messages.length !== 1 ? "s" : ""} received</p>
        <button onClick={fetchMessages} disabled={loading} className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>
      ) : messages.length === 0 ? (
        <Card className="shadow-sm border-stone-200">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="w-10 h-10 text-stone-200 mb-3" />
            <h3 className="text-base font-semibold text-stone-700">No messages yet</h3>
            <p className="text-sm text-stone-400 mt-1">Gift messages from customers will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${msg.contentType?.startsWith("audio") ? "bg-blue-500" : "bg-purple-500"}`}>
                    {msg.contentType?.startsWith("audio") ? <Volume2 className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{msg.sender?.name ?? "Anonymous"}</p>
                    <p className="text-[10px] text-stone-400">{msg.sender?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(msg._id)}
                  disabled={deleting[msg._id]}
                  className="text-stone-300 hover:text-red-400 transition-colors"
                >
                  {deleting[msg._id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              {renderMedia(msg)}
              <p className="text-[10px] text-stone-400">{fmtDate(msg.createdAt)}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Products Tab ──────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "",
    type: "", material: "", gender: "Women", image: "", stock: "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/products"));
      if (res.ok) setProducts(await res.json());
      else toast.error("Failed to fetch products");
    } catch { toast.error("Error fetching products"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetForm = () => setFormData({ name: "", description: "", price: "", category: "", type: "", material: "", gender: "Women", image: "", stock: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url    = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(editingProduct ? "Product updated" : "Product created");
        setIsDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Failed to save product");
      }
    } catch { toast.error("Network error"); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, description: product.description || "",
      price: product.price.toString(), category: product.category,
      type: product.type, material: product.material,
      gender: product.gender || "Women",
      image: product.image, stock: product.stock.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Product deleted"); fetchProducts(); }
      else toast.error("Failed to delete product");
    } catch { toast.error("Network error"); }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.material?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputCls = "border-stone-200 focus:ring-stone-500 text-stone-800 text-sm";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-stone-400" />
          <Input
            placeholder="Search products…"
            className={`pl-9 ${inputCls} w-56`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProduct(null); resetForm(); setIsDialogOpen(true); }} className="bg-stone-800 hover:bg-stone-900 text-white gap-1.5">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Product Name *</Label>
                  <Input className={inputCls} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price (₹) *</Label>
                  <Input className={inputCls} type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea className={inputCls} rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Category *", key: "category", options: ["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Pendants", "Anklets", "Sets"] },
                  { label: "Type *",     key: "type",     options: ["Solitaire", "Hoop", "Stud", "Chain", "Bangle", "Cuff", "Cocktail", "Band", "Drop", "Choker"] },
                  { label: "Material *", key: "material", options: ["Gold", "Silver", "Platinum", "Diamond", "Rose Gold", "White Gold", "Kundan", "Zircon"] },
                  { label: "Gender",     key: "gender",   options: ["Women", "Men", "Unisex"] },
                ].map(({ label, key, options }) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs">{label}</Label>
                    <Select value={formData[key]} onValueChange={(val) => setFormData({ ...formData, [key]: val })}>
                      <SelectTrigger className={`${inputCls} h-9`}>
                        <SelectValue placeholder={`Select…`} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((o) => <SelectItem key={o} value={o} className="text-sm">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Image URL *</Label>
                  <Input className={inputCls} value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Stock Quantity</Label>
                  <Input className={inputCls} type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                </div>
              </div>
              {formData.image && (
                <div className="flex items-center gap-3 p-2 border border-stone-200 rounded-lg">
                  <img src={formData.image} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-stone-200" onError={(e) => e.target.style.display = "none"} />
                  <p className="text-xs text-stone-500">Image preview</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-stone-800 hover:bg-stone-900 gap-2">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingProduct ? "Update" : "Create"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-xs text-stone-400">{filtered.length} of {products.length} products</p>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Material</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Stock</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-stone-100 rounded w-3/4" /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-stone-400">No products found</td></tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0" />
                        <div>
                          <p className="font-medium text-stone-900 text-sm">{product.name}</p>
                          <p className="text-xs text-stone-400 capitalize">{product.type} · {product.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 capitalize">{product.category}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-stone-600 capitalize">{product.material}</td>
                    <td className="px-5 py-3 font-semibold text-stone-800 text-sm">{fmt(product.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.stock > 10 ? "bg-emerald-50 text-emerald-700" : product.stock > 0 ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"}`}>
                        {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Client ─────────────────────────────────────────
export default function AdminClient() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products",  icon: Package,         label: "Products" },
    { id: "orders",    icon: ShoppingCart,     label: "Orders" },
    { id: "messages",  icon: MessageSquare,    label: "Messages" },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-stone-100 shadow-sm transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800">Admin Panel</h2>
          <p className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-wider">Store Management</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                activeTab === id
                  ? "bg-stone-800 text-white shadow-sm"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-stone-100 px-5 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 hover:bg-stone-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-stone-600" />
            </button>
            <div>
              <h1 className="text-base font-bold text-stone-800 capitalize">{activeTab}</h1>
              <p className="text-[10px] text-stone-400 hidden sm:block">Jewellery Store Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold">A</div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "products"  && <ProductsTab />}
              {activeTab === "orders"    && <OrdersTab />}
              {activeTab === "messages"  && <MessagesTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
