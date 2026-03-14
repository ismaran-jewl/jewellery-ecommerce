"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, LayoutDashboard, Package, ShoppingCart, MessageSquare, Menu, Search, X } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    material: "",
    image: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl("/api/admin/products"));
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
        setIsDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      type: product.type,
      material: product.material,
      image: product.image,
      stock: product.stock.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      type: "",
      material: "",
      image: "",
      stock: "",
    });
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Derived stats
  const totalStock = products.reduce((acc, curr) => acc + parseInt(curr.stock || 0), 0);
  const totalValue = products.reduce((acc, curr) => acc + (parseInt(curr.price || 0) * parseInt(curr.stock || 0)), 0);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
        activeTab === id 
          ? "bg-stone-800 text-white shadow-md" 
          : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 shadow-sm transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-2xl font-bold text-stone-800">Admin Panel</h2>
          <p className="text-xs text-stone-500 mt-1">Store Management</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="products" icon={Package} label="Products" />
          <SidebarItem id="orders" icon={ShoppingCart} label="Orders" />
          <SidebarItem id="messages" icon={MessageSquare} label="Messages" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-stone-600" />
            </button>
            <h1 className="text-xl font-bold text-stone-800 capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold shadow-sm">A</div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-stone-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-stone-500">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">{products.length}</div>
                    <p className="text-xs text-stone-400 mt-1">Active items in catalog</p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-stone-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-stone-500">Total Inventory Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">₹{totalValue.toLocaleString()}</div>
                    <p className="text-xs text-stone-400 mt-1">Based on current stock</p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-stone-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-stone-500">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">128</div>
                    <p className="text-xs mt-1 text-emerald-600 font-medium">+14% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-full shadow-sm border-stone-200">
                  <CardHeader>
                    <CardTitle className="text-stone-800">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-stone-100 pb-4 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                              <ShoppingCart className="w-4 h-4 text-stone-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-stone-800">New Order #ORD-00{i+1}</p>
                              <p className="text-xs text-stone-500">2 minutes ago</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-emerald-600">₹{1200 + i*500}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Products View */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9 bg-white border-stone-200 focus:ring-stone-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddDialog} className="bg-stone-800 hover:bg-stone-900 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="women">Women</SelectItem>
                              <SelectItem value="men">Men</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ring">Ring</SelectItem>
                              <SelectItem value="necklace">Necklace</SelectItem>
                              <SelectItem value="chain">Chain</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="material">Material</Label>
                          <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gold">Gold</SelectItem>
                              <SelectItem value="diamond">Diamond</SelectItem>
                              <SelectItem value="silver">Silver</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-stone-800 hover:bg-stone-900">
                          {editingProduct ? "Update" : "Create"} Product
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-stone-100/50 text-stone-700 uppercase">
                      <tr>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Stock</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-stone-500">Loading products...</td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-stone-500">No products found</td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                                />
                                <div>
                                  <div className="font-medium text-stone-900">{product.name}</div>
                                  <div className="text-xs text-stone-500 truncate max-w-[200px]">{product.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 capitalize">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium">₹{product.price.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}>
                                {product.stock} in stock
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(product)}>
                                  <Edit className="w-4 h-4 text-stone-500 hover:text-stone-800" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(product._id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeTab === "orders" && (
             <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-stone-800">Orders Management</h2>
                 <Button variant="outline" className="border-stone-200 text-stone-600 hover:bg-stone-50">Export Orders</Button>
               </div>
               <Card className="shadow-sm border-stone-200">
                 <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                   <ShoppingCart className="w-12 h-12 text-stone-300 mb-4" />
                   <h3 className="text-lg font-medium text-stone-900">No Orders Yet</h3>
                   <p className="text-stone-500 max-w-sm mt-1">
                     When you receive orders, they will appear here. You'll be able to process, track, and manage all customer orders.
                   </p>
                 </CardContent>
               </Card>
             </div>
          )}

          {/* Messages View */}
          {activeTab === "messages" && (
             <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-stone-800">Messages</h2>
               </div>
               <Card className="shadow-sm border-stone-200">
                 <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                   <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
                     <MessageSquare className="w-8 h-8 text-stone-300" />
                   </div>
                   <h3 className="text-lg font-medium text-stone-900">Inbox Empty</h3>
                   <p className="text-stone-500 max-w-sm mt-1">
                     You haven't received any new inquiries or messages from customers yet.
                   </p>
                 </CardContent>
               </Card>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
