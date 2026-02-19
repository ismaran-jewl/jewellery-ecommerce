"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/user/Sidebar";
import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"; // Shadcn component
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // For accessibility

export default function ClientWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col bg-[#FFDAB9]/10">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar (Fixed Width) */}
        <aside className="hidden w-64 flex-col border-r border-[#1B4D3E]/10 bg-white md:flex">
          <div className="sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile Sidebar (Shadcn Sheet) */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            {/* Pass the function to close the menu when a link is clicked */}
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-8xl flex-1 p-4 md:p-8">
            <div className="min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}