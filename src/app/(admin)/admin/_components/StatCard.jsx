import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ title, value, sub, icon: Icon, trend, loading }) {
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
          <div className="space-y-3 animate-pulse" aria-busy="true" aria-live="polite">
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
