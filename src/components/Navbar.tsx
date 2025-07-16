import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import UserProfileDropdown from '../pages/main/_components/UserProfileDorpdown';

// Skeleton loader component
const NavbarSkeleton = () => (
  <nav className="fixed max-w-7xl top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-2xl border border-gray-200/50 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)]">
    <div className="px-6 py-3">
      <div className="flex items-center justify-between animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="hidden lg:flex items-center space-x-8">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="hidden lg:flex items-center space-x-3">
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
        <div className="lg:hidden h-8 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  </nav>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [communitiesDropdownOpen, setCommunitiesDropdownOpen] = useState(false);
  const [rewardsDropdownOpen, setRewardsDropdownOpen] = useState(false);
  const { user, loading } = useAuthContext();

  // Refs for hover delay
  const workspaceDropdownRef = useRef<NodeJS.Timeout | null>(null);
  const communitiesDropdownRef = useRef<NodeJS.Timeout | null>(null);
  const rewardsDropdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Different navigation links based on authentication status and user type
  const publicNavLinks = ['About', 'Service', 'Contributors', 'FAQ', 'Contact'];
  const normalUserNavLinks = ['Home', 'Workspace']; // 'Communities', 'Rewards' commented out for now

  // Determine which navigation links to show
  let navLinks = publicNavLinks;
  if (user && user.userType === 'normal') {
    navLinks = normalUserNavLinks;
  }

  const handleDropdownMouseEnter = (dropdownType: 'workspace' | 'communities' | 'rewards') => {
    // Clear any existing timeout
    if (dropdownType === 'workspace' && workspaceDropdownRef.current) {
      clearTimeout(workspaceDropdownRef.current);
      workspaceDropdownRef.current = null;
    }
    if (dropdownType === 'communities' && communitiesDropdownRef.current) {
      clearTimeout(communitiesDropdownRef.current);
      communitiesDropdownRef.current = null;
    }
    if (dropdownType === 'rewards' && rewardsDropdownRef.current) {
      clearTimeout(rewardsDropdownRef.current);
      rewardsDropdownRef.current = null;
    }

    // Open the dropdown
    if (dropdownType === 'workspace') setWorkspaceDropdownOpen(true);
    if (dropdownType === 'communities') setCommunitiesDropdownOpen(true);
    if (dropdownType === 'rewards') setRewardsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = (dropdownType: 'workspace' | 'communities' | 'rewards') => {
    // Set timeout to close dropdown after 0.5 seconds
    const timeout = setTimeout(() => {
      if (dropdownType === 'workspace') setWorkspaceDropdownOpen(false);
      if (dropdownType === 'communities') setCommunitiesDropdownOpen(false);
      if (dropdownType === 'rewards') setRewardsDropdownOpen(false);
    }, 500);

    // Store the timeout reference
    if (dropdownType === 'workspace') workspaceDropdownRef.current = timeout;
    if (dropdownType === 'communities') communitiesDropdownRef.current = timeout;
    if (dropdownType === 'rewards') rewardsDropdownRef.current = timeout;
  };

  const renderNavLink = (link: string, index: number) => {
    // Handle Home link for all authenticated users
    if (user && link === 'Home') {
      return (
        <a
          key={index}
          href="/user-home"
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '1rem'
          }}
        >
          {link}
        </a>
      );
    }

    // Handle Workspace dropdown for normal users only
    if (user && user.userType === 'normal' && link === 'Workspace') {
      return (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => handleDropdownMouseEnter('workspace')}
          onMouseLeave={() => handleDropdownMouseLeave('workspace')}
        >
          <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
            <span style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1rem'
            }}>
              {link}
            </span>
            <ChevronDown size={16} className="transition-transform duration-200" />
          </button>
          {workspaceDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
              <a
                href="/space/service"
                className="block px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm transition-colors duration-200"
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Services
              </a>
              <a
                href="/space/transactions"
                className="block px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm transition-colors duration-200"
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Transactions
              </a>
              <a
                href="/space/history"
                className="block px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm transition-colors duration-200"
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                History
              </a>
            </div>
          )}
        </div>
      );
    }

    // Handle Communities dropdown for normal users only
    // if (user && user.userType === 'normal' && link === 'Communities') {
    //   return (
    //     <div
    //       key={index}
    //       className="relative"
    //       onMouseEnter={() => handleDropdownMouseEnter('communities')}
    //       onMouseLeave={() => handleDropdownMouseLeave('communities')}
    //     >
    //       <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
    //         <span style={{
    //           fontFamily: 'Poppins, sans-serif',
    //           fontSize: '1rem'
    //         }}>
    //           {link}
    //         </span>
    //         <ChevronDown size={16} className="transition-transform duration-200" />
    //       </button>
    //       {communitiesDropdownOpen && (
    //         <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
    //           <a
    //             href="/communities/my-communities"
    //             className="block px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm transition-colors duration-200"
    //             style={{
    //               fontFamily: 'Poppins, sans-serif'
    //             }}
    //           >
    //             My Communities
    //           </a>
    //           <a
    //             href="/communities/join"
    //             className="block px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm transition-colors duration-200"
    //             style={{
    //               fontFamily: 'Poppins, sans-serif'
    //             }}
    //           >
    //             Join a Community
    //           </a>
    //         </div>
    //       )}
    //     </div>
    //   );
    // }

    // Handle Rewards dropdown for normal users
    // if (user && user.userType === 'normal' && link === 'Rewards') {
    //   return (
    //     <div
    //       key={index}
    //       className="relative"
    //       onMouseEnter={() => handleDropdownMouseEnter('rewards')}
    //       onMouseLeave={() => handleDropdownMouseLeave('rewards')}
    //     >
    //       <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
    //         <span style={{
    //           fontFamily: 'Poppins, sans-serif',
    //           fontSize: '1rem'
    //         }}>
    //           {link}
    //         </span>
    //         <ChevronDown size={16} className="transition-transform duration-200" />
    //       </button>
    //       {rewardsDropdownOpen && (
    //         <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
    //           <a
    //             href="/rewards"
    //             className="block px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm transition-colors duration-200"
    //             style={{
    //               fontFamily: 'Poppins, sans-serif'
    //             }}
    //           >
    //             Points
    //           </a>
    //           <a
    //             href="/rewards/streak"
    //             className="block px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm transition-colors duration-200"
    //             style={{
    //               fontFamily: 'Poppins, sans-serif'
    //             }}
    //           >
    //             Streak
    //           </a>
    //         </div>
    //       )}
    //     </div>
    //   );
    // }

    // Default case for public links
    return (
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
    );
  };

  // Show skeleton loader if loading
  if (loading) {
    return <NavbarSkeleton />;
  }

  return (
    <>
      <nav 
        className={`fixed max-w-7xl top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/90 backdrop-blur-sm shadow-md'
        } rounded-2xl border border-gray-200/50 md:w-[calc(100%-4rem)] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]`}
        style={{
          width: 'calc(100% - 2rem)', // Default width, overridden by responsive classes
        }}
      >
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <img src="/unispace_logo.svg" alt="unispace_logo" className="w-auto h-6 sm:h-8" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 sm:space-x-8">
              {navLinks.map((link, index) => renderNavLink(link, index))}
            </div>

            {/* Desktop Auth Buttons / User Profile */}
            <div className="hidden lg:flex items-center space-x-2 sm:space-x-3">
              {user ? (
                <UserProfileDropdown />
              ) : (
                <>
                  <Link to="/login">
                    <button
                      className="px-3 sm:px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg text-sm sm:text-base"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '1rem'
                      }}
                    >
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button
                      className="px-3 sm:px-6 py-2 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-80 shadow-sm text-sm sm:text-base"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '1rem',
                        backgroundColor: '#1D3A8A'
                      }}
                    >
                      Register
                    </button>
                  </Link>
                </>
              )}
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
          <div className="flex flex-col h-full justify-between px-4 sm:px-6 py-6">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-4 mt-12 sm:mt-16">
              {navLinks.map((link, index) => {
                // Handle Home link for all authenticated users
                if (user && link === 'Home') {
                  return (
                    <a
                      key={index}
                      href="/user-home"
                      className="text-gray-700 hover:text-[#214cc3] transition-colors duration-300 font-medium text-lg sm:text-xl"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: '1.2'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link}
                    </a>
                  );
                }

                // Handle Workspace dropdown for normal users only
                if (user && user.userType === 'normal' && link === 'Workspace') {
                  return (
                    <div key={index} className="space-y-2">
                      <div
                        className="text-gray-700 font-medium cursor-pointer text-lg sm:text-xl"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          lineHeight: '1.2'
                        }}
                        onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                      >
                        {link}
                      </div>
                      {workspaceDropdownOpen && (
                        <div className="ml-4 sm:ml-8 space-y-2">
                          <a
                            href="/space/service"
                            className="block text-gray-600 hover:text-[#214cc3] transition-colors duration-300 text-sm sm:text-base"
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              lineHeight: '1.2'
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Services
                          </a>
                          <a
                            href="/space/transactions"
                            className="block text-gray-600 hover:text-[#214cc3] transition-colors duration-300 text-sm sm:text-base"
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              lineHeight: '1.2'
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Transactions
                          </a>
                          <a
                            href="/space/history"
                            className="block text-gray-600 hover:text-[#214cc3] transition-colors duration-300 text-sm sm:text-base"
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              lineHeight: '1.2'
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            History
                          </a>
                        </div>
                      )}
                    </div>
                  );
                }

                // Handle Communities dropdown for normal users only
                // if (user && user.userType === 'normal' && link === 'Communities') {
                //   return (
                //     <div key={index} className="space-y-2">
                //       <div
                //         className="text-gray-700 font-medium cursor-pointer text-lg sm:text-xl"
                //         style={{
                //           fontFamily: 'Poppins, sans-serif',
                //           lineHeight: '1.2'
                //         }}
                //         onClick={() => setCommunitiesDropdownOpen(!communitiesDropdownOpen)}
                //       >
                //         {link}
                //       </div>
                //       {communitiesDropdownOpen && (
                //         <div className="ml-4 sm:ml-8 space-y-2">
                //           <a
                //             href="/communities/my-communities"
                //             className="block text-gray-600 hover:text-[#214cc3] transition-colors duration-300 text-sm sm:text-base"
                //             style={{
                //               fontFamily: 'Poppins, sans-serif',
                //               lineHeight: '1.2'
                //             }}
                //             onClick={() => setIsMobileMenuOpen(false)}
                //           >
                //             My Communities
                //           </a>
                //           <a
                //             href="/communities/join"
                //             className="block text-gray-600 hover:text-[#214cc3] transition-colors duration-300 text-sm sm:text-base"
                //             style={{
                //               fontFamily: 'Poppins, sans-serif',
                //               lineHeight: '1.2'
                //             }}
                //             onClick={() => setIsMobileMenuOpen(false)}
                //           >
                //             Join a Community
                //           </a>
                //         </div>
                //       )}
                //     </div>
                //   );
                // }

                // Handle Rewards dropdown for normal users
                // if (user && user.userType === 'normal' && link === 'Rewards') {
                //   return (
                //     <div key={index} className="space-y-2">
                //       <div
                //         className="text-gray-700 font-medium cursor-pointer text-lg sm:text-xl"
                //         style={{
                //           fontFamily: 'Poppins, sans-serif',
                //           lineHeight: '1.2'
                //         }}
                //         onClick={() => setRewardsDropdownOpen(!rewardsDropdownOpen)}
                //       >
                //         {link}
                //       </div>
                //       {rewardsDropdownOpen && (
                //         <div className="ml-4 sm:ml-8 space-y-2">
                //           <a
                //             href="/rewards"
                //             className="block text-gray-600 hover:text-[#214cc3] transition-colors duration-300 text-sm sm:text-base"
                //             style={{
                //               fontFamily: 'Poppins, sans-serif',
                //               lineHeight: '1.2'
                //             }}
                //             onClick={() => setIsMobileMenuOpen(false)}
                //           >
                //             Points
                //           </a>
                //           <a
                //             href="/rewards/streak"
                //             className="block text-gray-600 hover:text-[#214cc3] transition-colors duration-300 text-sm sm:text-base"
                //             style={{
                //               fontFamily: 'Poppins, sans-serif',
                //               lineHeight: '1.2'
                //             }}
                //             onClick={() => setIsMobileMenuOpen(false)}
                //           >
                //             Streak
                //           </a>
                //         </div>
                //       )}
                //     </div>
                //   );
                // }

                // Default case for public links
                return (
                  <a
                    key={index}
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-700 hover:text-[#214cc3] transition-colors duration-300 font-medium text-lg sm:text-xl"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      lineHeight: '1.2'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link}
                  </a>
                );
              })}
            </div>

            {/* Auth Buttons at Bottom */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pb-4 sm:pb-2 mt-12 sm:mt-20">
              {user ? (
                <div className="w-full flex">
                  <UserProfileDropdown />
                </div>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <button
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg border border-gray-300 text-base sm:text-lg"
                      style={{
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-80 shadow-sm text-base sm:text-lg"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        backgroundColor: '#1D3A8A'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;