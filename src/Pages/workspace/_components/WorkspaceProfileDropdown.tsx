import React, { useState, useRef, useEffect } from 'react';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const WorkspaceProfileDropdown = () => {
  const { workspace, logout } = useWorkspacePortalContext();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!workspace) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1D3A8A] text-white font-bold text-lg focus:outline-none overflow-hidden"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Workspace profile menu"
      >
        {workspace.image ? (
          <img 
            src={workspace.image} 
            alt={workspace.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          getInitials(workspace.name)
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-[#1D3A8A] font-semibold text-sm">
            {workspace.name}
          </div>
          <button
            className="w-full text-left px-4 py-2 text-[#EF4444] hover:bg-[#F3F4F6] text-sm"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkspaceProfileDropdown; 