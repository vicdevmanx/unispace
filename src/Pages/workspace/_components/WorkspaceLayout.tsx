import React from 'react';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceProfileDropdown from './WorkspaceProfileDropdown';

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="flex justify-end items-center h-16 px-6 bg-white shadow-sm">
          <WorkspaceProfileDropdown />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout; 