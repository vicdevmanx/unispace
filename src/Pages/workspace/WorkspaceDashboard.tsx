import React from 'react';
import WorkspaceLayout from './_components/WorkspaceLayout';
import { useWorkspacePortalContext } from '../../contexts/WorkspacePortalContext';

const WorkspaceDashboard = () => {
  const { workspace, loading } = useWorkspacePortalContext();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!workspace) return <div className="h-screen flex items-center justify-center text-red-500">Workspace not found or not logged in.</div>;

  return (
    <WorkspaceLayout>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Total Cards */}
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-[#1D3A8A]">0</div>
          <div className="text-[#4B5563]">Total Bookings</div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-[#1D3A8A]">₦0</div>
          <div className="text-[#4B5563]">Total Revenue</div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-[#1D3A8A]">0</div>
          <div className="text-[#4B5563]">Active Services</div>
        </div>
      </div>
      {/* Chart Area */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Bookings Overview</h2>
        <div className="h-64 flex items-center justify-center text-[#4B5563]">
          {/* Chart will go here */}
          <span>Chart coming soon...</span>
        </div>
      </div>
      {/* Workspace Info */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl flex flex-col items-center mx-auto">
        <img src={workspace.image} alt={workspace.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[#1D3A8A]" />
        <h1 className="text-3xl font-bold text-[#1D3A8A] mb-2">{workspace.name}</h1>
        <div className="text-[#4B5563] mb-2">{workspace.email}</div>
        <div className="text-[#4B5563] mb-2">{workspace.phoneNumber}</div>
        <div className="text-[#4B5563] mb-4 text-center">{workspace.address}</div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceDashboard; 