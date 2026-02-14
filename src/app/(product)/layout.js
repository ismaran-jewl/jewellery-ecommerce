"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react"; // 1. Import Suspense
import Sidebar from "@/components/layout/product/Sidebar";
import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#FFDAB9]/20">

            <Navbar />

            <div className="flex flex-1 overflow-hidden relative">
                <aside className="hidden md:block w-64 flex-none border-r border-[#1B4D3E]/10 overflow-y-auto bg-white">
                    {/* 2. Wrap Sidebar in Suspense because it uses useSearchParams */}
                    <Suspense fallback={<div className="p-4 text-sm">Loading Filters...</div>}>
                        <Sidebar />
                    </Suspense>
                </aside>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto min-h-full">
                        {/* 3. Keep children (the Shop Page) wrapped in Suspense in the page.js itself as we did before */}
                        {children}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}