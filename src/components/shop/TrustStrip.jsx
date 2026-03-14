import { Truck, Shield, RotateCcw, Star, BadgeCheck } from "lucide-react";

const TRUST_ITEMS = [
    { icon: Truck,      text: "Free Delivery above ₹2,999" },
    { icon: Shield,     text: "BIS Hallmarked" },
    { icon: RotateCcw,  text: "15-Day Returns" },
    { icon: Star,       text: "4.8★ · 10k+ Reviews" },
    { icon: BadgeCheck, text: "Certified Genuine" },
];

export default function TrustStrip() {
    return (
        <div className="mb-5 sm:mb-10 overflow-hidden">
            <div
                className="flex sm:grid sm:grid-cols-5 overflow-x-auto bg-white border border-[#ede3d8] rounded-2xl shadow-sm"
                style={{ scrollbarWidth: "none" }}
            >
                {TRUST_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className={`flex-shrink-0 flex items-center gap-2.5 px-4 sm:px-5 py-3.5 sm:py-4 ${i < TRUST_ITEMS.length - 1 ? "sm:border-r sm:border-[#f0e6dc]" : ""}`}>
                            <div className="w-8 h-8 rounded-xl bg-[#f0f9f5] flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-[#8B5E3C]" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-[#2F5F57] font-semibold leading-tight whitespace-nowrap sm:whitespace-normal">
                                {item.text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
