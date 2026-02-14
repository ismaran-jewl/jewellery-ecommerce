import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Settings, User, Heart, LogOut } from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 w-64 -translate-x-full border-r bg-white/80 backdrop-blur-md transition-transform md:translate-x-0">
      <div className="flex flex-col overflow-y-auto px-4 py-6">
        <div className="mb-8 flex items-center px-2">
          <span className="text-2xl font-bold text-gray-900">ISMARN</span>
        </div>
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t pt-4">
          <button className="flex w-full items-center rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}