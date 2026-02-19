"use client";

import { Link as LinkIcon, Sparkles, QrCode } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo, Suspense } from "react";

function QRCodeContent() {
  const searchParams = useSearchParams();
  //implementing dynamic url and type later, for now hardcoding for testing
  const url = "https://drive.google.com/file/d/17XRHW4lUHpfk2DaIpK5LiJEUjKKsthak/view?usp=drivesdk"; //hardcoded for now, can be dynamic based on user input or database later
  const type = "video"; //hardcoded for now, can be dynamic based on user input or database later

  const qrValue = useMemo(() => {
    if (!url || !type) return "";

    const validTypes = ["video", "audio"];
    if (!validTypes.includes(type)) return "";

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "";

    return `${baseUrl}/public-message?url=${encodeURIComponent(
      url
    )}&type=${type}`;
  }, [url, type]);

  if (!qrValue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#1B4D3E]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-lg font-medium">Invalid QR Parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
        
        {/* Decorative Header */}
        <div className="bg-[#1B4D3E] p-8 pb-12 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FEF08A] rounded-full blur-3xl"></div>
            <div className="absolute top-10 -left-10 w-32 h-32 bg-[#FEF08A] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-6 h-6 text-[#FEF08A]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-white mb-2 tracking-wide">
              Your Memory
            </h1>
            <p className="text-emerald-100/90 text-sm font-light">
              Scan to view your personalized message
            </p>
          </div>
        </div>

        {/* QR Content Card - Overlapping Header */}
        <div className="px-8 pb-8 -mt-6 relative z-20">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 flex flex-col items-center">
            <div className="bg-white p-3 rounded-xl border border-[#FEF08A]/50 mb-6 shadow-sm">
              <QRCodeCanvas
                value={qrValue}
                size={220}
                level="H"
                fgColor="#1B4D3E"
                bgColor="#FFFFFF"
                className="rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-medium mb-6 bg-gray-50 px-4 py-2 rounded-full">
              <QrCode className="w-4 h-4" />
              <span>Scan with your camera</span>
            </div>

            <a 
              href={qrValue} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full group flex items-center justify-center gap-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <LinkIcon className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
              <span className="font-medium tracking-wide">Open Message</span>
            </a>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
              ISMARN JEWELLERY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QRCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]" />}>
      <QRCodeContent />
    </Suspense>
  );
}
