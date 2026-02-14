"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/user/Sidebar";
import Navbar from "@/components/layout/home/Navbar"; // Assuming path
import Footer from "@/components/layout/home/Footer"; // Assuming path

export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  return (
    // 1. Main wrapper: fills screen, prevents outside scroll
    <div className="flex flex-col h-screen overflow-hidden bg-[#FFDAB9]/20">
      
      {/* 2. Fixed Top Navbar */}
      <header className="flex-none z-50">
        <Navbar />
      </header>

      {/* 3. Middle Section: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar: Fixed width, internal scroll if needed */}
        <aside className="hidden md:block w-64 flex-none border-r border-[#1B4D3E]/10 overflow-y-auto bg-white">
          <Sidebar />
        </aside>

        {/* Main Content: Fills remaining space, scrolls internally */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* 4. Fixed Bottom Footer */}
      <footer className="flex-none z-50">
        <Footer />
      </footer>
      
    </div>
  );
}