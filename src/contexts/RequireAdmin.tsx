import React from 'react';
import { useAuthContext } from './AuthContext';

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className='h-screen flex justify-center items-center'>
    <svg className="animate-spin" width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" stroke="#e0e0e0" fill="none" strokeWidth="5" />
      <path
        fill="none"
        stroke="#1d3a8a"
        strokeWidth="5"
        strokeLinecap="round"
        d="M25 5
           a20 20 0 0 1 0 40
           a20 20 0 0 1 0 -40"
      />
    </svg>

  </div>;
  if (!user || user.userType !== 'admin') return <div className="h-screen flex justify-center items-center text-center text-red-500 mt-10">Access denied. Admins only.</div>;
  return <>{children}</>;
};

export default RequireAdmin;