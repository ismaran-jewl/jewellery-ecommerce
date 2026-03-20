"use client";

import { toast } from "sonner";import {
  ShoppingCart, Package, IndianRupee, Users, RefreshCw
} from "lucide-react";
import useSWR from "swr";
import { apiUrl, fetcher } from "@/lib/fetcher";

import { StatCard } from "./_components/StatCard";
import { RecentTransactionsTable } from "./_components/RecentTransactionsTable";
import { CriticalStockWidget } from "./_components/CriticalStockWidget";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function DashboardPage() {
  const { data: stats, error, isLoading, mutate } = useSWR(apiUrl("/api/admin/stats"), fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  if (error) toast.error("Failed to load dashboard stats");

  return (
    <div className="max-w-[1400px] space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-sm text-stone-500 font-medium">Real-time performance metrics and business intelligence.</p>
        </div>
        <button 
          onClick={() => mutate()} 
          disabled={isLoading} 
          className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> 
          Sync Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gross Sales" 
          icon={IndianRupee} 
          value={fmt(stats?.totalRevenue)} 
          sub="Gross revenue generated" 
          trend={stats?.revenueGrowth} 
          loading={isLoading} 
        />
        <StatCard 
          title="Order Volume" 
          icon={ShoppingCart} 
          value={stats?.totalOrders ?? "0"} 
          sub={`${stats?.ordersThisMonth ?? 0} in active month`} 
          trend={stats?.orderGrowth} 
          loading={isLoading} 
        />
        <StatCard 
          title="Inventory Depth" 
          icon={Package} 
          value={stats?.totalProducts ?? "0"} 
          sub="Total Unique SKU count" 
          loading={isLoading} 
        />
        <StatCard 
          title="Customer Base" 
          icon={Users} 
          value={stats?.totalUsers ?? "0"} 
          sub="Lifetime registrations" 
          loading={isLoading} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <RecentTransactionsTable orders={stats?.recentOrders} loading={isLoading} />
        <CriticalStockWidget products={stats?.lowStockProducts} loading={isLoading} />
      </div>
    </div>
  );
}