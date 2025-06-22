import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWorkspacePortalContext } from './WorkspacePortalContext';

interface RequireWorkspaceProps {
  children: React.ReactNode;
}

const RequireWorkspace: React.FC<RequireWorkspaceProps> = ({ children }) => {
  const { workspace, loading } = useWorkspacePortalContext();
  const location = useLocation();

  if (loading) return <div className='h-screen flex justify-center items-center'>Loading...</div>;
  if (!workspace) return <Navigate to="/workspace/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

export default RequireWorkspace; 