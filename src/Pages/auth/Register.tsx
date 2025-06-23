import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast, Toaster } from 'sonner'; 

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    referral: '',
    rememberMe: false,
  });

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id === 'textReferral' ? 'referral' : id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSuccess(null);
  try {
    const user = await register(
      form.email,
      form.password,
      form.firstname,
      form.lastname
    );
    if (user) {
      setSuccess('Registration successful! Please log in.');
      toast.success('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 3000); 
    }
  } catch (err) {
    toast.error(err.message || 'Registration failed. Please try again.');
  }
};

  const testimonials = [
    {
      text: 'UniSpace transformed how I collaborate with my team—everything I need is right here!',
      author: 'Dawn Cobham, Student.',
    },
    {
      text: 'Finding the perfect workspace has never been easier thanks to UniSpace’s intuitive tools.',
      author: 'Athkins Kante, Software Engineer',
    },
    {
      text: 'The community features in UniSpace have boosted my productivity immensely.',
      author: 'Victor Kante, Designer',
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-right" richColors /> 
      
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

          <form className="space-y-sm mt-6" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstname"
                  className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
                >
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstname"
                  placeholder="Dawn"
                  value={form.firstname}
                  onChange={handleChange}
                  className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastname"
                  className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastname"
                  placeholder="Cobham"
                  value={form.lastname}
                  onChange={handleChange}
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
                value={form.email}
                onChange={handleChange}
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
                value={form.password}
                onChange={handleChange}
                className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
                required
              />
            </div>

            <div className='mt-4'>
              <label
                htmlFor="textReferral"
                className="block text-[0.875rem] font-[400] leading-[1.6] text-[#111827] "
              >
                Referral Code(Optional)
              </label>
              <input
                type="text"
                id="textReferral"
                placeholder="UNI-123456"
                value={form.referral}
                onChange={handleChange}
                className="w-full mt-0.5 px-4 py-2 border border-[#E5E7EB] rounded-[0.5rem] text-[0.875rem] text-[#111827] placeholder-[#4B5563] focus:border-[#1D3A8A] focus:outline-none "
              />
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
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
                disabled={loading}
                className="w-full bg-[#1D3A8A] text-white rounded-[0.5rem] py-2 text-[0.875rem] font-[400] leading-[1.6] hover:bg-[rgba(29,58,138,0.8)] focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] "
              >
                {loading ? 'Registering...' : 'Register'}
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

      <div className="hidden md:block w-1/2 h-screen relative flex flex-col">
        <img
          src="/hero-section-image.png"
          alt="UniSpace workspace"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
             
            background: 'linear-gradient(135deg, rgba(29, 58, 138, 0.25) 0%, rgba(29, 58, 138, 0.8) 100%)',
            zIndex: 1,
            opacity: 0.85,
          }}
        />
        <div className="absolute top-4 right-8 flex items-center space-x-2 z-10">
          <Link to="/">
            <img src="/unispace_white_logo.svg" alt="UniSpace Logo" className="w-auto h-8" />
          </Link>
        </div>
        <div className="absolute bottom-8 left-8 text-white z-10 testimonial-fade">
          <p className="text-2xl font-semibold leading-tight p-2">
            “{testimonials[currentTestimonial].text}”
          </p>
          <p className="text-sm font-normal mt-2">
            - {testimonials[currentTestimonial].author}
          </p>
        </div>
      </div>
      <style>
        {`
          .testimonial-fade {
            animation: fade 3s infinite;
          }
          @keyframes fade {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Register;