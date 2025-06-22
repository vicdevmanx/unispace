import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/workspace/dashboard', label: 'Dashboard' },
  { to: '/workspace/services', label: 'Services' },
  { to: '/workspace/bookings', label: 'Bookings' },
  { to: '/workspace/community', label: 'Community' },
  { to: '/workspace/settings', label: 'Settings' },
];

const WorkspaceSidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg p-6 min-h-screen">
      <h2 className="text-xl font-bold text-[#1D3A8A] mb-8">Workspace Portal</h2>
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-[#1D3A8A] text-white' : 'text-[#1D3A8A] hover:bg-[#F3F4F6]'
              }`
            }
            end
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default WorkspaceSidebar; 