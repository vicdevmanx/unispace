import React from 'react';
import { ArrowRight } from 'lucide-react';

const WorkspaceCta = () => {
  return (
    <div className="max-w-[84rem] mx-auto my-16 rounded-2xl bg-gradient-to-t from-[#1D3A8A] to-[#214cc3] border border-white/20 p-10 md:p-16 flex flex-col items-center text-center shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Next Workspace?</h2>
      <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl">
        Join thousands of professionals who have discovered their perfect workspace. Start your productivity journey today.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-xl">
       <button className="flex items-center justify-center gap-2 bg-white text-[#4B1CD7] font-semibold text-lg px-8 py-4 rounded-lg shadow hover:bg-[#f3f0ff] transition w-full md:w-auto">
          Start Exploring <ArrowRight size={22} />
        </button>
       
      </div>
    </div>
  );
};

export default WorkspaceCta;    