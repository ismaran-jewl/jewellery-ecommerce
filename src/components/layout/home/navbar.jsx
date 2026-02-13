"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Search, ShoppingBag, Heart, User, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Promotional Banner */}
      <div className="bg-[#D1F2EB] text-[#1B4D3E] text-sm py-2.5 text-center tracking-wide font-medium">
        <p>✨ Spring Sale is Live! Flat 20% off on Diamond Jewellery. Use Code: SPARKLE20 ✨</p>
      </div>

      <nav className="w-full border-b bg-[#FFDAB9]/95 sticky top-0 z-50 backdrop-blur transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={`text-3xl font-serif font-bold tracking-tight text-[#1B4D3E] hover:text-[#2d1a10] transition-colors ${isSearchOpen ? 'hidden md:block' : ''}`}>
            LuxeJewels
          </Link>

          {/* Center Navigation */}
          {isSearchOpen ? (
            <div className="flex-1 mx-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for jewellery..."
                  className="w-full bg-white/60 border-2 border-[#1B4D3E]/10 rounded-full py-2.5 pl-12 pr-10 text-[#1B4D3E] placeholder:text-[#1B4D3E]/60 focus:ring-0 focus:border-[#1B4D3E] focus:bg-white transition-all outline-none"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <Search className="absolute left-4 top-3 h-5 w-5 text-[#1B4D3E]/60" />
                <button onClick={() => setIsSearchOpen(false)} className="absolute right-3 top-2.5 text-[#1B4D3E]/60 hover:text-[#1B4D3E]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
          <div className="hidden md:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-white/20 hover:text-[#1B4D3E] focus:bg-white/20 focus:text-[#1B4D3E] text-[#1B4D3E]">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-base text-[#1B4D3E] hover:text-[#1B4D3E] hover:bg-white/20 data-[state=open]:bg-white/20 focus:bg-white/20">Shop</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 bg-white">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/shop?category=women" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#D1F2EB]/50 hover:text-[#1B4D3E] focus:bg-[#D1F2EB]/50 focus:text-[#1B4D3E]">
                            <div className="text-base font-medium leading-none text-[#1B4D3E]">Women</div>
                            <p className="line-clamp-2 text-sm leading-snug text-[#1B4D3E]/70">
                              Elegant pieces for her.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/shop?category=men" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#D1F2EB]/50 hover:text-[#1B4D3E] focus:bg-[#D1F2EB]/50 focus:text-[#1B4D3E]">
                            <div className="text-base font-medium leading-none text-[#1B4D3E]">Men</div>
                            <p className="line-clamp-2 text-sm leading-snug text-[#1B4D3E]/70">
                              Sophisticated styles for him.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/offers" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-white/20 hover:text-[#1B4D3E] focus:bg-white/20 focus:text-[#1B4D3E] text-[#1B4D3E]">
                      Offers
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-white/20 hover:text-[#1B4D3E] focus:bg-white/20 focus:text-[#1B4D3E] text-[#1B4D3E]">
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          )}

          {/* Right Actions */}
          <div className={`flex items-center gap-2 ${isSearchOpen ? 'hidden' : ''}`}>
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10">
                <Search className="h-6 w-6 text-[#1B4D3E]" />
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10">
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="h-6 w-6 text-[#1B4D3E]" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10">
              <Link href="/cart" aria-label="Cart">
                <ShoppingBag className="h-6 w-6 text-[#1B4D3E]" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10">
              <Link href="/account" aria-label="Account">
                <User className="h-6 w-6 text-[#1B4D3E]" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
