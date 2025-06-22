import React, { createContext, useContext, ReactNode } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';

const WorkspaceContext = createContext<any>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const workspace = useWorkspace();
  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
  return ctx;
}; 