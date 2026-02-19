// src/app/(user)/qr-code/QRCodeContent.jsx
"use client";

import { Link as LinkIcon, Sparkles, QrCode, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo, Suspense, useState, useEffect } from "react";

export default function QRCodeContent({ url, type }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const qrValue = useMemo(() => {
    if (!mounted) return "https://ismarn.com";
    const baseUrl = window.location.origin;
    return `${baseUrl}/public-message?url=${encodeURIComponent(url)}&type=${type}`;
  }, [mounted, url, type]);

  const handleDownload = () => {
    const qrCanvas = document.getElementById("qr-canvas");
    if (!qrCanvas) return;

    const scale = 4; 
    const imgW = 460 * scale;
    const imgH = 680 * scale;
    const centerX = imgW / 2;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = imgW;
    exportCanvas.height = imgH;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // 1. Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, imgW, imgH);

    // 2. Green Header
    const headerH = 240 * scale;
    ctx.fillStyle = "#1B4D3E";
    ctx.fillRect(0, 0, imgW, headerH);

    const logoImg = new Image();
    logoImg.src = "/images/logo.jpg";
    logoImg.onload = () => {
      // 3. FIX: Draw Logo Watermark in Header with 1:1 Ratio (No Stretching)
      const logoSize = headerH * 0.8; // Make logo 80% of header height
      const logoX = (imgW - logoSize) / 2;
      const logoY = (headerH - logoSize) / 2;
      
      ctx.globalAlpha = 0.10;
      // Drawing it square (logoSize for both width and height)
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      ctx.globalAlpha = 1.0;

      // 4. Header Labels (Centered)
      ctx.fillStyle = "#FEF08A";
      ctx.font = `bold ${10 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("ISMARN JEWELLERY", centerX, 50 * scale);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${42 * scale}px Georgia, serif`;
      ctx.fillText("Your Memory", centerX, 110 * scale);

      ctx.fillStyle = "rgba(167, 243, 208, 0.6)";
      ctx.font = `${11 * scale}px sans-serif`;
      ctx.fillText("A PERSONALISED MESSAGE AWAITS", centerX, 145 * scale);

      // 5. White QR Card
      const cardW = 380 * scale;
      const cardH = 380 * scale;
      const cardX = (imgW - cardW) / 2;
      const cardY = 185 * scale;

      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 40 * scale;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, [25 * scale]);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 6. QR Code
      const qrSize = 320 * scale;
      const qrX = (imgW - qrSize) / 2;
      const qrY = cardY + (cardH - qrSize) / 2;
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // 7. Footer
      ctx.fillStyle = "#D1D5DB";
      ctx.font = `bold ${9 * scale}px sans-serif`;
      ctx.fillText("CRAFTED WITH LOVE • ISMARN JEWELLERY", centerX, imgH - (40 * scale));

      const link = document.createElement("a");
      link.download = "ismarn-memory-final.png";
      link.href = exportCanvas.toDataURL("image/png", 1.0);
      link.click();
    };
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-[420px] w-full shadow-2xl">
        {/* UI Display */}
        <div className="bg-[#1B4D3E] pt-10 pb-20 text-center relative flex flex-col items-center">
           <img src="/images/logo.jpg" className="absolute opacity-10 h-full w-auto aspect-square object-contain" alt="" />
           <div className="relative z-10 text-[#D4AF37] text-[10px] tracking-widest font-bold mb-2">ISMARN JEWELLERY</div>
           <h1 className="relative z-10 text-white text-4xl font-serif">Your Memory</h1>
        </div>

        <div className="px-8 pb-10 -mt-12 relative z-10 w-full flex flex-col items-center">
          <div className="bg-white p-6 rounded-[2rem] shadow-2xl w-full aspect-square border border-gray-50">
            <QRCodeCanvas
              id="qr-canvas"
              value={qrValue}
              size={1024}
              level="H"
              fgColor="#1B4D3E"
              imageSettings={{ src: "/images/logo.jpg", height: 200, width: 200, excavate: true }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          {/* Buttons */}
          <div className="w-full flex flex-col gap-3 p-2">
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
      </div>
    </div>
  );
}