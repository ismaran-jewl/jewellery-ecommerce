import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account", label: "Account" },
  { href: "/offers", label: "Offers" },
  { href: "/gift-cards", label: "Gift Cards" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white/80 sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight text-[#2d1a10]">LuxeJewels</a>
        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink href={link.href} className="px-3 py-1.5">
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button variant="ghost" size="icon" asChild>
            <a href="/search" aria-label="Search">
              <Search className="h-5 w-5 text-[#2d1a10]" />
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
