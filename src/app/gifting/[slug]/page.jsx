import React from 'react';
import { Gift, Heart, Star } from 'lucide-react';

export default async function GiftingCategoryPage({ params }) {
  // Await params for Next.js 15 compatibility
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-[#FFF7F4] rounded-2xl p-12 text-center mb-12 border border-[#F8B8A6]/20">
        <Gift className="w-12 h-12 text-[#F8B8A6] mx-auto mb-4" />
        <h1 className="text-4xl font-black text-[#2D3436] mb-2 capitalize">Gifts {title}</h1>
        <p className="text-gray-600">Curated selections for that special someone.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="group cursor-pointer">
            <div className="bg-gray-50 h-80 rounded-xl mb-4 flex items-center justify-center text-gray-300 group-hover:shadow-lg transition duration-300 relative overflow-hidden">
               <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm">
                 <Heart size={18} className="text-gray-400 hover:text-red-500 transition"/>
               </div>
               <span>Gift Item {item}</span>
            </div>
            <h3 className="font-bold text-[#2D3436] text-lg">Special Gift Set {item}</h3>
            <div className="flex items-center gap-2 mt-1">
               <div className="flex text-yellow-400 text-xs">
                 {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
               </div>
               <span className="text-xs text-gray-400">(24 reviews)</span>
            </div>
            <p className="text-[#7FD1B9] font-bold mt-2">$199.00</p>
          </div>
        ))}
      </div>
    </div>
  );
}
