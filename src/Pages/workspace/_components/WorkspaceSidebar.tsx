import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';
import { 
  LayoutDashboard, 
  Settings, 
  Percent, 
  Calendar, 
  CreditCard, 
  Coins,
  User,
  Menu,
  X
} from 'lucide-react';

const links = [
  { to: '/workspace/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workspace/services', label: 'Services', icon: Settings },
  { to: '/workspace/discounts', label: 'Discounts', icon: Percent },
  { to: '/workspace/bookings', label: 'Bookings', icon: Calendar },
  // { to: '/workspace/community', label: 'Community' },
  { to: '/workspace/cashtoken-transactions', label: 'Cashtoken', icon: Coins },
  { to: '/workspace/transactions', label: 'All Transactions', icon: CreditCard },
  { to: '/workspace/profile', label: 'Profile', icon: User },
];

const WorkspaceSidebar = () => {
  const { workspace, pending } = useWorkspacePortalContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pending) {
    return (
      <aside className="w-64 bg-white shadow-lg p-6 min-h-screen flex flex-col items-center justify-center">
        <img src="/unispace_logo.svg" alt="UniSpace Logo" className="w-auto h-16 mb-4" />
        <div className="text-red-700 text-center font-semibold">
          Your workspace is pending admin approval.<br />
          You cannot access the workspace portal until approved.
        </div>
      </aside>
    );
  }

  const NavLinks = () => (
    <>
      {links.map(link => {
        const IconComponent = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-[#1D3A8A] text-white' : 'text-[#1D3A8A] hover:bg-[#F3F4F6]'
              }`
            }
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            <IconComponent size={20} />
            {link.label}
          </NavLink>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1D3A8A] text-white rounded-lg shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex flex-col items-center mb-6">
            <img src="/unispace_logo.svg" alt="UniSpace Logo" className="w-auto h-16 mb-2" />
          </div>
          <nav className="flex flex-col gap-2 flex-1">
            <NavLinks />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default WorkspaceSidebar; 