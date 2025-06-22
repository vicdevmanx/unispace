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
      <h2 className="text-xl font-bold text-[#1D3A8A] mb-8">Admin Panel</h2>
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