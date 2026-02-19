"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { X, LayoutDashboard, ShoppingBag, Settings, User, Heart, LogOut, BarcodeIcon } from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: BarcodeIcon, label: "QR-code", href: "/qr-code" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];


export default function Sidebar({ onClose }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col border-r bg-white px-3 py-4 shadow-sm">
      {/* Header with Logo and Mobile Close Button */}
      <div className="mb-8 flex items-center justify-between px-4">
        <span className="text-2xl font-black tracking-tighter text-[#1B4D3E]">ISMARN</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose} // Close sidebar on mobile when link is clicked
              className={cn(
                "group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                isActive 
                  ? "bg-[#FEF08A] text-[#1B4D3E] shadow-sm" // Lemon Yellow Active State
                  : "text-gray-500 hover:bg-yellow-50 hover:text-[#1B4D3E]"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12",
                  isActive ? "text-[#1B4D3E]" : "text-gray-400"
                )} 
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="mt-auto border-t border-gray-100 pt-4">
        <button 
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          )}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}