"use client";

import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo } from "react";

export default function QRCodePage() {
  const searchParams = useSearchParams();

  const url = searchParams.get("url");
  const type = searchParams.get("type");

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
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Invalid QR Parameters
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        Scan to View Message
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <QRCodeCanvas
          value={qrValue}
          size={250}
          level="H"
          includeMargin
        />
      </div>

      <p className="mt-6 text-sm text-gray-500 break-all text-center max-w-md">
        {qrValue}
      </p>
    </div>
  );
}
