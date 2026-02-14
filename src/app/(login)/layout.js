"use client";

import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#FFDAB9]/20">
            <Navbar />
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto min-h-full">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}