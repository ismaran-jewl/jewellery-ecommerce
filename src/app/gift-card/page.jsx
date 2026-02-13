import React from 'react';
import { CreditCard } from 'lucide-react';

export default function GiftCardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2">
          <div className="aspect-[1.586/1] bg-gradient-to-br from-[#2D3436] to-black rounded-2xl shadow-2xl p-8 flex flex-col justify-between text-white relative overflow-hidden transform hover:scale-105 transition duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7FD1B9] rounded-full blur-[80px] opacity-20"></div>
            <div className="flex justify-between items-start z-10">
               <div className="text-2xl font-black tracking-tighter">ISMARN<span className="text-[#7FD1B9]">.</span></div>
               <CreditCard className="opacity-50"/>
            </div>
            <div className="z-10">
              <p className="text-xs uppercase tracking-widest opacity-70 mb-2">E-Gift Card</p>
              <p className="text-4xl font-bold text-[#7FD1B9]">$100 - $1000</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-5xl font-black text-[#2D3436]">The Gift of Choice</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Not sure what they'll like? Give them the freedom to choose their own perfect piece with an ISMARN E-Gift Card. Delivered instantly via email.
          </p>
          
          <div className="space-y-4 pt-4">
            <label className="block font-bold text-sm uppercase tracking-wide text-gray-500">Select Amount</label>
            <div className="flex gap-4 flex-wrap">
              {['$100', '$250', '$500', '$1000'].map((amount) => (
                <button key={amount} className="px-6 py-3 border-2 border-gray-200 rounded-lg font-bold hover:border-[#2D3436] hover:bg-[#2D3436] hover:text-white transition">
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#7FD1B9] text-white font-bold py-4 rounded-xl mt-8 hover:bg-[#6BC0A8] transition shadow-lg shadow-[#7FD1B9]/30">
            Purchase Gift Card
          </button>
        </div>
      </div>
    </div>
  );
}
