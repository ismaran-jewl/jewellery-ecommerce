"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Loader2, RefreshCw } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";
import { getImageUrl } from "@/lib/utils";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function AdminProductsPage() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "",
    type: "", material: "", gender: "Women", image: "", stock: "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/products"));
      if (res.ok) setProducts(await res.json());
      else toast.error("Failed to fetch products");
    } catch { toast.error("Error fetching products"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url    = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(editingProduct ? "Product updated" : "Product created");
        setIsDialogOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Failed to save product");
      }
    } catch { toast.error("Network error"); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, description: p.description || "",
      price: p.price.toString(), category: p.category,
      type: p.type, material: p.material, gender: p.gender || "Women",
      image: p.image, stock: p.stock.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete permanently?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Product deleted"); fetchProducts(); }
      else toast.error("Failed to delete");
    } catch { toast.error("Network error"); }
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-stone-800">Manage Inventory</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
            <Input placeholder="Search catalog..." className="pl-9 h-10 border-stone-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingProduct(null); setFormData({ name: "", description: "", price: "", category: "", type: "", material: "", gender: "Women", image: "", stock: "" }); }} className="bg-stone-800 hover:bg-stone-900 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label>Name</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div className="space-y-1"><Label>Price (₹)</Label><Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required /></div>
                </div>
                <div className="space-y-1"><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Category", key: "category", options: ["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Sets"] },
                    { label: "Type",     key: "type",     options: ["Chain", "Stud", "Hoop", "Band", "Choker", "Cocktail"] },
                    { label: "Material", key: "material", options: ["Gold", "Silver", "Platinum", "Diamond", "Rose Gold"] },
                    { label: "Gender",   key: "gender",   options: ["Women", "Men", "Unisex"] },
                  ].map(f => (
                    <div key={f.key} className="space-y-1">
                      <Label>{f.label}</Label>
                      <Select value={formData[f.key]} onValueChange={v => setFormData({ ...formData, [f.key]: v })}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{f.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Image URL / Path</Label>
                    <Input 
                      value={formData.image} 
                      onChange={e => setFormData({ ...formData, image: e.target.value })} 
                      placeholder="e.g. https://ibb.co/... or /images/p1.jpg"
                      required 
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-stone-100 rounded-lg bg-stone-50/50 min-h-[80px]">
                    {formData.image ? (
                      <img 
                        src={getImageUrl(formData.image)} 
                        alt="Preview" 
                        className="h-16 w-16 object-cover rounded-md shadow-sm border border-white"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Invalid+URL"; }}
                      />
                    ) : (
                      <span className="text-[10px] text-stone-400 font-medium italic">Image Preview</span>
                    )}
                  </div>
                  <div className="space-y-1"><Label>Stock Units</Label><Input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} placeholder="0" /></div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting} className="bg-stone-800 hover:bg-stone-900">
                    {submitting && <Loader2 className="mr-2 animate-spin w-4 h-4" />} {editingProduct ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-[10px] uppercase text-stone-500 font-bold tracking-wider">
            <tr><th className="px-6 py-3 text-left">Product</th><th className="px-6 py-3 text-left">Category</th><th className="px-6 py-3 text-left">Price</th><th className="px-6 py-3 text-left">Stock</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? [...Array(3)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={5} className="p-6 h-12 bg-stone-50/50" /></tr>) :
              filtered.map(p => (
                <tr key={p._id} className="hover:bg-stone-50/40">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img 
                      src={getImageUrl(p.image)} 
                      className="w-10 h-10 rounded-lg object-cover border" 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
                    />
                    <span className="font-semibold text-stone-800">{p.name}</span>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium capitalize">{p.category}</span></td>
                  <td className="px-6 py-4 font-bold text-stone-800">{fmt(p.price)}</td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase ${p.stock <= 5 ? "text-red-500" : "text-emerald-600"}`}>{p.stock} in stock</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-800"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 hover:bg-red-50 rounded text-stone-300 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
