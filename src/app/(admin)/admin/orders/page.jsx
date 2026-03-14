"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Loader2, RefreshCw, ShoppingBag, MapPin, Package } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const ORDER_STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState([]);
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
      } else toast.error("Failed to load orders");
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(u => ({ ...u, [orderId]: true }));
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order ${newStatus}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else toast.error("Failed to update");
    } catch { toast.error("Error updating"); }
    finally { setUpdating(u => ({ ...u, [orderId]: false })); }
  };

  const filtered = orders.filter(o => 
    !search || 
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o._id.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-stone-800">Order Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
             <input className="w-full pl-9 pr-3 h-10 border border-stone-200 rounded-lg text-sm bg-white" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={fetchOrders} className="p-2.5 border border-stone-200 rounded-lg bg-white hover:bg-stone-50"><RefreshCw className={`w-4 h-4 text-stone-500 ${loading ? "animate-spin" : ""}`} /></button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", ...ORDER_STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${statusFilter === s ? "bg-stone-800 text-white border-stone-800" : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"}`}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-[10px] uppercase text-stone-500 font-bold">
            <tr><th className="px-6 py-3 text-left">Order Detail</th><th className="px-6 py-3 text-left">Amount</th><th className="px-6 py-3 text-left">Payment</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? [...Array(4)].map((_, i) => <tr key={i} className="animate-pulse h-16 bg-stone-50/20"><td colSpan={5} /></tr>) :
              filtered.length === 0 ? <tr><td colSpan={5} className="py-20 text-center text-stone-400"><ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-20" /> No orders found</td></tr> :
              filtered.map(o => (
                <Fragment key={o._id}>
                  <tr className="hover:bg-stone-50/40 cursor-pointer transition-colors" onClick={() => setExpandedId(expandedId === o._id ? null : o._id)}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-stone-800 text-xs">#{o._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-stone-400 font-medium">{o.user?.name || "Guest User"}</p>
                      <p className="text-[10px] text-stone-300">{fmtDate(o.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-800">{fmt(o.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${o.isPaid ? "text-emerald-600" : "text-orange-500"}`}>{o.isPaid ? "Paid" : "Unpaid"}</span>
                      <p className="text-[9px] text-stone-400">{o.paymentMethod || "COD"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${o.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-stone-50 text-stone-500 border-stone-100"}`}>{o.status}</div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                       <Select value={o.status} onValueChange={v => updateStatus(o._id, v)}>
                         <SelectTrigger className="h-8 w-28 text-[10px] border-stone-100"><SelectValue /></SelectTrigger>
                         <SelectContent>{ORDER_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                       </Select>
                    </td>
                  </tr>
                  {expandedId === o._id && (
                    <tr className="bg-stone-50 border-t border-stone-100">
                      <td colSpan={5} className="px-10 py-4">
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Package className="w-3 h-3" /> Ship Items</p>
                            <div className="space-y-3">
                              {o.orderItems?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <img src={item.image} className="w-8 h-8 rounded border object-cover" />
                                  <div className="flex-1 text-[11px]">
                                    <p className="font-bold text-stone-700">{item.name}</p>
                                    <p className="text-stone-400">Qty: {item.quantity} · {fmt(item.price)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Shipping To</p>
                             <div className="bg-white p-3 rounded-lg border border-stone-100 text-[11px] text-stone-600 space-y-1">
                                <p className="font-bold text-stone-800">{o.user?.name}</p>
                                <p>{o.shippingAddress?.address}</p>
                                <p>{o.shippingAddress?.city}, {o.shippingAddress?.postalCode}</p>
                                <p className="text-stone-400 text-[9px] pt-1">Phone: {o.shippingAddress?.phone || "N/A"}</p>
                             </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
