"use client";

import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-[#FFDAB9]/20">
            <Navbar />
            <div className="flex flex-1 relative">
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-8xl mx-auto min-h-full">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}