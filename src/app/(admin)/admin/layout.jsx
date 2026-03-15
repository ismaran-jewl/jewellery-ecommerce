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

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { id: "products",  icon: Package,         label: "Products",  href: "/admin/products" },
    { id: "orders",    icon: ShoppingCart,     label: "Orders",    href: "/admin/orders" },
    { id: "promos",    icon: Tag,             label: "Promos",    href: "/admin/promos" },
    { id: "messages",  icon: MessageSquare,    label: "Messages",  href: "/admin/messages" },
    { id: "inquiries", icon: HelpCircle,       label: "Inquiries", href: "/admin/inquiries" },
    { id: "gallery",   icon: ImageIcon,        label: "Gallery",   href: "/admin/gallery" },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-stone-100 shadow-sm transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800">Admin Panel</h2>
          <p className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-wider">Store Management</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map(({ id, icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={id}
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? "bg-stone-800 text-white shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-stone-100 px-5 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 hover:bg-stone-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-stone-600" />
            </button>
            <div>
              <h1 className="text-base font-bold text-stone-800">
                {navItems.find(i => i.href === pathname)?.label || "Admin"}
              </h1>
              <p className="text-[10px] text-stone-400 hidden sm:block">Jewellery Store Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold">A</div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-5 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
