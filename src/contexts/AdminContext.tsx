import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';

interface AdminContextProps {
  user: any;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, error, logout } = useAuthContext();

  return (
    <AdminContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminContext must be used within AdminProvider');
  return ctx;
}; 