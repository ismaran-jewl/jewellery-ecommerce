import React from 'react';

export default function OurStoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-black text-[#2D3436] mb-8 text-center">Our Story</h1>
      <div className="prose prose-lg mx-auto text-gray-600">
        <p className="lead text-xl font-medium text-gray-800 mb-6">
          ISMARN was born from a simple idea: jewellery should hold more than just aesthetic value; it should hold memories.
        </p>
        <div className="bg-gray-100 w-full h-96 rounded-2xl mb-8 flex items-center justify-center text-gray-400">
           [Brand Story Image Placeholder]
        </div>
        <p className="mb-6">
          Founded in 2024, we set out to merge traditional craftsmanship with modern technology. By integrating NFC technology into our pieces, we allow you to carry your most cherished moments with you, always.
        </p>
        <p>
          Every piece is handcrafted with sustainable materials and designed to last a lifetime, just like the memories stored within them.
        </p>
      </div>
    </div>
  );
}
