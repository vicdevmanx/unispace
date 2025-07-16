import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';

const getInitials = (firstname = '', lastname = '') => {
  return (
    (firstname[0] || '').toUpperCase() + (lastname[0] || '').toUpperCase()
  );
};

const UserProfileDropdown = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
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

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="User profile menu"
      >
        {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full rounded-full object-cover bg-white"
                  />
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg focus:outline-none">
                    {getInitials(user.firstname, user.lastname)}
                  </div>
                )}
      </button>

      
      {open && (
        <div className={`absolute max-lg:left-0 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50`}>
          <div className="px-4 py-2 text-[#1D3A8A] font-semibold text-sm">
            {user.firstname} {user.lastname}
          </div>
          <div className="px-4 py-1 text-gray-500 text-xs">
            {user.email}
          </div>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F3F4F6] text-sm"
            onClick={() => {
              setOpen(false);
              navigate('/profile');
            }}
          >
            My Profile
          </button>
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

export default UserProfileDropdown;
