"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Gift, Music, Video, Heart } from "lucide-react";

function MessageContent() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.get("url");
    const type = searchParams.get("type");

    if (url && (type?.includes("video") || type?.includes("audio"))) {
      let embeddableUrl = url;

      if (url.includes("/view")) {
        embeddableUrl = url.replace("/view", "/preview");
      } else if (!url.includes("/preview")) {
        embeddableUrl = `${url}/preview`;
      }

      setMediaUrl(embeddableUrl);
      setMediaType(type);
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!mediaUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-serif text-[#1B4D3E] mb-2">
            Message Not Found
          </h1>
          <p className="text-gray-500 text-sm">
            We couldn't find the message you're looking for. The link might be
            invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#FEF08A]/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#1B4D3E]/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 relative z-10">
        
        {/* Header Section */}
        <div className="bg-[#1B4D3E] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20 shadow-inner">
              <Gift className="w-7 h-7 text-[#FEF08A]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-serif text-white mb-3 tracking-wide">
              A Special Gift For You
            </h1>
            <p className="text-emerald-100/90 text-sm font-light max-w-md mx-auto leading-relaxed">
              Someone special has attached a personal memory to this jewellery piece.
            </p>
          </div>
        </div>

        {/* Media Content Section */}
        <div className="p-6 md:p-10 bg-white">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 relative group">
            
            {/* Media Type Indicator */}
            <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              {mediaType === "video" ? (
                <Video className="w-3.5 h-3.5" />
              ) : (
                <Music className="w-3.5 h-3.5" />
              )}
              <span className="capitalize">{mediaType} Message</span>
            </div>

            {/* 🔥 BIGGER VIDEO ON MOBILE */}
            <div className="relative w-full bg-black h-[70vh] md:aspect-video md:h-auto">
              <iframe
                src={mediaUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; fullscreen"
                title="Personal Message"
              ></iframe>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center text-center space-y-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <p className="text-[#1B4D3E] font-medium text-sm tracking-widest uppercase">
              Ismarn Jewellery
            </p>
            <p className="text-xs text-gray-400 font-light">
              Timeless elegance, captured in memories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicMessagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FAFB]" />}>
      <MessageContent />
    </Suspense>
  );
}
