import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminProfileDropdown from './AdminProfileDropdown';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="flex justify-between items-center h-16 px-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-[#1D3A8A]">Admin Panel</h2>
          <AdminProfileDropdown />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 