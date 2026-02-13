// src/app/nfc-jewellery/page.jsx
import React from 'react';
import { Sparkles, Smartphone } from 'lucide-react';

export default function NFCJewelleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-[#2D3436] text-white rounded-3xl p-12 md:p-24 text-center relative overflow-hidden mb-12">
        <div className="relative z-10 flex flex-col items-center">
          <Sparkles className="w-16 h-16 text-[#7FD1B9] mb-6 animate-pulse" />
          <h1 className="text-5xl font-black mb-6 tracking-tight">Connected Jewellery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            More than just an accessory. Tap your phone to your jewellery to unlock memories, voice notes, and personalized messages.
          </p>
          <button className="bg-[#7FD1B9] text-[#2D3436] px-8 py-3 rounded-full font-bold hover:bg-white transition">
            Shop the Tech Collection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 border border-gray-100 rounded-xl">
            <Smartphone className="w-10 h-10 mx-auto mb-4 text-[#2D3436]"/>
            <h3 className="font-bold text-lg mb-2">Tap to Connect</h3>
            <p className="text-gray-500 text-sm">Simply tap your NFC-enabled smartphone to the gemstone.</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Upload Memories</h3>
            <p className="text-gray-500 text-sm">Store photos, videos, or links inside your ring or pendant.</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Forever Yours</h3>
            <p className="text-gray-500 text-sm">A digital time capsule that lasts as long as the diamond.</p>
        </div>
      </div>
    </div>
  );
}
