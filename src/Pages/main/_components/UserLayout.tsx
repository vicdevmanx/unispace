import React from 'react';
import Navbar from '../../../components/Navbar';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1D3A8A]/5">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content with top padding to account for fixed navbar */}
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
};

export default UserLayout; 