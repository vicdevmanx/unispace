import { ChevronDown, Search } from 'lucide-react';
import React from 'react';

const Hero = () => {
  return (
    <div className="text-center py-16 px-4 relative">
      <h1 className="text-5xl font-bold text-[#1D3A8A] mb-4">Explore our workspace services<span className="text-[#214cc3]">.</span></h1>
      <p className="text-[#4B5563] text-xl mb-6">Search and get the workspace that fits your needs</p>
      <div className="flex justify-center items-center gap-2">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search for the workspace you need"
            className="w-full px-6 py-4 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]/20 text-lg"
          />
          <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
            <select
              className="px-4 py-2 rounded-lg ] text-[#1D3A8A] focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]/20 text-lg"
            >
              <option value="all">All</option>
              <option value="capacity">Capacity</option>
              <option value="services">Services</option>
              <option value="location">Location</option>
            </select>
            <button className="p-2 bg-[#214cc3] text-white rounded-lg">
              <Search className="w-5 h-5" />
            </button>
            {/* <ChevronDown className="w-5 h-5 text-[#214cc3]" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;