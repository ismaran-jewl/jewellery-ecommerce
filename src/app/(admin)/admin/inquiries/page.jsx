"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { HelpCircle, Trash2, Loader2, RefreshCw, Mail, User, Tag, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { 
  day: "2-digit", 
  month: "short", 
  year: "numeric", 
  hour: "2-digit", 
  minute: "2-digit" 
});

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        setInquiries(await res.json());
      } else {
        toast.error("Failed to load inquiries");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const deleteInquiry = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setDeleting(prev => ({ ...prev, [id]: true }));
    try {
      // Note: Assuming we handle DELETE in api/contact/route.js or similar
      // For now, let's keep it simple. If DELETE is not implemented yet, it will fail.
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted");
        setInquiries(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error("Failed to delete message");
      }
    } catch {
      toast.error("Error connecting to server");
    } finally {
      setDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
        <div>
           <h2 className="text-xl font-bold text-stone-900">Contact Inquiries</h2>
           <p className="text-xs text-stone-500">Manage customer support requests and messages</p>
        </div>
        <button 
           onClick={fetchInquiries} 
           disabled={loading}
           className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
           <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> 
           Refresh
        </button>
      </div>

      {loading ? (
        <div className="p-32 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
           <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Loading Messages...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-200 p-24 text-center">
           <HelpCircle className="w-12 h-12 text-stone-200 mx-auto mb-4" />
           <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">No inquiries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {inquiries.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item._id}
            >
              <Card className="overflow-hidden border-stone-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  {/* Left Column: Meta Data */}
                  <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-stone-100 pb-6 md:pb-0 md:pr-8 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <User className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-stone-900">{item.name}</p>
                          <p className="text-[10px] text-stone-500 uppercase font-medium">{item.status}</p>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex items-center gap-3 text-stone-500">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{item.email}</span>
                       </div>
                       <div className="flex items-center gap-3 text-stone-500">
                          <Tag className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-600">{item.subject}</span>
                       </div>
                       <div className="flex items-center gap-3 text-stone-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-bold tracking-tighter">{fmtDate(item.createdAt)}</span>
                       </div>
                    </div>
                  </div>

                  {/* Right Column: Content */}
                  <div className="flex-1 relative">
                    <div className="absolute top-0 right-0">
                       <button 
                         onClick={() => deleteInquiry(item._id)}
                         disabled={deleting[item._id]}
                         className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                       >
                         {deleting[item._id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                       </button>
                    </div>
                    <div className="pr-10">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mb-4">Message Content</h4>
                       <p className="text-stone-700 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                         {item.message}
                       </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
