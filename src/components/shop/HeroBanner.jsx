import Link from "next/link";
import { Tag, Ruler } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { SHOP_HERO_VIDEO } from "@/config/shop";

export default function HeroBanner() {
    return (
        <div className="relative w-full rounded-3xl overflow-hidden mb-5 sm:mb-10">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
                src={SHOP_HERO_VIDEO.src}
                poster={SHOP_HERO_VIDEO.poster}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0" />
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
            {/* Gold circle decoration */}
            <div className="absolute -top-16 -right-16 w-64 sm:w-96 h-64 sm:h-96 rounded-full border border-[#c4a882]/20" />
            <div className="absolute -top-8 -right-8 w-48 sm:w-72 h-48 sm:h-72 rounded-full border border-[#c4a882]/10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#c4a882]/5" style={{ transform: "translate(-30%, 30%)" }} />

            <div className="relative z-10 flex items-center min-h-[150px] sm:min-h-[280px]">
                <div className="px-6 sm:px-14 py-8 sm:py-12 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-6 bg-[#c4a882]" />
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#c4a882] font-bold">New Arrivals · 2025</span>
                    </div>
                    <h2 className="text-2xl sm:text-5xl font-bold text-white leading-[1.1] mb-2 sm:mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Timeless Gold<br />
                        <span className="text-[#c4a882]">&amp; Diamond</span><br className="hidden sm:block" />
                        <span className="hidden sm:inline"> Jewellery</span>
                    </h2>
                    <p className="text-white/50 text-[10px] sm:text-sm mb-4 sm:mb-7 max-w-sm leading-relaxed">
                        Handcrafted with love. BIS certified. Made to be treasured across generations.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 bg-[#c4a882] text-[#1a0a00] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-[0_4px_20px_rgba(196,168,130,0.4)]">
                            <Tag className="w-3 h-3" />
                            Up to 30% OFF
                        </div>
                        <Link 
                            href="/size-guide"
                            className="flex items-center gap-2 border border-white/30 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide hover:bg-white/10 transition-colors"
                        >
                            <Ruler className="w-3 h-3 text-[#c4a882]" />
                            SIZE GUIDE
                        </Link>
                        <span className="text-white/35 text-[9px] sm:text-[10px] tracking-wider">No code · Auto-applied at checkout</span>
                    </div>
                </div>

                {/* Right side decorative */}
                <div className="hidden sm:flex flex-col items-center justify-center pr-14 gap-3 opacity-30">
                    <div className="w-24 h-24 rounded-full border-2 border-[#c4a882] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-[#c4a882] flex items-center justify-center">
                            <CategoryIcon name="rings" active={true} size={36} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
