import React from 'react';
import { useAuthContext } from './AuthContext';

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className='h-screen flex justify-center items-center'>Loading...</div>;
  if (!user || user.userType !== 'admin') return <div className="h-screen flex justify-center items-center text-center text-red-500 mt-10">Access denied. Admins only.</div>;
  return <>{children}</>;
};

export default RequireAdmin;