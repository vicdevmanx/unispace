import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-stretch bg-[#F9FAFB]">
      {/* Left Side (Blue with image and gradient overlay) */}
      <div className="hidden md:flex flex-col justify-center items-center flex-1 relative overflow-hidden">
        {/* Background image */}
        <img
          src="/about-section-image.jpg"
          alt="Workspace reference"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Blue gradient overlay with transparency */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3A8A]/90 via-[#1D3A8A]/80 to-[#1D3A8A]/60 backdrop-blur-sm z-10" />
        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center items-center w-full p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Welcome to UniSpace</h1>
          <p className="text-lg mb-8 text-center max-w-md">
            Smart workspace booking platform designed for students, freelancers, and remote workers.
          </p>
          <ul className="space-y-4 text-base">
            <li className="flex items-center gap-2"><span className="text-2xl">•</span> Book workspaces instantly</li>
            <li className="flex items-center gap-2"><span className="text-2xl">•</span> Connect with community</li>
            <li className="flex items-center gap-2"><span className="text-2xl">•</span> Earn rewards for participation</li>
          </ul>
        </div>
      </div>
      {/* Right Side (White, Centered Form) */}
      <div className="flex-1 flex justify-center items-center bg-white">
        <div className="w-full shadow-md rounded-[10px]  max-w-md mx-auto p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>
          <p className="text-center text-[#6B7280] mb-8">Enter your credentials to access your account</p>
          <form className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={18} />
                <input
                  type="email"
                  className="w-full border rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B0CA8]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B0CA8]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Add asterisk to required fields */}
            <style>{`
              .required-asterisk::after {
              content: ' *';
              color: #ef4444;
              }
            `}</style>
            {/* Remember me and Forgot password links */}
          
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#3B0CA8]" />
                <span className="text-sm">Remember me</span>
              </label>
              <a href="#" className="text-[#6C2BD7] text-sm font-medium hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1D3A8A] text-white font-semibold py-3 rounded-[10px] text-lg hover:bg-[#3B0CA8] transition"
            >
              Sign In
            </button>
          </form>
         
          <p className="text-center text-sm mt-4 text-[#6B7280]">
            Don't have an account?{' '}
            <a href="#" className="text-[#6C2BD7] font-medium hover:underline">Sign up</a>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Login;