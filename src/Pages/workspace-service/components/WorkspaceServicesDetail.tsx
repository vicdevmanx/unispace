import { MapPin, Share } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

const WorkspaceServicesDetail = ({workspace}) => {
//   const [copied, setCopied] = useState(false);

  

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    //   setCopied(true);
    //   setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img
            src={workspace.image}
            alt={workspace.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[2rem] leading-[1.6] text-[#1D3A8A] font-[600]">{workspace.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="text-gray-600 w-4 h-4" />
                <p className="text-gray-600">{workspace.location}</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center p-2 rounded-full hover:bg-[#E5E7EB] transition"
              aria-label="Share"
            >
              <Share className="text-[#1D3A8A] w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">{'★'}</span>
            <span className="text-gray-600 ml-2">{workspace.rating} Review</span>
          </div>
          <h2 className="text-[1.5rem] font-[600] text-[#1D3A8A] p-2">Amenities</h2>
            <div className="flex flex-wrap gap-2 text-[#1D3A8A] 
">
              {workspace.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-[#E5E7EB] px-2 rounded-[0.5rem] p-1 box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);"
                >
                  {amenity}
                </span>
              ))}
            </div>
          <div className="mt-4">
            <button className='bg-[#1D3A8A] rounded-[0.5rem] text-white px-4 w-full py-2'>Book Now</button>
            
          </div>
          <div className="mt-6">
            <h2 className="text-[1.5rem] font-[600] text-[#1D3A8A]">Description</h2>
            <p className="text-[1rem] text-[#111827] leading-[1.5] mt-2">{workspace.description}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-[#1D3A8A] text-[1.5rem] font-[600] ">Pricing:</h2>
            <p className="text-gray-600 mt-2">
               NGN{workspace.price}/hr</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceServicesDetail;