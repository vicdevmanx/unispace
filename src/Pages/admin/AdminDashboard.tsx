import React from 'react';
import AdminLayout from './_components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Mock stats data
const stats = [
  { label: 'Total Users', value: 1240 },
  { label: 'Total Bookings', value: 3200 },
  { label: 'Total UniPoints', value: 15800 },
  { label: 'Total Workspaces', value: 42 },
];

const chartData = [
  { month: 'Jan', bookings: 200 },
  { month: 'Feb', bookings: 250 },
  { month: 'Mar', bookings: 300 },
  { month: 'Apr', bookings: 400 },
  { month: 'May', bookings: 350 },
  { month: 'Jun', bookings: 500 },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1D3A8A]">Admin Dashboard</h1>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-[#1D3A8A] mb-2">{stat.value}</div>
            <div className="text-[#4B5563] text-lg font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Bookings Over Time Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Bookings Over Time</h2>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#1D3A8A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* TODO: Add analytics, user management, and more admin features here */}
    </AdminLayout>
  );
};

export default AdminDashboard; 