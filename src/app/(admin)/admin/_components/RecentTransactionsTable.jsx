import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function RecentTransactionsTable({ orders, loading }) {
  return (
    <Card className="xl:col-span-2 shadow-none border-stone-200/60 bg-white overflow-hidden">
      <CardHeader className="border-b border-stone-100/60 pb-4 bg-stone-50/30">
        <CardTitle className="text-sm font-black text-stone-900 uppercase tracking-widest">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-stone-300">
            <Loader2 className="animate-spin w-8 h-8 mb-4" />
            <p className="text-[10px] font-bold uppercase" aria-live="polite">Loading Stream...</p>
          </div>
        ) : (
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
                {orders?.map(o => (
                  <tr key={o._id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-black text-stone-900 text-xs">{o.user?.name ?? "Guest User"}</p>
                      <p className="text-[10px] font-bold text-stone-400 lowercase">{o.user?.email || "No contact info"}</p>
                    </td>
                    <td className="px-8 py-5">
                      <code className="text-[10px] font-bold text-stone-400 bg-stone-100/50 px-2 py-1 rounded">
                        #{o._id.slice(-8).toUpperCase()}
                      </code>
                    </td>
                    <td className="px-8 py-5 font-black text-stone-900 text-xs">{fmt(o.totalPrice)}</td>
                    <td className="px-8 py-5"><StatusBadge status={o.status} /></td>
                    <td className="px-8 py-5 text-[10px] font-bold text-stone-400">{fmtDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
