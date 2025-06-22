import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <div className="hidden md:block w-1/2 h-screen relative">
        <img
          src="/huboutside.webp"
          alt="UniSpace workspace"
          className="w-full h-full object-cover "
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none backdrop-blur-xs"
          style={{
        background: "linear-gradient(to bottom right, #1D3A8A 0%, rgba(29,58,138,0) 100%)",
        zIndex: 1,
          }}
        />
        <div className="absolute top-6 left-6 text-[2rem] text-white font-600 z-10 flex items-center gap-6">
          <Link to="/login">
        <ArrowLeft className="w-6 h-6" />
          </Link>
          <img
          src="/unispace_white_logo.svg"
          alt="UniSpace workspace"
          className="w-36 object-cover"
        />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center flex-col px-6 sm:px-6">
        <div className="w-full max-w-sm space-y-md">
          <h1 className="text-[2rem] font-[600] leading-[1.2] text-[#1D3A8A] text-center font-600 mb-2">
            Forgot Password
          </h1>
          <p className="text-[0.875rem] font-[400] leading-[1.6] text-neutral-700 text-center ">
            Enter your registered email and we'll send you instructions to reset
            your password.
          </p>

          <form className="space-y-sm mt-6">
            <input
              type="text"
              id="textReferral"
              placeholder="Enter your email"
              className="w-full mt-0.5 px-4 py-3 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
              required
            />

            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-[#1D3A8A] text-white rounded-[0.5rem] py-3 flex transition items-center justify-center gap-2 text-[0.875rem] font-[400] leading-[1.6] hover:bg-[rgba(29,58,138,0.9)] focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] "
              >
                <Mail className="w-4 h-4" />
                Send Mail
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
