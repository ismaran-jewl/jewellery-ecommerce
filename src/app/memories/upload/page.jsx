import React from 'react';
import { UploadCloud, Link as LinkIcon } from 'lucide-react';

export default function UploadMemoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-[#2D3436] mb-4">Upload Your Memory</h1>
        <p className="text-gray-600">Link your digital moments to your physical jewellery.</p>
      </div>

      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 border border-gray-100">
        <div className="flex justify-center gap-8 mb-8 border-b border-gray-100 pb-8">
           <div className="text-center">
              <div className="w-12 h-12 bg-[#7FD1B9]/10 rounded-full flex items-center justify-center mx-auto mb-2 text-[#7FD1B9]">1</div>
              <span className="text-xs font-bold text-gray-500">Upload</span>
           </div>
           <div className="text-center opacity-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">2</div>
              <span className="text-xs font-bold text-gray-500">Connect</span>
           </div>
           <div className="text-center opacity-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">3</div>
              <span className="text-xs font-bold text-gray-500">Sync</span>
           </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition cursor-pointer group">
            <UploadCloud className="w-16 h-16 text-gray-300 mx-auto mb-4 group-hover:text-[#7FD1B9] transition" />
            <p className="font-bold text-gray-700 text-lg">Drag & Drop photos or videos here</p>
            <p className="text-sm text-gray-400 mt-2">Supported formats: JPG, PNG, MP4 (Max 50MB)</p>
            <button className="mt-6 text-[#7FD1B9] font-bold text-sm hover:underline">Browse Files</button>
        </div>

        <div className="mt-8">
            <label className="block font-bold text-sm text-gray-700 mb-2">Or paste a link</label>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input type="text" placeholder="https://youtube.com/..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FD1B9]/50 transition" />
                </div>
                <button className="bg-gray-900 text-white px-6 rounded-xl font-bold text-sm hover:bg-gray-800">Add</button>
            </div>
        </div>
      </div>
    </div>
  );
}
