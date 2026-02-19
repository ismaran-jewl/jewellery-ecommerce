"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  User,
  Heart,
  LogOut,
  BarcodeIcon,
  Edit,
  KeyRound,
} from "lucide-react";

const mainItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: BarcodeIcon, label: "QR Code", href: "/qr-code" },
];

const accountItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Edit, label: "Edit Profile", href: "/profile/edit" },
  { icon: KeyRound, label: "Change Password", href: "/profile/password" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ user, onClose }) {
  const pathname = usePathname();

  const renderNavItem = (item) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={cn(
          "group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
          isActive
            ? "bg-[#D1FAE5] text-[#065F46] shadow-sm"
            : "text-gray-500 hover:bg-green-50 hover:text-[#1B4D3E]"
        )}
      >
        <item.icon
          className={cn(
            "mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12",
            isActive ? "text-[#065F46]" : "text-gray-400"
          )}
        />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex h-full w-full flex-col border-r bg-white px-3 py-4 shadow-sm">
      
      {/* Brand */}
      <div className="mb-6 px-4">
        <span className="text-2xl font-black tracking-tighter text-[#1B4D3E]">
          ISMARN
        </span>
      </div>

      {/* 👤 USER PROFILE CARD */}
      <div className="mb-6 rounded-2xl bg-[#ECFDF5] p-4 shadow-sm">
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          {user?.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B4D3E] text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {/* Name + Email */}
          <div className="min-w-0">
            <p className="font-semibold text-[#1B4D3E] text-sm truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <nav className="space-y-2">
        {mainItems.map(renderNavItem)}
      </nav>

      {/* Divider */}
      <div className="my-6 border-t border-gray-100" />

      {/* ACCOUNT SECTION */}
      <nav className="space-y-2">
        {accountItems.map(renderNavItem)}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto border-t border-gray-100 pt-4">
        <button
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          )}
          onClick={() => {
            // Add your logout logic here
            console.log("Logout clicked");
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
