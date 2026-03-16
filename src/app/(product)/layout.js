"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react"; // 1. Import Suspense
import Sidebar from "@/components/layout/product/Sidebar";
import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {
    const pathname = usePathname();

    return (
        <>
        <div className="flex flex-col bg-[#FFDAB9]/20 font-sans">
            <Navbar />

            <div className="flex flex-1 relative min-h-screen">
                <aside className="hidden lg:block w-64 flex-none border-r border-[#1B4D3E]/10 bg-white sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                    {/* 2. Wrap Sidebar in Suspense because it uses useSearchParams */}
                    <Suspense fallback={
                        <div className="p-6 space-y-8 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="h-4 bg-gray-100 rounded w-24" />
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, j) => (
                                            <div key={j} className="h-8 bg-gray-50 rounded-xl w-full" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    }>
                        <Sidebar />
                    </Suspense>
                </aside>

                <main className="flex-1">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* 3. Keep children (the Shop Page) wrapped in Suspense in the page.js itself as we did before */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
        <Footer />
        </>
    );
}