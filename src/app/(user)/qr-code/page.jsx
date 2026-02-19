"use client";

import { Link as LinkIcon, Sparkles, QrCode, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo, Suspense, useState, useEffect } from "react";

const HARDCODED_URL =
  "https://drive.google.com/file/d/17XRHW4lUHpfk2DaIpK5LiJEUjKKsthak/view?usp=drivesdk";
const HARDCODED_TYPE = "video";

function QRCodeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const qrValue = useMemo(() => {
    if (!mounted) return "https://ismarn.com";
    const baseUrl = window.location.origin;
    return `${baseUrl}/public-message?url=${encodeURIComponent(HARDCODED_URL)}&type=${HARDCODED_TYPE}`;
  }, [mounted]);

  const handleDownload = () => {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;

    const padding = 48;
    const brandingHeight = 72;
    const size = canvas.width;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = size + padding * 2;
    exportCanvas.height = size + padding * 2 + brandingHeight;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    const logoImg = new Image();
    logoImg.src = "/images/logo.jpg";
    ctx.globalAlpha = 0.30; 
    ctx.drawImage(logoImg, padding, padding, size, size);
    ctx.globalAlpha = 1.0;
    ctx.drawImage(canvas, padding, padding, size, size);

    ctx.fillStyle = "#1B4D3E";
    ctx.font = "bold 60px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("ISMARN JEWELLERY", exportCanvas.width / 2, size + padding * 2 + 24);
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "20px sans-serif";
    ctx.fillText("Scan to view your memory", exportCanvas.width / 2, size + padding * 2 + 48);

    const link = document.createElement("a");
    link.download = "ismarn-qrcode.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8"
      style={{
        background: "linear-gradient(145deg, #1B4D3E 0%, #0d2b1f 60%, #0a1f17 100%)",
      }}
    >
      {/* ── CARD ── */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          maxWidth: 460,
          background: "#ffffff",
          boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >

        {/* ── CARD HEADER — dark green with logo watermark ── */}
        <div
          className="relative w-full flex flex-col items-center justify-center pt-8 pb-10 overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1B4D3E 0%, #0f2820 100%)" }}
        >
          {/* Logo watermark — 10% faded, fills header */}
          <img
            src="/images/logo.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.10, objectFit: "cover" }}
          />

          {/* Brand badge */}
          <div
            className="relative z-10 inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/20"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <Sparkles className="w-3 h-3 text-[#FEF08A]" />
            <span className="text-white/90 text-[10px] font-bold tracking-[0.22em] uppercase">
              ISMARN JEWELLERY
            </span>
          </div>

          {/* Title */}
          <h1
            className="relative z-10 text-white text-center leading-tight mb-1"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            Your Memory
          </h1>
          <p className="relative z-10 text-emerald-200/60 text-[11px] tracking-[0.22em] uppercase">
            A personalised message awaits
          </p>
        </div>

        {/* ── QR SECTION — overlaps header ── */}
        <div className="px-5 pb-5 -mt-6 relative z-10 flex flex-col items-center">

          {/* QR wrapper card */}
          <div
            className="w-full rounded-2xl overflow-hidden mb-4"
            style={{
              boxShadow: "0 8px 32px -8px rgba(27,77,62,0.25), 0 0 0 1px rgba(27,77,62,0.08)",
            }}
          >
            {/* QR + bg logo stacked */}
            <div
              className="relative w-full p-4 rounded-2xl flex items-center justify-center"
              style={{ aspectRatio: "1 / 1", background: "#fff" }}
            >
              {/* Faded logo — same size as QR */}
              <img
                src="/images/logo.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: 0.10, objectFit: "cover" }}
              />

              {/* QR Code */}
              <QRCodeCanvas
                id="qr-canvas"
                value={qrValue}
                size={800}
                level="H"
                fgColor="#1B4D3E"
                bgColor="rgba(255,255,255,0)"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  position: "relative",
                  zIndex: 2,
                }}
                imageSettings={{
                  src: "/images/logo.jpg",
                  height: 175,
                  width: 175,
                  excavate: true,
                }}
              />
            </div>
          </div>

          {/* Scan hint */}
          <div className="flex items-center gap-3 w-full mb-4">
            <div className="flex-1 h-px bg-gray-100" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              <QrCode className="w-3 h-3 text-[#1B4D3E]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Scan to open
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3">
            <a
              href={qrValue}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm tracking-wide text-white transition-all duration-200 active:scale-95"
              style={{
                background: "#1B4D3E",
                boxShadow: "0 6px 20px -4px rgba(27,77,62,0.5)",
              }}
            >
              <LinkIcon className="w-4 h-4" />
              Open Message
            </a>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 active:scale-95"
              style={{
                background: "#FEF08A",
                color: "#1B4D3E",
                boxShadow: "0 4px 16px -4px rgba(202,183,0,0.4)",
              }}
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </button>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          className="w-full py-3.5 text-center"
          style={{ background: "#f8faf8", borderTop: "1px solid #f0f0f0" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gray-300">
            CRAFTED WITH LOVE • ISMARN JEWELLERY
          </p>
        </div>
      </div>
    </div>
  );
}

export default function QRCodePage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#0d2b1f" }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-[#FEF08A] border-t-transparent animate-spin" />
        </div>
      }
    >
      <QRCodeContent />
    </Suspense>
  );
}