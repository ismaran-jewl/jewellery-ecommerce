"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  ShoppingCart, Package, IndianRupee, Users, TrendingUp, TrendingDown,
  Clock, CheckCircle, Truck, XCircle, Loader2, RefreshCw, AlertTriangle
} from "lucide-react";
import { apiUrl } from "@/lib/fetcher";
import { motion } from "framer-motion";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function StatCard({ title, value, sub, icon: Icon, trend, loading }) {
  const positive = trend >= 0;
  return (
    <Card className="shadow-none border-stone-200/60 bg-white overflow-hidden group hover:border-stone-400 transition-colors duration-500">
      <CardContent className="pt-6 pb-5 px-6">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 transition-colors duration-500">
            <Icon className="w-5 h-5 text-stone-600 group-hover:text-white transition-colors duration-500" />
          </div>
          {trend !== undefined && !loading && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
              {positive ? "+" : "-"}{Math.abs(trend)}%
            </div>
          )}
        </div>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 w-32 bg-stone-100 rounded-lg" />
            <div className="h-4 w-24 bg-stone-50 rounded-lg" />
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{title}</p>
            <div className="text-3xl font-black text-stone-900 tracking-tighter">{value}</div>
            <p className="text-[10px] font-bold text-stone-400/80 mt-1 uppercase tracking-tight">{sub}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Processing: "bg-amber-50 text-amber-700 border-amber-100",
    Confirmed:  "bg-blue-50 text-blue-700 border-blue-100",
    Shipped:    "bg-indigo-50 text-indigo-700 border-indigo-100",
    Delivered:  "bg-emerald-50 text-emerald-700 border-emerald-100",
    Cancelled:  "bg-rose-50 text-rose-700 border-rose-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[status] || "bg-stone-50 border-stone-100"}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
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

  return (
    <div className="max-w-[1400px] space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-sm text-stone-500 font-medium">Real-time performance metrics and business intelligence.</p>
        </div>
        <button onClick={fetchStats} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all shadow-sm">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Sales" icon={IndianRupee} value={fmt(stats?.totalRevenue)} sub="Gross revenue generated" trend={stats?.revenueGrowth} loading={loading} />
        <StatCard title="Order Volume" icon={ShoppingCart} value={stats?.totalOrders ?? "0"} sub={`${stats?.ordersThisMonth ?? 0} in active month`} trend={stats?.orderGrowth} loading={loading} />
        <StatCard title="Inventory Depth" icon={Package} value={stats?.totalProducts ?? "0"} sub="Total Unique SKU count" loading={loading} />
        <StatCard title="Customer Base" icon={Users} value={stats?.totalUsers ?? "0"} sub="Lifetime registrations" loading={loading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 shadow-none border-stone-200/60 bg-white overflow-hidden">
          <CardHeader className="border-b border-stone-100/60 pb-4 bg-stone-50/30">
            <CardTitle className="text-sm font-black text-stone-900 uppercase tracking-widest">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {loading ? <div className="p-20 flex flex-col items-center justify-center text-stone-300"><Loader2 className="animate-spin w-8 h-8 mb-4" /><p className="text-[10px] font-bold uppercase">Loading Stream...</p></div> :
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF9F6] text-[9px] uppercase text-stone-400 font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-4 text-left">Client Profile</th>
                      <th className="px-8 py-4 text-left">Internal ID</th>
                      <th className="px-8 py-4 text-left">Volume</th>
                      <th className="px-8 py-4 text-left">State</th>
                      <th className="px-8 py-4 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100/60">
                    {stats?.recentOrders?.map(o => (
                      <tr key={o._id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-black text-stone-900 text-xs">{o.user?.name ?? "Guest User"}</p>
                          <p className="text-[10px] font-bold text-stone-400 lowercase">{o.user?.email || "No contact info"}</p>
                        </td>
                        <td className="px-8 py-5">
                           <code className="text-[10px] font-bold text-stone-400 bg-stone-100/50 px-2 py-1 rounded">#{o._id.slice(-8).toUpperCase()}</code>
                        </td>
                        <td className="px-8 py-5 font-black text-stone-900 text-xs">{fmt(o.totalPrice)}</td>
                        <td className="px-8 py-5"><StatusBadge status={o.status} /></td>
                        <td className="px-8 py-5 text-[10px] font-bold text-stone-400">{fmtDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </CardContent>
        </Card>

        <Card className="shadow-none border-stone-200/60 bg-white overflow-hidden">
          <CardHeader className="border-b border-stone-100/60 pb-4 bg-orange-50/30">
            <CardTitle className="text-sm font-black text-orange-900 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" /> Stock Criticality
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5 px-6 pb-6">
            {loading ? <div className="space-y-4 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-12 bg-stone-50 rounded-xl" />)}</div> :
              stats?.lowStockProducts?.slice(0, 5).map(p => (
                <div key={p._id} className="flex items-center gap-4 group p-1 transition-all rounded-xl hover:bg-stone-50">
                  <div className="relative">
                    <img src={p.image} className="w-12 h-12 rounded-xl border border-stone-100 object-cover" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">!</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-stone-900 truncate uppercase mt-0.5">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-tighter">{p.category}</span>
                       <span className="w-1 h-1 rounded-full bg-stone-200" />
                       <span className="text-[9px] font-extrabold text-red-600 uppercase tracking-tighter">Under Reorder Point</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-stone-900">{p.stock}</p>
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">Units</p>
                  </div>
                </div>
              ))}
              {!loading && stats?.lowStockProducts?.length === 0 && (
                <div className="py-10 text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Inventory Levels Healthy</p>
                </div>
              )}
          </CardContent>
          {!loading && stats?.lowStockProducts?.length > 5 && (
            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/20">
               <button className="w-full text-center text-[10px] font-black text-stone-400 hover:text-stone-900 uppercase tracking-widest transition-colors">
                  View All Critical Stock ({stats.lowStockProducts.length})
               </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}