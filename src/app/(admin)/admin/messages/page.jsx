"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageSquare, Trash2, Loader2, RefreshCw, Volume2, Video } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";
import { motion } from "framer-motion";

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState({});

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/message"));
      if (res.ok) setMessages(await res.json());
      else toast.error("Failed to load messages");
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const deleteMessage = async (id) => {
    if (!confirm("Delete permanently?")) return;
    setDeleting(d => ({ ...d, [id]: true }));
    try {
      const res = await fetch(`/api/admin/message?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted");
        setMessages(m => m.filter(msg => msg._id !== id));
      } else toast.error("Failed to delete");
    } catch { toast.error("Error"); }
    finally { setDeleting(d => ({ ...d, [id]: false })); }
  };

  const renderMedia = (msg) => {
    if (!msg.contentBase64 || !msg.contentType) return null;
    const src = `data:${msg.contentType};base64,${msg.contentBase64}`;
    if (msg.contentType.startsWith("audio")) return <audio controls src={src} className="w-full h-8 mt-2" />;
    if (msg.contentType.startsWith("video")) return <video controls src={src} className="w-full rounded-lg mt-2 max-h-48" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-stone-800">Gift Messages</h2>
        <button onClick={fetchMessages} className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800">
           <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-stone-300" /></div> :
        messages.length === 0 ? 
        <div className="flex flex-col items-center justify-center py-24 text-stone-300">
          <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm font-medium">No messages found</p>
        </div> :
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {messages.map(msg => (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg._id}>
                <Card className="shadow-sm border-stone-200 p-4 space-y-3 bg-white">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.contentType?.includes("video") ? "bg-purple-500" : "bg-blue-500"}`}>
                            {msg.contentType?.includes("video") ? <Video className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                         </div>
                         <div>
                            <p className="text-xs font-bold text-stone-800">{msg.sender?.name || "Anonymous"}</p>
                            <p className="text-[10px] text-stone-400">{msg.sender?.email}</p>
                         </div>
                      </div>
                      <button onClick={() => deleteMessage(msg._id)} disabled={deleting[msg._id]} className="text-stone-300 hover:text-red-500 disabled:opacity-30 transition-colors">
                         {deleting[msg._id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                   </div>
                   <div className="border-t border-stone-50 pt-1">
                      {renderMedia(msg)}
                   </div>
                   <div className="text-[9px] text-stone-300 font-medium pt-1 uppercase tracking-tighter">Received {fmtDate(msg.createdAt)}</div>
                </Card>
             </motion.div>
          ))}
        </div>
      }
    </div>
  );
}
