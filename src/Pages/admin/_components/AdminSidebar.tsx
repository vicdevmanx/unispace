import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/workspaces', label: 'Workspace Management' },
  // Add more links as needed
];

const AdminSidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg p-6 min-h-screen">
      <div className="flex flex-col items-center mb-6">
        <img src="/unispace_logo.svg" alt="UniSpace Logo" className="w-auto h-16 mb-2" />

      </div>
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

export default AdminSidebar; 