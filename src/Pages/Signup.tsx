import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
        
        
        
      <div className="w-full md:w-1/2 flex items-center justify-center flex-col px-4 sm:px-6">
        <div className="w-full max-w-md space-y-md">
            <Link to="/">
           <div className='cursor-pointer flex items-center gap-2 text-[#1D3A8A] hover:text-[rgba(29,58,138,0.8)] absolute top-4 left-4 z-10'>
            <ArrowLeft />
            Back to Home
        </div>
        </Link>
          <h1 className="text-[2rem] font-[600] leading-[1.2] text-[#1D3A8A] text-left ">
            Create Your Account
          </h1>
          {/* <p className="text-[0.875rem] font-[400] leading-[1.6] text-[#214cc3] ">
            Get started by filling in your details below. It’s quick and easy!
          </p> */}

          <form className="space-y-sm mt-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label
                        htmlFor="firstName"
                        className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
                    >
                        First Name*
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder="Dawn"
                        className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
                        required
                    />
                </div>
                <div className="flex-1">
                    <label
                        htmlFor="lastName"
                        className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
                    >
                        Last Name*
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Cobham"
                        className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
                        required
                    />
                </div>
            </div>

            
            <div className='mt-4'>
              <label
                htmlFor="email"
                className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
              >
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
                required
              />
            </div>

            <div className='mt-4'>
              <label
                htmlFor="password"
                className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
              >
                Password*
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
                required
              />
            </div>

            <div className='mt-4'>
              <label
                htmlFor="password"
                className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
              >
                Referral Code(Optional)
              </label>
              <input
                type="text"
                id="textReferral"
                placeholder="UNI-123456"
                className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
                required
              />
            </div>


            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 text-[#1D3A8A] border-[#E5E7EB] rounded focus:ring-[#1D3A8A]"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-[0.875rem] text-[#111827] "
                >
                  Remember Me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-[0.875rem] text-[#1D3A8A] hover:text-[rgba(29,58,138,0.8)] "
              >
                Forgot Password?
              </a>
            </div>
            

            <div className='mt-4'>
                <button
              type="submit"
              className="w-full bg-[#1D3A8A] text-white rounded-[0.5rem] py-2 text-[0.875rem] font-[400] leading-[1.6] hover:bg-[rgba(29,58,138,0.8)] focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] "
            >
              Sign Up Now
            </button>
            </div>
          </form>

          <p className="text-[0.75rem] text-[#4B5563] mt-4 text-center mt-sm ">
            Already have an account?{' '}
            <a href="/login" className="text-[#1D3A8A] hover:text-[rgba(29,58,138,0.8)]">
              Log in here
            </a>.
          </p>

          
        </div>
      </div>

      <div className="hidden md:block w-1/2 h-screen">
        <img
          src="/hero-section-image.png"
          alt="UniSpace workspace"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;