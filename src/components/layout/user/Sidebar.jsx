"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  Heart,
  LogOut,
  BarcodeIcon,
  Shield,
} from "lucide-react";

const mainItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: BarcodeIcon, label: "QR Code", href: "/qr-code" },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

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
            ? "bg-[#D1FAE5] text-[#065F46]"
            : "text-gray-500 hover:bg-green-50 hover:text-[#1B4D3E]"
        )}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex h-full w-full flex-col border-r bg-white px-3 py-4 shadow-sm">

      <div className="mb-6 px-4">
        <span className="text-2xl font-black text-[#1B4D3E]">
          ISMARN
        </span>
      </div>

      {/* Clickable User Card */}
      <Link href="/profile" onClick={onClose}>
        <div className="mb-6 rounded-2xl bg-[#ECFDF5] p-4 shadow-sm cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B4D3E] text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="font-semibold text-sm">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <nav className="space-y-2">
        {mainItems.map(renderNavItem)}
        {user?.role === 'admin' && (
          <Link
            href=" /admin"
            onClick={onClose}
            className="group flex items-center rounded-xl px-4 py-3 text-sm font-bold text-blue-600 transition-all duration-300 hover:bg-blue-50"
          >
            <Shield className="mr-3 h-5 w-5" />
            Admin Panel
          </Link>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t">
        <button
          onClick={() => signOut()}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start text-red-600"
          )}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
