"use client";

import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-[#fffaf6]">
            <Navbar />
            <main className="flex-1 w-full">
                <div className="max-w-8xl mx-auto min-h-full">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}