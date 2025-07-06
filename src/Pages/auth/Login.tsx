import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      toast.success('Login successful!');
      navigate('/user-home');
    } else {
      toast.error(error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#F9FAFB]">
      {/* Left Side (Image with logo and text at bottom) */}
      <div className="hidden md:flex flex-col flex-1 relative overflow-hidden">
       
       

        {/* Background image */}

        <img
          src="about-section-image.jpg"
          alt="Workspace reference"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Blue gradient overlay with transparency */}

        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3A8A]/90 via-[#1D3A8A]/80 to-[#1D3A8A]/60 backdrop-blur-sm z-10" />

        {/* Logo at the top left */}

        <div 
        className="relative z-20 flex items-start w-full pt-8 px-8 ">
          <img src="/unispace_white_logo.svg" alt="UniSpace Logo" className="h-12 w-auto
            cursor-pointer"
          
          onClick={() => navigate('/')}
          />
        </div>
        {/* Text content bottom left */}
        <div className="relative z-20 flex flex-col items-start w-full px-12 pb-8 mt-auto">
          <h1 className="text-[2.2rem] md:text-[2.2rem] font-bold mb-4 text-white">Welcome to UniSpace</h1>
          <p className="text-[1.1rem] mb-4 text-white max-w-md">
            Smart workspace booking platform designed for students, freelancers, and remote workers.
          </p>
            {/* Slideshow of features with fade transition */}
            <div className="mb-8 w-full">
              {(() => {
              const slides = [
                "Book workspaces instantly with ease ",
                "Connect with community from anywhere",
                "Earn rewards for participation",
              ];
              const [current, setCurrent] = React.useState(0);
              const [fade, setFade] = React.useState(true);

              React.useEffect(() => {
                setFade(false);
                const fadeTimeout = setTimeout(() => setFade(true), 100); // trigger fade-in
                const timer = setInterval(() => {
                setFade(false);
                setTimeout(() => {
                  setCurrent((prev) => (prev + 1) % slides.length);
                  setFade(true);
                }, 300); // match fade-out duration
                }, 4500);
                return () => {
                clearInterval(timer);
                clearTimeout(fadeTimeout);
                };
              }, []);

              return (
                <div className="flex items-center gap-2 min-h-[2.5rem]">
                <span className="text-2xl">•</span>
                <span
                  className={`text-base text-white transition-opacity duration-500 ease-in-out ${
                  fade ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {slides[current]}
                </span>
                </div>
              );
              })()}
            </div>
        </div>
      </div>
      {/* Right Side (White, Centered Form) */}
      <div className="flex-1 flex justify-center items-center bg-white">
        <div className="w-full shadow rounded-[10px]  max-w-md mx-auto p-8">
          <h2 className="text-3xl font-bold text-[#1D3A8A] text-center mb-2">Log In</h2>
          <p className="text-center text-[#6B7280] mb-8">Enter your credentials to access your account</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={18} />
                <input
                  type="email"
                  className="w-full border rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#3B0CA8]"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
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
              <Link to="/forgot-password" className="text-[#6C2BD7] text-sm font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1D3A8A] text-white font-semibold py-3 rounded-[10px] text-lg hover:opacity-80 transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
         
          <p className="text-center text-sm mt-4 text-[#6B7280]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#6C2BD7] font-medium hover:underline">Sign up</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Login;