import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';

const links = [
  { to: '/workspace/dashboard', label: 'Dashboard' },
  { to: '/workspace/services', label: 'Services' },
  { to: '/workspace/bookings', label: 'Bookings' },
  { to: '/workspace/community', label: 'Community' },
  { to: '/workspace/settings', label: 'Settings' },
];

const WorkspaceSidebar = () => {
  const { workspace, pending } = useWorkspacePortalContext();

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

export default WorkspaceSidebar; 