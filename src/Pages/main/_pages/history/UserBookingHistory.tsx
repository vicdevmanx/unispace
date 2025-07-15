import React, { useState } from 'react';
import { useUserBookings } from '../../../../hooks/useUserBookings';
import { Booking } from '../../../../types/Workspace';
import { format } from 'date-fns';
import UserLayout from '../../_components/UserLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserBookingHistory: React.FC = () => {
  const { bookings, loading, error, hasMore, fetchNext, fetchPrev, page } = useUserBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageState, setPageState] = useState(1); // for resetting page on search/filter

  const handleDownloadReceipt = (booking: Booking) => {
    // PDF receipt using jsPDF
    const doc = new jsPDF();
    doc.setFont('helvetica', '');
    doc.setFontSize(18);
    doc.text('Booking Receipt', 14, 18);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Thank you for your booking!', 14, 26);

    doc.setDrawColor(200);
    doc.line(14, 30, 196, 30);

    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text(`Booking ID: #${booking.id}`, 14, 40);
    doc.text(`Service ID: #${booking.serviceId}`, 14, 48);
    doc.text(`Date: ${format(new Date(booking.date), 'PPP')}`, 14, 56);
    doc.text(`Start Time: ${booking.startTime}`, 14, 64);
    doc.text(`Duration: ${booking.duration} minutes`, 14, 72);
    doc.text(`Seats: ${booking.numSeats}`, 14, 80);
    doc.text(`Total Price: ₦${booking.totalPrice.toLocaleString()}`, 14, 88);
    doc.text(`Status: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`, 14, 96);
    doc.text(`Created At: ${format(new Date(booking.createdAt), 'PPP p')}`, 14, 104);
    doc.text(`Last Updated: ${format(new Date(booking.updatedAt), 'PPP p')}`, 14, 112);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Unispace | https://unispace.ng', 14, 285);

    doc.save(`booking-receipt-${booking.id}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '✓';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '✕';
      case 'completed':
        return '🎉';
      default:
        return '•';
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      !search ||
      booking.serviceId.toLowerCase().includes(search.toLowerCase()) ||
      booking.status.toLowerCase().includes(search.toLowerCase()) ||
      format(new Date(booking.date), 'PPP').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // Pagination logic for filtered bookings
  const paginatedBookings = filteredBookings.slice((pageState - 1) * 10, pageState * 10);
  const totalPages = Math.ceil(filteredBookings.length / 10);

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1D3A8A] mb-2">My Booking History</h1>
          <p className="text-gray-600">Track and manage all your bookings in one place</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPageState(1); }}
            placeholder="Search by service, status, or date..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] text-gray-700"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPageState(1); }}
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] text-gray-700 min-w-[160px]"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A8A]"></div>
            <span className="ml-3 text-gray-600">Loading your bookings...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBookings.map(booking => (
            <div 
              key={booking.id} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#1D3A8A] to-[#2563eb] p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium opacity-90">Booking Date</p>
                    <p className="text-sm font-semibold">{format(new Date(booking.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)} bg-white/90`}>
                    <span className="mr-1">{getStatusIcon(booking.status)}</span>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Service Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#1D3A8A] rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">Service</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">#{booking.serviceId}</span>
                  </div>

                  {/* Time Info */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Schedule</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start:</span>
                      <span className="font-semibold text-gray-900">{booking.startTime}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900">{booking.duration} min</span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Seats</p>
                        <p className="text-lg font-bold text-[#1D3A8A]">{booking.numSeats}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-lg font-bold text-green-600">₦{booking.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button 
                    className="flex-1 bg-white hover:bg-white/80 text-[#214cc3] border font-medium py-2.5 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-sm"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    View Details
                  </button>
                  <button 
                    className="flex-1 font-medium py-2.5 px-4 rounded-xl bg-[#1D3A8A] hover:bg-[#214cc3] text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-sm"
                    onClick={() => handleDownloadReceipt(booking)}
                  >
                    📄 Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Your booking history will appear here once you make your first reservation.</p>
            <a href="/space/service" className="bg-[#1D3A8A] hover:bg-[#214cc3] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
              Make a Booking
            </a>
          </div>
        )}

        {/* Pagination (only show if more than 1 page) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-4">
            <button 
              onClick={() => setPageState(p => Math.max(1, p - 1))} 
              disabled={pageState === 1} 
              className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              ← Previous
            </button>
            <div className="px-4 py-2 bg-[#1D3A8A] text-white rounded-xl font-medium">
              Page {pageState} of {totalPages}
      </div>
            <button
              onClick={() => setPageState(p => Math.min(totalPages, p + 1))} 
              disabled={pageState === totalPages} 
              className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              → Next
            </button>
          </div>
        )}

        {/* Enhanced Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#1D3A8A] to-[#2563eb] p-6 rounded-t-3xl text-white">
                <button
                  className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200"
                  onClick={() => setSelectedBooking(null)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
                <p className="text-white/90 text-sm">Complete information about your reservation</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Booking ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">#{selectedBooking.id}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Service ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">#{selectedBooking.serviceId}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <span className="mr-2">📅</span>
                    Schedule Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Date:</span>
                      <span className="font-semibold text-blue-900">{format(new Date(selectedBooking.date), 'PPP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Start Time:</span>
                      <span className="font-semibold text-blue-900">{selectedBooking.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Duration:</span>
                      <span className="font-semibold text-blue-900">{selectedBooking.duration} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                    <span className="mr-2">💰</span>
                    Booking Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Number of Seats:</span>
                      <span className="font-semibold text-green-900">{selectedBooking.numSeats}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-green-200">
                      <span className="text-green-700 font-medium">Total Price:</span>
                      <span className="font-bold text-green-900 text-lg">₦{selectedBooking.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">ℹ️</span>
                    Status & Timeline
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                        <span className="mr-1">{getStatusIcon(selectedBooking.status)}</span>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-semibold text-gray-900">{format(new Date(selectedBooking.createdAt), 'PPP p')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-semibold text-gray-900">{format(new Date(selectedBooking.updatedAt), 'PPP p')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button in Modal */}
                <div className="pt-4 border-t border-gray-100">
                  <button 
                    className="w-full bg-[#1D3A8A] hover:bg-[#214cc3] text-white  font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                    onClick={() => handleDownloadReceipt(selectedBooking)}
                  >
                    📄 Download Receipt
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
    </UserLayout>
  );
};

export default UserBookingHistory; 