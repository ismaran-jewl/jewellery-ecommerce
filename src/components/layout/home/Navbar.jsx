"use client";

import { useEffect, useState, Fragment } from "react";
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
import { Search, ShoppingBag, Heart, User, X, LayoutDashboard, LogOut, ShoppingCart, Menu, ChevronDown, ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const menuVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  closed: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
};

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  closed: { opacity: 0, y: -10 },
};

const MobileNavLink = ({ href, children, closeMenu, className = "" }) => (
  <Link
    href={href}
    onClick={closeMenu}
    className={`group flex items-center justify-between w-full p-4 text-lg font-medium text-[#1B4D3E] border-b border-[#1B4D3E]/10 hover:bg-white/50 hover:pl-6 transition-all duration-300 ${className}`}
  >
    <span className="font-serif tracking-wide">{children}</span>
    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#C59D5F]" />
  </Link>
);

const MobileNavAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#1B4D3E]/10">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full p-4 text-lg font-medium text-[#1B4D3E] hover:bg-white/50 transition-colors">
        <span className="font-serif tracking-wide">{title}</span>
        <ChevronDown className={`h-5 w-5 text-[#C59D5F] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#1B4D3E]/5"
          >
            <div className="flex flex-col">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default function Navbar({ onMenuClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-col w-full bg-[#FFDAB9]/95 backdrop-blur transition-colors duration-300">
        {/* Top Promotional Banner */}
        <div className="bg-[#D1F2EB] text-[#1B4D3E] text-sm py-2.5 text-center tracking-wide font-medium overflow-hidden">
          <motion.div
            animate={{ x: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
            <p>✨ Spring Sale is Live! Flat 20% off on Diamond Jewellery. Use Code: SPARKLE20 ✨</p>
          </motion.div>
        </div>

        <nav className="w-full border-b border-[#1B4D3E]/10">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

            {/* Left side: Hamburger and Logo */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                className={`md:hidden text-[#1B4D3E] ${isSearchOpen ? 'hidden' : ''}`}
                onClick={() => {
                  // Change 2: Call the prop here!
                  if (onMenuClick) {
                    onMenuClick();
                  } else {
                    // Fallback for pages that don't use the Sidebar
                    setIsMenuOpen(!isMenuOpen);
                  }
                }}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Logo */}
              <Link href="/" className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1B4D3E] hover:text-[#2d1a10] transition-colors ${isSearchOpen ? 'hidden sm:block' : ''}`}>
                ISMARN
              </Link>
            </div>

            {/* Search Bar or Desktop Nav */}
            {isSearchOpen ? (
              <div className="flex-1 mx-2 sm:mx-4 animate-in fade-in slide-in-from-top-2 duration-300">
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
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1B4D3E]/60" />
                  <button onClick={() => setIsSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B4D3E]/60 hover:text-[#1B4D3E]">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Desktop Nav Links */
              <div className="hidden md:flex items-center gap-1">
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
            <div className={`flex items-center gap-1 sm:gap-2 ${isSearchOpen ? 'hidden sm:flex' : ''}`}>

              {/* Search Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`${isSearchOpen ? 'hidden' : 'block'}`}>
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
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-[108px] bg-[#FFF9F6] z-40 flex flex-col overflow-y-auto pb-10"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            <div className="flex-1 p-6 space-y-1 relative z-10">
              <motion.div variants={itemVariants}>
                <MobileNavLink href="/" closeMenu={() => setIsMenuOpen(false)}>Home</MobileNavLink>
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileNavAccordion title="Shop">
                  <MobileNavLink href="/shop?sort=newest" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent">New Arrivals</MobileNavLink>
                  <MobileNavLink href="/shop?category=rings" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent">Rings</MobileNavLink>
                  <MobileNavLink href="/shop?category=necklaces" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent">Necklaces</MobileNavLink>
                  <MobileNavLink href="/shop?category=earrings" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent">Earrings</MobileNavLink>
                  <MobileNavLink href="/shop" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent font-semibold">All Jewellery</MobileNavLink>
                </MobileNavAccordion>
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileNavAccordion title="Gifts">
                  <MobileNavLink href="/shop?type=birthday" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent">Birthday Gifts</MobileNavLink>
                  <MobileNavLink href="/shop?type=anniversary" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent">Anniversary Gifts</MobileNavLink>
                  <MobileNavLink href="/voice-gift/create" closeMenu={() => setIsMenuOpen(false)} className="border-none pl-8 text-base bg-transparent">Personalized Gifts</MobileNavLink>
                </MobileNavAccordion>
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileNavLink href="/offers" closeMenu={() => setIsMenuOpen(false)}>Offers</MobileNavLink>
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileNavLink href="/contact" closeMenu={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileNavLink href="/about" closeMenu={() => setIsMenuOpen(false)}>About</MobileNavLink>
              </motion.div>
            </div>

            {/* Mobile Menu Footer */}
            <motion.div variants={itemVariants} className="p-6 border-t border-[#1B4D3E]/10 bg-[#F5E6D3]/20 relative z-10">
              <div className="flex justify-center space-x-8 mb-4">
                <a href="#" className="text-[#1B4D3E] hover:text-[#C59D5F] transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="text-[#1B4D3E] hover:text-[#C59D5F] transition-colors"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="text-[#1B4D3E] hover:text-[#C59D5F] transition-colors"><Twitter className="h-5 w-5" /></a>
              </div>
              <p className="text-center text-xs text-[#1B4D3E]/60 font-serif">© {new Date().getFullYear()} ISMARN Jewels</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}