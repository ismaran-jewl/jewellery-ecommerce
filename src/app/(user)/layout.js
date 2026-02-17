"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/user/Sidebar";
import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFDAB9]/20">
      <header className="sticky top-0 z-50">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>

      <div className="flex flex-1 relative">
        <aside className="hidden md:block w-[15%] border-r border-[#1B4D3E]/10 sticky top-0 h-screen z-40">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
              <Sidebar />
            </aside>
          </div>
        )}

        <main className="flex-1 w-full md:w-[80%] flex flex-col">
          <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
