"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Tag, Loader2, RefreshCw, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";
import { motion, AnimatePresence } from "framer-motion";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Never";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toggling, setToggling] = useState({});

  const [formData, setFormData] = useState({
    code: "", type: "percentage", value: "", minOrderValue: "0",
    usageLimit: "", perUserLimit: "1", expiresAt: "", description: ""
  });

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/promos"));
      if (res.ok) {
        const data = await res.json();
        setPromos(data.promos ?? []);
      } else toast.error("Failed to fetch promos");
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Promo code created successfully!");
        setIsDialogOpen(false);
        setFormData({ code: "", type: "percentage", value: "", minOrderValue: "0", usageLimit: "", perUserLimit: "1", expiresAt: "", description: "" });
        fetchPromos();
      } else {
        toast.error(data.error ?? "Failed to create promo");
      }
    } catch { toast.error("Network error"); }
    finally { setSubmitting(false); }
  };

  const toggleStatus = async (id, currentStatus) => {
    setToggling(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch("/api/admin/promos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentStatus }),
      });
      if (res.ok) {
        setPromos(prev => prev.map(p => p._id === id ? { ...p, active: !currentStatus } : p));
        toast.success(`Promo code ${!currentStatus ? "activated" : "deactivated"}`);
      } else toast.error("Failed to update status");
    } catch { toast.error("Error updating status"); }
    finally { setToggling(prev => ({ ...prev, [id]: false })); }
  };

  const deletePromo = async (id) => {
    if (!confirm("Delete this promo code permanently?")) return;
    try {
      const res = await fetch("/api/admin/promos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Promo code deleted");
        setPromos(prev => prev.filter(p => p._id !== id));
      } else toast.error("Failed to delete");
    } catch { toast.error("Network error"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Promotional Codes</h2>
          <p className="text-xs text-stone-400">Manage discounts and seasonal offers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchPromos} className="p-2.5 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 transition-colors">
            <RefreshCw className={`w-4 h-4 text-stone-500 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-stone-800 hover:bg-stone-900 text-white gap-2">
                <Plus className="w-4 h-4" /> New Promo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Create New Promo Code</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Promo Code (Uppercase)</Label>
                  <Input 
                    placeholder="WELCOME10" 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                      <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                        <SelectItem value="free_shipping">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Value</Label>
                    <Input 
                      type="number" 
                      value={formData.value} 
                      onChange={e => setFormData({...formData, value: e.target.value})}
                      disabled={formData.type === "free_shipping"}
                      required={formData.type !== "free_shipping"} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Min. Order Value (₹)</Label>
                    <Input type="number" value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <Label>Per Person Limit</Label>
                    <Input type="number" value={formData.perUserLimit} onChange={e => setFormData({...formData, perUserLimit: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Expiry Date (Optional)</Label>
                  <Input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input placeholder="Extra 10% off for new users" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting} className="bg-stone-800 hover:bg-stone-900 gap-2">
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Create Code
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] uppercase text-stone-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Promo Details</th>
                <th className="px-6 py-3 text-left">Value</th>
                <th className="px-6 py-3 text-left">Usage</th>
                <th className="px-6 py-3 text-left">Expiry</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? [...Array(3)].map((_, i) => <tr key={i} className="animate-pulse h-16 bg-stone-50/20"><td colSpan={6} /></tr>) :
                promos.length === 0 ? <tr><td colSpan={6} className="py-20 text-center text-stone-400"><Tag className="w-8 h-8 mx-auto mb-2 opacity-10" /> No promo codes found</td></tr> :
                promos.map(p => (
                  <tr key={p._id} className="hover:bg-stone-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center border border-stone-200">
                          <Tag className="w-4 h-4 text-stone-500" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 tracking-wider">{p.code}</p>
                          <p className="text-[10px] text-stone-400 truncate max-w-[150px]">{p.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-800">
                      {p.type === "percentage" ? `${p.value}% Off` : p.type === "fixed" ? `₹${p.value} Off` : "Free Shipping"}
                      {p.minOrderValue > 0 && <p className="text-[10px] text-stone-400 font-normal">Min. {p.minOrderValue}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-stone-600">{p.usedCount} Used</p>
                      <p className="text-[10px] text-stone-400">{p.usageLimit ? `Limit: ${p.usageLimit}` : "Unlimited"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                        <Calendar className="w-3 h-3" /> {fmtDate(p.expiresAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <button 
                        onClick={() => toggleStatus(p._id, p.active)}
                        disabled={toggling[p._id]}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          p.active ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                        }`}
                       >
                         {toggling[p._id] ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                          p.active ? <><CheckCircle2 className="w-3 h-3" /> Active</> : <><XCircle className="w-3 h-3" /> Inactive</>
                         }
                       </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => deletePromo(p._id)} className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
