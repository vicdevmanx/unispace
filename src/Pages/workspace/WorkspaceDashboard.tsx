import React, { useEffect, useState } from 'react';
import WorkspaceLayout from './_components/WorkspaceLayout';
import { useWorkspacePortalContext } from '../../contexts/WorkspacePortalContext';
import { useWorkspaceServices } from '../../hooks/useWorkspaceServices';
import { useBooking } from '../../hooks/useBooking';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/Firebase';
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Settings, 
  Percent, 
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, isSameDay, parseISO } from 'date-fns';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeServices: number;
  pendingCashtokens: number;
  totalDiscounts: number;
  completedBookings: number;
  pendingBookings: number;
  inProgressBookings: number;
  cancelledBookings: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  paystackTransactions: number;
  cashtokenTransactions: number;
  transactionRevenue: number;
}

type DateFilter = 'all' | 'week' | 'month' | 'year' | 'single';

const WorkspaceDashboard = () => {
  const { workspace, loading: workspaceLoading, getDiscounts } = useWorkspacePortalContext();
  const { getWorkspaceBookings } = useBooking();
  const { listServices } = useWorkspaceServices(workspace?.id);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingCashtokens: 0,
    totalDiscounts: 0,
    completedBookings: 0,
    pendingBookings: 0,
    inProgressBookings: 0,
    cancelledBookings: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    paystackTransactions: 0,
    cashtokenTransactions: 0,
    transactionRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [singleDate, setSingleDate] = useState<string>('');

  const fetchDashboardData = async () => {
    if (!workspace?.id) return;
    
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        bookings,
        services,
        discounts,
        cashtokens,
        transactions
      ] = await Promise.all([
        getWorkspaceBookings(workspace.id),
        listServices(),
        getDiscounts(workspace.id),
        getDocs(query(collection(db, 'cashtokens'), where('workspaceId', '==', workspace.id))),
        getDocs(query(collection(db, 'transactions'), where('workspaceId', '==', workspace.id)))
      ]);

      // Date filtering logic
      let filterStart: Date | null = null;
      let filterEnd: Date | null = null;
      const now = new Date();
      if (dateFilter === 'week') {
        filterStart = startOfWeek(now, { weekStartsOn: 1 });
        filterEnd = endOfWeek(now, { weekStartsOn: 1 });
      } else if (dateFilter === 'month') {
        filterStart = startOfMonth(now);
        filterEnd = endOfMonth(now);
      } else if (dateFilter === 'year') {
        filterStart = startOfYear(now);
        filterEnd = endOfYear(now);
      } else if (dateFilter === 'single' && singleDate) {
        filterStart = new Date(singleDate);
        filterEnd = new Date(singleDate);
      }

      // Helper to check if a date is in range
      const inRange = (dateStr: string | number | Date | undefined) => {
        if (!dateStr) return false;
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        if (dateFilter === 'single' && singleDate) {
          return isSameDay(date, new Date(singleDate));
        }
        if (filterStart && filterEnd) {
          return isWithinInterval(date, { start: filterStart, end: filterEnd });
        }
        return true;
      };

      // Filter bookings and transactions by date
      const filteredBookings = bookings.filter(b => inRange(b.createdAt));
      const filteredTransactions = transactions.docs.filter(doc => inRange(doc.data().createdAt));
      const filteredCashtokens = cashtokens.docs.filter(doc => inRange(doc.data().createdAt));

      const totalBookings = filteredBookings.length;
      const totalRevenue = filteredBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
      const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
      const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
      const inProgressBookings = filteredBookings.filter(b => b.status === 'inprogress').length;
      const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;

      // Get recent bookings (last 5)
      const recent = filteredBookings
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);

      // Calculate transaction statistics
      const totalTransactions = filteredTransactions.length;
      const successfulTransactions = filteredTransactions.filter(doc => doc.data().status === 'success').length;
      const failedTransactions = filteredTransactions.filter(doc => doc.data().status === 'failed').length;
      const paystackTransactions = filteredTransactions.filter(doc => doc.data().method === 'paystack').length;
      const cashtokenTransactions = filteredTransactions.filter(doc => doc.data().method === 'cashtoken').length;
      const transactionRevenue = filteredTransactions
        .filter(doc => doc.data().status === 'success')
        .reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

      // Calculate other statistics
      const activeServices = Array.isArray(services) ? services.length : 0;
      const totalDiscounts = Array.isArray(discounts) ? discounts.length : 0;
      const pendingCashtokens = filteredCashtokens.filter(doc => doc.data().status === 'pending').length;

      setStats({
        totalBookings,
        totalRevenue,
        activeServices,
        pendingCashtokens,
        totalDiscounts,
        completedBookings,
        pendingBookings,
        inProgressBookings,
        cancelledBookings,
        totalTransactions,
        successfulTransactions,
        failedTransactions,
        paystackTransactions,
        cashtokenTransactions,
        transactionRevenue,
      });
      setRecentBookings(recent);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [workspace?.id, dateFilter, singleDate]);

  if (workspaceLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!workspace) return <div className="h-screen flex items-center justify-center text-red-500">Workspace not found or not logged in.</div>;

  // Filter UI
  const filterOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Year', value: 'year' },
    { label: 'Single Date', value: 'single' },
  ];

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color?: string; 
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{title}</div>
    </div>
  );

  const BookingStatusCard = ({ status, count, color }: { status: string; count: number; color: string }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4 flex items-center justify-between`}>
      <div>
        <div className={`text-${color}-600 font-semibold`}>{status}</div>
        <div className="text-2xl font-bold text-gray-900">{count}</div>
      </div>
      <div className={`p-2 rounded-full bg-${color}-100`}>
        <Calendar className={`w-5 h-5 text-${color}-600`} />
      </div>
    </div>
  );

  return (
    <WorkspaceLayout>
      {/* Date Filter UI */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              className={`px-4 py-2 rounded-lg font-semibold text-sm border transition ${dateFilter === opt.value ? 'bg-[#1D3A8A] text-white border-[#1D3A8A]' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
              onClick={() => setDateFilter(opt.value as DateFilter)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {dateFilter === 'single' && (
          <input
            type="date"
            className="ml-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm"
            value={singleDate}
            onChange={e => setSingleDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1D3A8A] mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {workspace.name}</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`₦${stats.transactionRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices}
          icon={Settings}
          color="purple"
        />
        <StatCard
          title="Pending Cashtokens"
          value={stats.pendingCashtokens}
          icon={CreditCard}
          color="yellow"
          subtitle="Need validation"
        />
      </div>

      {/* Transaction Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={CreditCard}
          color="indigo"
        />
        <StatCard
          title="Successful Transactions"
          value={stats.successfulTransactions}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Transaction Revenue"
          value={`₦${stats.transactionRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Failed Transactions"
          value={stats.failedTransactions}
          icon={Clock}
          color="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Status Breakdown */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1D3A8A]" />
            Booking Status Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <BookingStatusCard status="Pending/Active" count={stats.pendingBookings} color="yellow" />
            <BookingStatusCard status="In Progress" count={stats.inProgressBookings} color="blue" />
            <BookingStatusCard status="Completed" count={stats.completedBookings} color="green" />
            <BookingStatusCard status="Cancelled" count={stats.cancelledBookings} color="red" />
          </div>
        </div>

        {/* Transaction Method Breakdown */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#1D3A8A]" />
            Transaction Methods
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-blue-600 font-semibold">Paystack</div>
                <div className="text-2xl font-bold text-gray-900">{stats.paystackTransactions}</div>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-purple-600 font-semibold">Cashtoken</div>
                <div className="text-2xl font-bold text-gray-900">{stats.cashtokenTransactions}</div>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
            </div>
        </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1D3A8A]" />
          Recent Bookings
        </h2>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading recent bookings...</div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No recent bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 font-semibold">User ID</th>
                  <th className="py-2 font-semibold">Service</th>
                  <th className="py-2 font-semibold">Date</th>
                  <th className="py-2 font-semibold">Amount</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{booking.userId}</td>
                    <td className="py-2">{booking.serviceName || 'Workspace Booking'}</td>
                    <td className="py-2">{booking.date}</td>
                    <td className="py-2">₦{booking.totalPrice?.toLocaleString() || booking.totalPrice}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === 'completed' ? 'Completed' :
                        booking.status === 'inprogress' ? 'In Progress' :
                        booking.status === 'pending' ? 'Pending/Active' :
                        booking.status === 'cancelled' ? 'Cancelled' :
                        booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceDashboard; 