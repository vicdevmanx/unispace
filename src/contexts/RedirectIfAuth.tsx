import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

interface RedirectIfAuthProps {
  children: React.ReactNode;
}

const RedirectIfAuth: React.FC<RedirectIfAuthProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className='h-screen flex justify-center items-center'>Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default RedirectIfAuth; 