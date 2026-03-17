"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, Menu, X, Tag, HelpCircle, Image as ImageIcon
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "Main",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Overview", href: "/admin", sub: "Performance stats" },
        { id: "orders",    icon: ShoppingCart,    label: "Sales",    href: "/admin/orders", sub: "Process orders" },
      ]
    },
    {
      title: "Catalog",
      items: [
        { id: "products",  icon: Package,         label: "Inventory", href: "/admin/products", sub: "Manage products" },
        { id: "gallery",   icon: ImageIcon,        label: "Media",    href: "/admin/gallery", sub: "Imagery assets" },
      ]
    },
    {
      title: "Interaction",
      items: [
        { id: "messages",  icon: MessageSquare,    label: "Messages",  href: "/admin/messages", sub: "Customer chat" },
        { id: "inquiries", icon: HelpCircle,       label: "Inquiries", href: "/admin/inquiries", sub: "Support tickets" },
      ]
    },
    {
      title: "Marketing",
      items: [
        { id: "promos",    icon: Tag,             label: "Campaigns", href: "/admin/promos", sub: "Promo & codes" },
      ]
    },
    {
      title: "Storefront",
      items: [
        { id: "content",   icon: LayoutDashboard, label: "Page Content", href: "/admin/content", sub: "Manage UI text" },
      ]
    }
  ];

  const allNavItems = menuGroups.flatMap(g => g.items);

  return (
    <div className="flex min-h-screen bg-[#FBFBFB]">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200/60 shadow-sm transform transition-transform duration-300 ease-in-out h-screen overflow-y-auto ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">IG</span>
            </div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-tighter">Ismaran Admin</h2>
          </div>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-[0.2em] ml-8">v2.4 Final</p>
        </div>

        <nav className="px-4 pb-8 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{group.title}</h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-stone-900 text-white shadow-md shadow-stone-200"
                          : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-400 group-hover:text-stone-900"}`} />
                        <div>
                          <p className="text-sm font-semibold leading-none">{item.label}</p>
                          <p className={`text-[10px] mt-1 font-medium ${isActive ? "text-stone-400" : "text-stone-300"}`}>{item.sub}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-stone-100 rounded-xl transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-stone-600" />
            </button>
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                <span>Admin</span>
                <span className="text-stone-200">/</span>
                <span className="text-stone-900">{menuGroups.find(g => g.items.some(i => i.href === pathname))?.title || "System"}</span>
              </nav>
              <h1 className="text-lg font-black text-stone-900 tracking-tight leading-none">
                {allNavItems.find(i => i.href === pathname)?.label || "Dashboard"}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-stone-900">Admin Account</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">System Online</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden">
               <span className="text-xs font-black text-stone-900">AD</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
