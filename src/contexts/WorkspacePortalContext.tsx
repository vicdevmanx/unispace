import React, { createContext, useContext, ReactNode } from 'react';
import { useWorkspacePortal } from '../hooks/useWorkspacePortal';

const WorkspacePortalContext = createContext<any>(undefined);

export const WorkspacePortalProvider = ({ children }: { children: ReactNode }) => {
  const portal = useWorkspacePortal();
  return (
    <WorkspacePortalContext.Provider value={portal}>
      {children}
    </WorkspacePortalContext.Provider>
  );
};

export const useWorkspacePortalContext = () => {
  const ctx = useContext(WorkspacePortalContext);
  if (!ctx) throw new Error('useWorkspacePortalContext must be used within WorkspacePortalProvider');
  return ctx;
}; 