// /home/ankit/Desktop/September/jewellery-ecommerce/src/app/(user)/qr-code/page.jsx

"use client";

import { apiUrl } from "@/lib/fetcher";
import { Sparkles, QrCode, ChevronLeft } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import QRCodeContent from "./QRCodeContent";

export default function QRCodePage() {
  const [mounted, setMounted] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [selectedQr, setSelectedQr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchQrData() {
      try {
        const response = await fetch(apiUrl("/api/qr-code"));
        if (response.ok) {
          const data = await response.json();
          // Handle both array (multiple) and object (single) responses
          const list = Array.isArray(data) ? data : [data];
          // Filter out empty/invalid entries if necessary
          setQrCodes(list.filter(item => item && item.url));
        }
      } catch (error) {
        console.error("Failed to fetch QR data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQrData();
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
        <Sparkles className="w-12 h-12 text-[#1B4D3E] animate-pulse" />
      </div>
    );
  }

  if (selectedQr) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col">
        <div className="p-4">
          <button 
            onClick={() => setSelectedQr(null)}
            className="flex items-center text-[#1B4D3E] font-medium hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to QR Codes
          </button>
        </div>
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Sparkles className="w-8 h-8 text-[#1B4D3E] animate-pulse" /></div>}>
          <QRCodeContent url={selectedQr.url} type={selectedQr.type} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-[#FAFAFA]">
      <div className="w-full max-w-md space-y-6 mt-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-[#1B4D3E]">Your QR Codes</h1>
          <p className="text-gray-500 text-sm">Select a QR code to view or download</p>
        </div>

        <div className="grid gap-4">
          {qrCodes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400">No QR codes found</p>
            </div>
          ) : (
            qrCodes.map((qr, index) => (
              <button
                key={index}
                onClick={() => setSelectedQr(qr)}
                className="group relative w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all duration-300 active:scale-[0.98] text-left"
              >
                <div className="h-14 w-14 bg-[#1B4D3E]/5 rounded-full flex items-center justify-center text-[#1B4D3E] group-hover:bg-[#1B4D3E] group-hover:text-white transition-colors duration-300">
                  <QrCode className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-lg">
                    {qr.name || `QR Code ${index + 1}`}
                  </h3>
                  <p className="text-sm text-gray-500 truncate opacity-80">
                    {qr.type ? `${qr.type.charAt(0).toUpperCase() + qr.type.slice(1)} Message` : 'View Details'}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1B4D3E]/10 group-hover:text-[#1B4D3E] transition-colors">
                   <ChevronLeft className="w-5 h-5 rotate-180" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
