import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

export function CriticalStockWidget({ products, loading }) {
  return (
    <Card className="shadow-none border-stone-200/60 bg-white overflow-hidden">
      <CardHeader className="border-b border-stone-100/60 pb-4 bg-orange-50/30">
        <CardTitle className="text-sm font-black text-orange-900 uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" /> Stock Criticality
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5 px-6 pb-6">
        {loading ? (
          <div className="space-y-4 animate-pulse" aria-busy="true" aria-live="polite">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-stone-50 rounded-xl" />)}
          </div>
        ) : (
          products?.slice(0, 5).map(p => (
            <div key={p._id} className="flex items-center gap-4 group p-1 transition-all rounded-xl hover:bg-stone-50">
              <div className="relative">
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl border border-stone-100 object-cover" />
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                  !
                </div>
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
          ))
        )}
        {!loading && products?.length === 0 && (
          <div className="py-10 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Inventory Levels Healthy</p>
          </div>
        )}
      </CardContent>
      {!loading && products?.length > 5 && (
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/20">
          <button className="w-full text-center text-[10px] font-black text-stone-400 hover:text-stone-900 uppercase tracking-widest transition-colors">
            View All Critical Stock ({products.length})
          </button>
        </div>
      )}
    </Card>
  );
}
