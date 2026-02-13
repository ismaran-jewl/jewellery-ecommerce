import React from 'react';
import { Quote } from 'lucide-react';

export default function CustomerStoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-[#2D3436] mb-4">Community Stories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">See how our community is using ISMARN to keep their memories close.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <Quote className="text-[#F8B8A6] mb-4 w-8 h-8" />
            <p className="text-gray-600 mb-6 italic">
              "I uploaded my wedding vows to the ring I gave my wife. Now she can tap it to her phone and hear my voice whenever she wants. It's magic."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <p className="font-bold text-[#2D3436]">Alex & Sarah</p>
                <p className="text-xs text-gray-400">Married 2024</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
