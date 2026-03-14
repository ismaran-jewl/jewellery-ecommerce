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

function StatusBadge({ status }) {
  const styles = {
    Processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Confirmed:  "bg-blue-50 text-blue-700 border-blue-200",
    Shipped:    "bg-purple-50 text-purple-700 border-purple-200",
    Delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled:  "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-stone-800">Dashboard Overview</h2>
        <button onClick={fetchStats} disabled={loading} className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" icon={IndianRupee} value={fmt(stats?.totalRevenue)} sub="Total from paid orders" trend={stats?.revenueGrowth} loading={loading} />
        <StatCard title="Total Orders" icon={ShoppingCart} value={stats?.totalOrders ?? "—"} sub={`${stats?.ordersThisMonth ?? 0} this month`} trend={stats?.orderGrowth} loading={loading} />
        <StatCard title="Active Products" icon={Package} value={stats?.totalProducts ?? "—"} sub="Current catalog items" loading={loading} />
        <StatCard title="Total Customers" icon={Users} value={stats?.totalUsers ?? "—"} sub="Registered accounts" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-stone-200">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Recent Orders</CardTitle></CardHeader>
          <CardContent className="px-0 pb-0">
            {loading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div> :
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-[10px] uppercase text-stone-400">
                  <tr><th className="px-6 py-2 text-left">Customer</th><th className="px-6 py-2 text-left">Amount</th><th className="px-6 py-2 text-left">Status</th><th className="px-6 py-2 text-left">Date</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {stats?.recentOrders?.map(o => (
                    <tr key={o._id} className="hover:bg-stone-50/50">
                      <td className="px-6 py-3">
                        <p className="font-semibold text-xs text-stone-800">{o.user?.name ?? "Guest"}</p>
                        <p className="text-[10px] text-stone-400">{o.user?.email}</p>
                      </td>
                      <td className="px-6 py-3 font-bold text-xs">{fmt(o.totalPrice)}</td>
                      <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-6 py-3 text-[10px] text-stone-400">{fmtDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </CardContent>
        </Card>

        <Card className="shadow-sm border-stone-200">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-orange-800 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Low Stock Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? <div className="h-20 animate-pulse bg-stone-50" /> :
              stats?.lowStockProducts?.slice(0, 5).map(p => (
                <div key={p._id} className="flex items-center gap-2">
                  <img src={p.image} className="w-8 h-8 rounded border object-cover" />
                  <span className="text-xs text-stone-700 flex-1 truncate">{p.name}</span>
                  <span className="text-xs font-bold text-red-600">{p.stock} left</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}