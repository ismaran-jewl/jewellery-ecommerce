"use client";

import Sidebar from "@/components/layout/user/Sidebar";
import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";

export default function ClientWrapper({ children }) {

  return (
    <div className="flex flex-col min-h-screen bg-[#FFDAB9]/20">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="flex flex-1 relative">
        <aside className="hidden md:block w-[15%] border-r border-[#1B4D3E]/10 sticky top-0 h-screen z-40">
          <Sidebar />
        </aside>

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
