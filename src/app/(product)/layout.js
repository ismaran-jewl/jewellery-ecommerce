"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react"; 
import Sidebar from "@/components/layout/product/Sidebar";
import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {
    const pathname = usePathname();

    // The sidebar will be hidden by default for most pages.
    // Add paths to this array where you WANT the sidebar to be visible.
    const routesWithSidebar = [
        "/shop",
        "/category",
        // "/seasonal-edit", // Uncomment or add specific routes as needed
    ];

    // Check if the current pathname matches any of the routes in the array
    const showSidebar = routesWithSidebar.some(route => pathname.startsWith(route));

    return (
        <>
        <div className="flex flex-col h-screen overflow-hidden bg-[#FFDAB9]/20 font-sans">
            <Navbar />

            <div className="flex flex-1 relative overflow-hidden">
                {showSidebar && (
                    <aside className="hidden lg:block w-64 flex-none border-r border-[#1B4D3E]/10 bg-white overflow-y-auto custom-scrollbar">
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
                )}

                <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="max-w-8xl mx-auto flex-1 w-full">
                        {children}
                    </div>
                    {/* Footer is placed here so it scrolls with the main content */}
                    <Footer />
                </main>
            </div>
        </div>
        <Footer />
        </>
    );
}