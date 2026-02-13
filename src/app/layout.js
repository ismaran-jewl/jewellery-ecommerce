import "./globals.css";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export const metadata = {
  title: "LuxeJewels",
  description: "Premium Jewellery Collection",
};

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F6] text-[#2D2D2D]">
        <nav className="w-full border-b bg-white/80 sticky top-0 z-50 backdrop-blur">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-[#2d1a10]">LuxeJewels</a>
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
          </div>
        </nav>
        <div className="min-h-[calc(100vh-56px)]">{children}</div>
      </body>
    </html>
  );
}
