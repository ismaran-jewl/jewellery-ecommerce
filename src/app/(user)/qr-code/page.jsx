"use client";

import { apiUrl } from "@/lib/fetcher";
import { Sparkles, QrCode, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import QRCodeContent from "./QRCodeContent";

export default function QRCodePage() {
  const [mounted, setMounted] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [selectedQr, setSelectedQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);

    async function fetchQrData() {
      try {
        const response = await fetch(apiUrl("/api/qr-code"));

        if (!response.ok) {
          throw new Error(`Failed to fetch QR codes (${response.status})`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : [data];
        setQrCodes(list.filter((item) => item?.url));
      } catch (err) {
        console.error("Failed to fetch QR data:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchQrData();
  }, []);

  if (!mounted) return null;

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
        <Sparkles className="w-12 h-12 text-[#1B4D3E] animate-pulse" />
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 bg-[#FAFAFA]">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  // ─── Detail View ────────────────────────────────────────────────────────────
  if (selectedQr) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setSelectedQr(null)}
            className="flex items-center gap-1 text-[#1B4D3E] font-medium hover:opacity-75 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to QR Codes
          </button>
        </div>

        <div className="flex-1">
          <QRCodeContent url={selectedQr.url} type={selectedQr.type} />
        </div>
      </div>
    );
  }

  // ─── List View ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-[#FAFAFA]">
      <div className="w-full max-w-md space-y-6 mt-10">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-serif text-[#1B4D3E]">Your QR Codes</h1>
          <p className="text-gray-500 text-sm">Select a QR code to view or download</p>
        </div>

        {/* QR List */}
        <div className="grid gap-4">
          {qrCodes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <QrCode className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No QR codes found</p>
            </div>
          ) : (
            qrCodes.map((qr, index) => {
              const label = qr.type
                ? `${qr.type.charAt(0).toUpperCase()}${qr.type.slice(1)} Message`
                : "View Details";

              return (
                <button
                  key={qr.url ?? index}
                  onClick={() => setSelectedQr(qr)}
                  className="group w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all duration-300 active:scale-[0.98] text-left"
                >
                  {/* Icon */}
                  <div className="h-14 w-14 shrink-0 bg-[#1B4D3E]/5 rounded-full flex items-center justify-center text-[#1B4D3E] group-hover:bg-[#1B4D3E] group-hover:text-white transition-colors duration-300">
                    <QrCode className="w-7 h-7" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">
                      {qr.name || `QR Code ${index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{label}</p>
                  </div>

                  {/* Chevron */}
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1B4D3E]/10 group-hover:text-[#1B4D3E] transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1B4D3E]" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}