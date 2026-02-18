"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
// Import Dropdown Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingBag, Heart, User, X, LayoutDashboard, LogOut, ShoppingCart, Menu } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const menuVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  closed: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  closed: { opacity: 0, y: -10 },
};

export default function Navbar({ onMenuClick }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 1. Wait for mount to prevent "radix" hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show only if mounted AND path is not Home AND path is not Login AND path is not Register
  const showHamburger =
    mounted &&
    pathname !== "/" &&
    pathname !== "/login" &&
    pathname !== "/register";


  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 flex flex-col w-full">
      {/* Top Promotional Banner */}
      <div className="bg-[#D1F2EB] text-[#1B4D3E] text-sm py-2.5 text-center tracking-wide font-medium overflow-hidden">
        <motion.div
          animate={{ x: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <p>✨ Spring Sale is Live! Flat 20% off on Diamond Jewellery. Use Code: SPARKLE20 ✨</p>
        </motion.div>
      </div>

      <nav className="w-full border-b bg-[#FFDAB9]/95 sticky top-0 z-50 backdrop-blur transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Mobile Menu Button */}
          {showHamburger && (
            <button
              className={`md:hidden mr-2 text-[#1B4D3E] ${isSearchOpen ? 'hidden' : ''}`}
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Logo */}
          <Link href="/" className={`text-3xl font-serif font-bold tracking-tight text-[#1B4D3E] hover:text-[#2d1a10] transition-colors ${isSearchOpen ? 'hidden md:block' : ''}`}>
            ISMARN
          </Link>

          {/* Search Bar Logic (Same as before) */}
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
            /* Desktop Nav Links */
            <div className="hidden md:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
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
                      <motion.div
                        className="grid w-[600px] gap-5 p-6 md:w-[700px] lg:w-[800px] lg:grid-cols-[1fr_1fr_1fr] bg-white rounded-xl shadow-xl"
                        initial="closed"
                        animate="open"
                        variants={menuVariants}
                      >
                        <motion.div variants={itemVariants} className="space-y-3">
                          <h4 className="font-serif text-lg font-medium text-[#1B4D3E] border-b border-[#1B4D3E]/10 pb-2">By Category</h4>
                          <ul className="space-y-1">
                            {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((item) => (
                              <li key={item}>
                                <NavigationMenuLink asChild>
                                  <Link href={`/shop?category=${item.toLowerCase()}`} className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">
                                    {item}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                            <li>
                              <NavigationMenuLink asChild>
                                <Link href="/shop" className="block p-2 text-sm font-semibold text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors mt-2">
                                  View All Jewellery →
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-3">
                          <h4 className="font-serif text-lg font-medium text-[#1B4D3E] border-b border-[#1B4D3E]/10 pb-2">Collections</h4>
                          <ul className="space-y-1">
                            <li><NavigationMenuLink asChild><Link href="/shop?sort=newest" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">New Arrivals</Link></NavigationMenuLink></li>
                            <li><NavigationMenuLink asChild><Link href="/shop?type=wedding" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">Wedding & Bridal</Link></NavigationMenuLink></li>
                            <li><NavigationMenuLink asChild><Link href="/shop?material=gold" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">Gold Essentials</Link></NavigationMenuLink></li>
                            <li><NavigationMenuLink asChild><Link href="/shop?material=diamond" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">Diamond Sparkle</Link></NavigationMenuLink></li>
                            <li><NavigationMenuLink asChild><Link href="/shop?material=gemstone" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">Gemstone Vibrant</Link></NavigationMenuLink></li>
                          </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col justify-end rounded-lg bg-gradient-to-b from-[#FFDAB9]/30 to-[#D1F2EB]/30 p-5 no-underline outline-none focus:shadow-md relative overflow-hidden group">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="mb-2 mt-4 text-lg font-medium text-[#1B4D3E]">
                              Best Sellers
                            </div>
                            <p className="text-sm leading-tight text-[#1B4D3E]/80 mb-4">
                              Discover the pieces everyone is talking about.
                            </p>
                            <NavigationMenuLink asChild>
                              <Link href="/shop?sort=default" className="inline-block px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#143a2f] transition-colors">
                                Shop Best Sellers
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </motion.div>
                      </motion.div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-base text-[#1B4D3E] hover:text-[#1B4D3E] hover:bg-white/20 data-[state=open]:bg-white/20 focus:bg-white/20">Gifts</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <motion.div
                        className="grid w-[550px] grid-cols-2 gap-5 p-6 bg-white rounded-xl shadow-xl"
                        initial="closed"
                        animate="open"
                        variants={menuVariants}
                      >
                        <motion.div variants={itemVariants} className="flex flex-col space-y-5">
                          <div>
                            <h4 className="font-serif text-lg font-medium text-[#1B4D3E] border-b border-[#1B4D3E]/10 pb-2">By Occasion</h4>
                            <ul className="space-y-1 mt-2">
                              <li><NavigationMenuLink asChild><Link href="/shop?type=birthday" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">Birthday Gifts</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link href="/shop?type=anniversary" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">Anniversary Gifts</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link href="/shop?type=wedding" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">Wedding Gifts</Link></NavigationMenuLink></li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-medium text-[#1B4D3E] border-b border-[#1B4D3E]/10 pb-2">For Someone</h4>
                            <ul className="space-y-1 mt-2">
                              <li><NavigationMenuLink asChild><Link href="/shop?gender=women" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">For Her</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link href="/shop?gender=men" className="block p-2 text-sm text-[#1B4D3E]/80 hover:text-[#1B4D3E] hover:bg-[#D1F2EB]/50 rounded-md transition-colors">For Him</Link></NavigationMenuLink></li>
                            </ul>
                          </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="flex flex-col justify-end rounded-lg bg-gradient-to-b from-[#FFDAB9]/30 to-[#D1F2EB]/30 p-5 no-underline outline-none focus:shadow-md relative overflow-hidden group">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611652022417-a55339f9b169?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="mb-2 mt-4 text-lg font-medium text-[#1B4D3E]">
                              Personalized Gifts
                            </div>
                            <p className="text-sm leading-tight text-[#1B4D3E]/80 mb-4">
                              Add a special touch with our voice-note engraving service.
                            </p>
                            <NavigationMenuLink asChild>
                              <Link href="/voice-gift/create" className="inline-block px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#143a2f] transition-colors">
                                Create Now
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </motion.div>
                      </motion.div>
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
                      <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-white/20 hover:text-[#1B4D3E] focus:bg-white/20 focus:text-[#1B4D3E] text-[#1B4D3E]">
                        Contact
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          {/* Right Actions */}
          <div className={`flex items-center gap-3 ${isSearchOpen ? 'hidden' : ''}`}>

            {/* Search Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10">
                <Search className="h-6 w-6 text-[#1B4D3E]" />
              </Button>
            </motion.div>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" asChild className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10 relative">
                <Link href="/wishlist">
                  <Heart className="h-6 w-6 text-[#1B4D3E]" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" asChild className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10 relative">
                <Link href="/cart">
                  <ShoppingBag className="h-6 w-6 text-[#1B4D3E]" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#1B4D3E] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </motion.div>

            {/* Profile Dropdown Logic */}
            <div className="flex items-center">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10 rounded-full">
                        <User className="h-6 w-6 text-[#1B4D3E]" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/shop" className="cursor-pointer flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Shop</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" asChild className="hover:text-[#1B4D3E] hover:bg-white/20 h-10 w-10">
                    <Link href="/login">
                      <User className="h-6 w-6 text-[#1B4D3E]" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" asChild className="text-base font-medium text-[#1B4D3E] hover:text-[#1B4D3E] hover:bg-white/20 px-4 hidden lg:flex">
                <Link href="/about">About</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>
    </div>
  );
}