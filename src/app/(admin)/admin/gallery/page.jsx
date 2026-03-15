"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Upload, Trash2, Copy, Search, Loader2, Image as ImageIcon, 
  ExternalLink, Check, Grid, List, RefreshCw 
} from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [copiedId, setCopiedId] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cloudinary");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        toast.error("Failed to fetch images");
      }
    } catch (error) {
      toast.error("Error fetching images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/cloudinary", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Image uploaded successfully");
        fetchImages();
      } else {
        const data = await res.json();
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Network error during upload");
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = "";
    }
  };

  const handleDelete = async (publicId) => {
    if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/cloudinary?publicId=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Image deleted");
        setImages(images.filter(img => img.public_id !== publicId));
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredImages = images.filter(img => 
    img.public_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.format.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Media Gallery</h2>
          <p className="text-sm text-stone-500">Manage and upload your product images</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all
            ${uploading ? "bg-stone-100 text-stone-400 cursor-not-allowed" : "bg-stone-800 text-white hover:bg-stone-900"}
          `}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Image"}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          <Button variant="outline" size="icon" onClick={fetchImages} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <Input 
            placeholder="Search images..." 
            className="pl-9 border-stone-100 bg-stone-50/50" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-lg border border-stone-100">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-stone-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="text-stone-800 font-semibold text-lg">No images found</h3>
          <p className="text-stone-500 text-sm mb-6">Start by uploading your first image to the gallery</p>
          <label className="bg-white border border-stone-200 text-stone-800 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:bg-stone-50 transition-all shadow-sm">
            Upload Image
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </label>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
          {filteredImages.map((img) => (
            <div key={img.public_id} className="group relative bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square relative overflow-hidden bg-stone-100">
                <img 
                  src={img.secure_url} 
                  alt={img.public_id} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => copyToClipboard(img.secure_url, img.public_id)}
                    className="p-2 bg-white rounded-full text-stone-800 hover:bg-stone-100 transition-colors shadow-lg"
                    title="Copy URL"
                  >
                    {copiedId === img.public_id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a 
                    href={img.secure_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full text-stone-800 hover:bg-stone-100 transition-colors shadow-lg"
                    title="View Original"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => handleDelete(img.public_id)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-mono text-stone-400 truncate" title={img.public_id}>
                  {img.public_id.split('/').pop()}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold uppercase tracking-tight">
                    {img.format}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {img.width}x{img.height}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] uppercase text-stone-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Preview</th>
                <th className="px-6 py-3 text-left">ID / Name</th>
                <th className="px-6 py-3 text-left">Dimensions</th>
                <th className="px-6 py-3 text-left">Format</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredImages.map((img) => (
                <tr key={img.public_id} className="hover:bg-stone-50/40 group">
                  <td className="px-6 py-3">
                    <img 
                      src={img.secure_url} 
                      className="w-12 h-12 rounded-lg object-cover border border-stone-100" 
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="max-w-[200px] truncate text-stone-800 font-medium" title={img.public_id}>
                      {img.public_id.split('/').pop()}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono truncate max-w-[200px]">
                      {img.public_id}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-stone-500">
                    {img.width} x {img.height}
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold uppercase">
                      {img.format}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => copyToClipboard(img.secure_url, img.public_id)}
                        className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-800"
                      >
                        {copiedId === img.public_id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(img.public_id)}
                        className="p-1.5 hover:bg-red-50 rounded text-stone-300 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
