import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

interface RedirectIfAuthProps {
  children: React.ReactNode;
}

const RedirectIfAuth: React.FC<RedirectIfAuthProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  // console.log('RedirectIfAuth user:', user);
  if (loading) return <div className='h-screen flex justify-center items-center'>RedirectIfAuth Loading...</div>;
  if (user) {
    if (user.userType === 'normal') return <Navigate to="/user-home" replace />;
    if (user.userType === 'workspace') return <Navigate to="/workspace/dashboard" replace />;
    if (user.userType === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default RedirectIfAuth; 