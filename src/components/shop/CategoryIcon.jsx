export default function CategoryIcon({ name, active, size = 28 }) {
    const c = active ? "#fff" : "#8B5E3C";
    const s = size;
    const n = name?.toLowerCase() || "";

    // ── Ring ──
    if (n.includes("ring")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="17" r="9" stroke={c} strokeWidth="2.5"/>
            <path d="M11 8.5 Q16 4 21 8.5" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <circle cx="16" cy="5.5" r="2.5" fill={c}/>
            <circle cx="16" cy="5.5" r="1" fill={active ? "#8B5E3C" : "#fff"}/>
        </svg>
    );

    // ── Necklace ──
    if (n.includes("necklace")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <path d="M5 7 Q7 5 10 6 Q16 8 22 6 Q25 5 27 7" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M10 6 Q12 18 16 22" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M22 6 Q20 18 16 22" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M13 22 L16 28 L19 22 Z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            <circle cx="16" cy="22" r="1.2" fill={c}/>
        </svg>
    );

    // ── Earring ──
    if (n.includes("earring")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="11" cy="7" r="2.5" stroke={c} strokeWidth="2"/>
            <path d="M11 9.5 L11 18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 18 L11 25 L14 18 Z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            <circle cx="21" cy="7" r="2.5" stroke={c} strokeWidth="2"/>
            <path d="M21 9.5 L21 18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
            <ellipse cx="21" cy="23" rx="3" ry="4" stroke={c} strokeWidth="1.8" fill="none"/>
        </svg>
    );

    // ── Bracelet / Bangle ──
    if (n.includes("bracelet") || n.includes("bangle")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="10" stroke={c} strokeWidth="2.5" strokeDasharray="4 2"/>
            <circle cx="16" cy="6" r="2.5" fill={c}/>
            <circle cx="26" cy="16" r="1.5" fill={c}/>
            <circle cx="6" cy="16" r="1.5" fill={c}/>
        </svg>
    );

    // ── Pendant ──
    if (n.includes("pendant")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <path d="M13 5 Q16 3 19 5" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
            <line x1="16" y1="5" x2="16" y2="11" stroke={c} strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 11 L10 20 L16 26 L22 20 Z" stroke={c} strokeWidth="2" strokeLinejoin="round" fill="none"/>
            <circle cx="16" cy="18" r="2" fill={c}/>
        </svg>
    );

    // ── Anniversary ──
    if (n.includes("anniversar")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <path d="M16 26 C16 26 5 19 5 12 A6 6 0 0 1 16 9 A6 6 0 0 1 27 12 C27 19 16 26 16 26Z" stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round"/>
            <circle cx="21" cy="8" r="3" stroke={c} strokeWidth="1.5" fill="none"/>
            <line x1="21" y1="5" x2="21" y2="4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );

    // ── Birthday ──
    if (n.includes("birthday")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <rect x="6" y="16" width="20" height="12" rx="2" stroke={c} strokeWidth="2" fill="none"/>
            <path d="M6 20 Q16 24 26 20" stroke={c} strokeWidth="1.5" fill="none"/>
            <line x1="11" y1="16" x2="11" y2="11" stroke={c} strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="16" x2="16" y2="10" stroke={c} strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="16" x2="21" y2="11" stroke={c} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="11" cy="10" r="1.5" fill={c}/>
            <circle cx="16" cy="9" r="1.5" fill={c}/>
            <circle cx="21" cy="10" r="1.5" fill={c}/>
        </svg>
    );

    // ── Wedding / Bridal ──
    if (n.includes("wedding") || n.includes("bridal")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="11" cy="16" r="6" stroke={c} strokeWidth="2" fill="none"/>
            <circle cx="21" cy="16" r="6" stroke={c} strokeWidth="2" fill="none"/>
            <path d="M14 12 Q16 9 18 12" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
    );

    // ── Custom / Personalised ──
    if (n.includes("custom") || n.includes("personal")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <path d="M8 24 L14 10 L16 14 L20 6 L24 24" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="16" cy="16" r="2.5" fill={c}/>
            <path d="M5 28 Q16 22 27 28" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
    );

    // ── Gift ──
    if (n.includes("gift")) return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <rect x="5" y="14" width="22" height="14" rx="2" stroke={c} strokeWidth="2" fill="none"/>
            <rect x="5" y="10" width="22" height="5" rx="1.5" stroke={c} strokeWidth="2" fill="none"/>
            <path d="M16 10 C16 10 12 6 14 4 C16 2 18 6 16 10Z" stroke={c} strokeWidth="1.5" fill="none"/>
            <path d="M16 10 C16 10 20 6 18 4 C16 2 14 6 16 10Z" stroke={c} strokeWidth="1.5" fill="none"/>
            <line x1="16" y1="10" x2="16" y2="28" stroke={c} strokeWidth="1.5"/>
        </svg>
    );

    // ── DEFAULT fallback — generic gem ──
    return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <path d="M8 13 L16 6 L24 13 L20 26 L12 26 Z" stroke={c} strokeWidth="2" strokeLinejoin="round" fill="none"/>
            <path d="M8 13 L16 18 L24 13" stroke={c} strokeWidth="1.5" fill="none"/>
            <line x1="16" y1="6" x2="16" y2="18" stroke={c} strokeWidth="1.2" strokeDasharray="2 1.5"/>
        </svg>
    );
}
