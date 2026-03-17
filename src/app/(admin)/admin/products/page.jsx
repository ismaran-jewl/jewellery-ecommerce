"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Loader2, RefreshCw, Upload, Image as ImageIcon } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";
import { getImageUrl } from "@/lib/utils";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const HOMEPAGE_SECTIONS = ["Featured", "Seasonal", "VoiceGift", "Modern Minimalist", "The Bridal Suite", "Royal Heritage", "Community"];

export default function AdminProductsPage() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab]           = useState("all");
  
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "",
    type: "", material: "", gender: "Women", image: "", stock: "", homepageSections: [],
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/admin/cloudinary", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success("Image uploaded to Cloudinary");
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Network error during upload");
    } finally {
      setImageUploading(false);
    }
  };

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
      image: p.image, stock: p.stock.toString(), homepageSections: p.homepageSections || [],
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

  const renderTable = (items) => (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-[10px] uppercase text-stone-500 font-bold tracking-wider">
          <tr><th className="px-6 py-3 text-left">Product</th><th className="px-6 py-3 text-left">Category</th><th className="px-6 py-3 text-left">Price</th><th className="px-6 py-3 text-left">Stock</th><th className="px-6 py-3 text-right">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {loading ? [...Array(3)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={5} className="p-6 h-12 bg-stone-50/50" /></tr>) :
            items.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No products found</td></tr>
            ) :
            items.map(p => (
              <tr key={p._id} className="hover:bg-stone-50/40">
                <td className="px-6 py-4 flex items-center gap-3">
                  {p.image?.endsWith('.mp4') ? (
                    <video 
                      src={getImageUrl(p.image)} 
                      className="w-10 h-10 rounded-lg object-cover border" 
                      autoPlay loop muted playsInline
                    />
                  ) : (
                    <img 
                      src={getImageUrl(p.image)} 
                      className="w-10 h-10 rounded-lg object-cover border" 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
                    />
                  )}
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
  );

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
              <Button 
                onClick={() => { 
                  setEditingProduct(null); 
                  setFormData({ name: "", description: "", price: "", category: "Rings", type: "Band", material: "Gold", gender: "Women", image: "", stock: "10", homepageSections: activeTab !== "all" && HOMEPAGE_SECTIONS.includes(activeTab) ? [activeTab] : [] }); 
                }} 
                className="bg-stone-800 hover:bg-stone-900 text-white shadow-lg shadow-stone-200"
              >
                <Plus className="w-4 h-4 mr-2" /> New Product
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
                
                <div className="space-y-1">
                  <Label>Homepage Assignment</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {HOMEPAGE_SECTIONS.map(section => (
                      <label key={section} className="flex items-center space-x-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-md cursor-pointer hover:bg-stone-100 transition-colors">
                        <input
                          type="checkbox"
                          className="rounded border-stone-300 text-stone-800 focus:ring-stone-800"
                          checked={formData.homepageSections.includes(section)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, homepageSections: [...formData.homepageSections, section] });
                            } else {
                              setFormData({ ...formData, homepageSections: formData.homepageSections.filter(s => s !== section) });
                            }
                          }}
                        />
                        <span className="text-xs font-medium text-stone-700">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="flex justify-between items-center">
                      <span>Image URL / Path</span>
                      <label className={`text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1 ${imageUploading ? "text-stone-400" : "text-stone-600 hover:text-stone-900"}`}>
                        {imageUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        {imageUploading ? "Uploading..." : "Upload to Cloudinary"}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
                      </label>
                    </Label>
                    <div className="relative">
                      <Input 
                        value={formData.image} 
                        onChange={e => setFormData({ ...formData, image: e.target.value })} 
                        placeholder="e.g. https://res.cloudinary.com/..."
                        className="pr-9"
                        required 
                      />
                      <div className="absolute right-3 top-2.5">
                        <ImageIcon className="w-4 h-4 text-stone-300" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-stone-100 rounded-lg bg-stone-50/50 min-h-[80px] group relative">
                    {formData.image ? (
                      <>
                        {formData.image.endsWith('.mp4') ? (
                          <video 
                            src={getImageUrl(formData.image)} 
                            className="h-16 w-16 object-cover rounded-md shadow-sm border border-white"
                            autoPlay loop muted playsInline
                          />
                        ) : (
                          <img 
                            src={getImageUrl(formData.image)} 
                            alt="Preview" 
                            className="h-16 w-16 object-cover rounded-md shadow-sm border border-white"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Invalid+URL"; }}
                          />
                        )}
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-stone-100 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
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

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <TabsList className="inline-flex w-auto bg-stone-100/50 p-1.5 rounded-2xl h-auto gap-1">
            <TabsTrigger value="all" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">All Inventory</TabsTrigger>
            <TabsTrigger value="Featured" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium">Featured</TabsTrigger>
            <TabsTrigger value="Seasonal" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium">Seasonal Edit</TabsTrigger>
            <TabsTrigger value="VoiceGift" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium">Gifting Page</TabsTrigger>
            <TabsTrigger value="Modern Minimalist" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium">Minimalist</TabsTrigger>
            <TabsTrigger value="Royal Heritage" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium">Heritage</TabsTrigger>
            <TabsTrigger value="The Bridal Suite" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium">Bridal Page</TabsTrigger>
            <TabsTrigger value="Community" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium">Stories</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-xl py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-medium italic">Shop Catalog</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="all" className="space-y-4 m-0">
            {renderTable(filtered)}
          </TabsContent>

          {HOMEPAGE_SECTIONS.map(section => (
            <TabsContent key={section} value={section} className="space-y-4 m-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-800">{section} Display</h3>
                  <p className="text-xs text-stone-400">Products currently assigned to appear in the {section} section of the storefront.</p>
                </div>
                <div className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full uppercase tracking-widest">
                  {filtered.filter(p => p.homepageSections?.includes(section)).length} Items
                </div>
              </div>
              {renderTable(filtered.filter(p => p.homepageSections?.includes(section)))}
            </TabsContent>
          ))}

          <TabsContent value="categories" className="space-y-12 m-0">
            {["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Sets"].map(category => {
              const categoryProducts = filtered.filter(p => p.category === category);
              if (categoryProducts.length === 0) return null;
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-1 bg-stone-800 rounded-full" />
                    <h4 className="text-sm font-bold text-stone-600 uppercase tracking-widest">{category}</h4>
                    <span className="text-[10px] text-stone-300">({categoryProducts.length})</span>
                  </div>
                  {renderTable(categoryProducts)}
                </div>
              );
            })}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

