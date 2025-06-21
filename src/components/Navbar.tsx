import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['About', 'Service', 'Contributors', 'FAQ', 'Contact'];

  return (
    <>
      <nav 
        className={`fixed max-w-7xl top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/90 backdrop-blur-sm shadow-md'
        } rounded-2xl border border-gray-200/50`}
        style={{
          width: 'calc(100% - 2rem)',
        }}
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <img src="/unispace_logo.svg" alt="unispace_logo" className="w-auto h-6" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem'
                  }}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1rem'
                }}
              >
                Login
              </button>
              <button
                className="px-6 py-2 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-80 shadow-sm"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1rem',
                  backgroundColor: '#1D3A8A'
                }}
              >
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 z-[60]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white">
          <div className="flex flex-col h-full justify-between px-8 py-10">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-4 mt-16">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-700 hover:text-[#214cc3] transition-colors duration-300 font-medium"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '48px',
                    lineHeight: '1.2'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Auth Buttons at Bottom */}
            <div className="flex flex-row space-x-4 pb-2 mt-20">
              <button
                className="w-full px-6 py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg border border-gray-300"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </button>
              <button
                className="w-full px-6 py-4 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-80 shadow-sm"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  backgroundColor: '#1D3A8A'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;