import { ChevronRight } from "lucide-react";

export default function MidBanner({ category, gender }) {
    const banners = {
        Rings:     { title: "Find Your Perfect Ring",     sub: "Solitaires · Stackables · Bands · Cocktail", cta: "Shop Rings",     from: "#3d1540", to: "#6b2d75" },
        Necklaces: { title: "Statement Necklaces",         sub: "Chokers · Chains · Layered · Pendants",      cta: "Shop Necklaces", from: "#0f2d52", to: "#1e5499" },
        Earrings:  { title: "Earrings for Every Occasion", sub: "Studs · Hoops · Drops · Chandbalis",         cta: "Shop Earrings",  from: "#4a2210", to: "#8c4420" },
        Bracelets: { title: "Stacked & Stunning",          sub: "Tennis · Bangles · Charm · Cuffs",           cta: "Shop Bracelets", from: "#0d3030", to: "#1a6060" },
        Men:       { title: "Bold Jewellery for Men",      sub: "Chains · Rings · Bracelets · Pendants",      cta: "Shop Men's",     from: "#111230", to: "#242860" },
        Women:     { title: "Made for Her",                sub: "Elegant pieces for every occasion",           cta: "Shop Women's",   from: "#3d0f28", to: "#7a1f52" },
        default:   { title: "Festival Season Sale",        sub: "Extra 10% off on orders above ₹5,000",       cta: "View Offers",    from: "#5c3a1a", to: "#5FBFA7" },
    };
    const b = banners[category] ?? banners[gender] ?? banners.default;
    return (
        <div
            className="relative rounded-3xl overflow-hidden p-6 sm:p-10 my-5 sm:my-10 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
        >
            {/* Decorative rings */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden sm:block">
                <div className="w-36 h-36 rounded-full border-4 border-white" />
                <div className="w-24 h-24 rounded-full border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative z-10">
                <p className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Curated Collection</p>
                <h3 className="text-lg sm:text-3xl font-bold text-white mb-1.5 sm:mb-2.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {b.title}
                </h3>
                <p className="text-white/60 text-[10px] sm:text-sm mb-4 sm:mb-5">{b.sub}</p>
                <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all backdrop-blur-sm">
                    {b.cta} <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
