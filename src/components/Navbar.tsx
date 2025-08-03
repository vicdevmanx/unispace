import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Home, Briefcase, User, LogOut, Info, Contact, Users, FileText, Clock, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import UserProfileDropdown from "../Pages/main/_components/UserProfileDorpdown";

// Skeleton loader component
const NavbarSkeleton = () => (
  <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl border border-gray-200/30 bg-white/80 backdrop-blur-lg shadow-lg">
    <div className="px-6 py-3">
      <div className="flex items-center justify-between animate-pulse">
        <div className="h-8 w-36 bg-gray-200 rounded-2xl" />
        <div className="hidden lg:flex items-center space-x-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 w-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          <div className="h-10 w-28 bg-gray-200 rounded-2xl" />
          <div className="h-10 w-28 bg-gray-200 rounded-2xl" />
        </div>
        <div className="lg:hidden h-10 w-10 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  </nav>
);

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, loading, logout } = useAuthContext();

  // Refs for hover delay
  const workspaceDropdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links with icons
  const publicNavLinks = [
    { name: "About", icon: Info },
    { name: "Service", icon: Briefcase },
    { name: "Contributors", icon: Users },
    { name: "FAQ", icon: FileText },
    { name: "Contact", icon: Contact },
  ];
  const normalUserNavLinks = [
    { name: "Home", icon: Home },
    { name: "Workspace", icon: Briefcase },
  ];
  let navLinks = user && user.userType === "normal" ? normalUserNavLinks : publicNavLinks;

  const handleDropdownMouseEnter = () => {
    if (workspaceDropdownRef.current) clearTimeout(workspaceDropdownRef.current);
    setWorkspaceDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    workspaceDropdownRef.current = setTimeout(() => {
      setWorkspaceDropdownOpen(false);
    }, 300);
  };

  interface NavLink {
    name: string;
    icon: React.ComponentType<{ size?: number }>;
  }

  interface SubNavLink {
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    path: string;
  }

  interface RenderNavLinkProps {
    link: NavLink;
    index: number;
  }

  const renderNavLink = (link: NavLink, index: number): React.ReactNode => {
    const Icon = link.icon;

    if (user && link.name === "Home") {
      return (
        <a
          key={index}
          href="/user-home"
          className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition-colors duration-300 font-semibold text-sm tracking-wide"
        >
          <Icon size={16} />
          <span>{link.name}</span>
        </a>
      );
    }

    if (user && user.userType === "normal" && link.name === "Workspace") {
      const subNavLinks: SubNavLink[] = [
        { name: "Service", icon: Briefcase, path: "/space/service" },
        { name: "Transactions", icon: CreditCard, path: "/space/transactions" },
        { name: "History", icon: Clock, path: "/space/history" },
      ];
      return (
        <div
          key={index}
          className="relative"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <button className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition-colors duration-300 font-semibold text-sm tracking-wide">
            <Icon size={16} />
            <span>{link.name}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${workspaceDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {workspaceDropdownOpen && (
            <div className="absolute top-full left-0 mt-3 w-52 bg-white rounded-xl shadow-2xl py-3 border border-gray-100/50 backdrop-blur-sm animate-fade-in">
              {subNavLinks.map((item, i) => {
                const SubIcon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.path}
                    className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-all duration-200"
                  >
                    <SubIcon size={14} />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <a
        key={index}
        href={`#${link.name.toLowerCase()}`}
        className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition-colors duration-300 font-semibold text-sm tracking-wide"
      >
        <Icon size={16} />
        <span>{link.name}</span>
      </a>
    );
  };

  if (loading) return <NavbarSkeleton />;

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl border border-gray-200/30 transition-all duration-500 ${
          isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white/80 backdrop-blur-md shadow-md"
        }`}
      >
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 group">
              <img
                src="/unispace_logo.svg"
                alt="Unispace Logo"
                className="w-auto h-6 sm:h-6 transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link, index) => renderNavLink(link, index))}
            </div>

            {/* Desktop Auth / Profile */}
            <div className="hidden lg:flex items-center space-x-6">
              {user ? (
                <UserProfileDropdown />
              ) : (
                <>
                  <Link to="/login">
                    <button className="flex items-center space-x-2 px-5 py-2.5 text-gray-800 hover:text-blue-600 font-semibold text-sm rounded-2xl transition-all duration-300 hover:bg-blue-50">
                      <User size={16} />
                      <span>Login</span>
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-2xl transition-all duration-300 hover:bg-blue-700 hover:shadow-md">
                      <User size={16} />
                      <span>Register</span>
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-2xl hover:bg-gray-100 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-800 animate-spin-once" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800 animate-spin-once" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gradient-to-b from-white to-gray-50 animate-slide-in">
          <div className="flex flex-col h-full px-6 py-12">
            <div className="flex flex-col space-y-8 mt-16">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                if (user && link.name === "Home") {
                  return (
                    <a
                      key={index}
                      href="/user-home"
                      className="flex items-center space-x-3 text-gray-800 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{link.name}</span>
                    </a>
                  );
                }

                if (user && user.userType === "normal" && link.name === "Workspace") {
                  return (
                    <div key={index} className="space-y-4">
                      <button
                        className="flex items-center space-x-3 text-gray-800 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
                        onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                      >
                        <Icon size={20} />
                        <span>{link.name}</span>
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-300 ${workspaceDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {workspaceDropdownOpen && (
                        <div className="ml-8 space-y-3">
                          {[
                            { name: "Service", icon: Briefcase, path: "/space/service" },
                            { name: "Transactions", icon: CreditCard, path: "/space/transactions" },
                            { name: "History", icon: Clock, path: "/space/history" },
                          ].map((item, i) => {
                            const SubIcon = item.icon;
                            return (
                              <a
                                key={i}
                                href={item.path}
                                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 text-base font-medium transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <SubIcon size={18} />
                                <span>{item.name}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={index}
                    href={`#${link.name.toLowerCase()}`}
                    className="flex items-center space-x-3 text-gray-800 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </a>
                );
              })}

              {/* Mobile Profile */}
              {user && (
                <div className="space-y-4">
                  <button
                    className="flex items-center space-x-3 text-gray-800 hover:text-blue-600 text-lg font-semibold transition-colors duration-300"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <User size={20} />
                    <span>Profile</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {profileDropdownOpen && (
                    <div className="ml-8 space-y-3">
                      <button
                        className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 text-base font-medium transition-colors duration-300"
                        onClick={() => {
                          navigate("/profile");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User size={18} />
                        <span>My Profile</span>
                      </button>
                      <button
                        className="flex items-center space-x-3 text-red-500 hover:text-red-600 text-base font-medium transition-colors duration-300"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          logout();
                        }}
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex flex-col space-y-4 mt-auto pb-8">
                <Link to="/login">
                  <button
                    className="flex items-center justify-center space-x-3 w-full py-4 text-gray-800 hover:text-blue-600 font-semibold text-lg rounded-2xl border border-gray-200 transition-all duration-300 hover:bg-blue-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Login</span>
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    className="flex items-center justify-center space-x-3 w-full py-4 bg-blue-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Register</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;