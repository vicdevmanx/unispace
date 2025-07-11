import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { User, CheckCircle, User as UserIcon, Calendar, Star, Award } from 'lucide-react';
import UserProfileDropdown from '../_components/UserProfileDorpdown';
import UserLayout from '../_components/UserLayout';
import ProfileCompleteCTA from '../_components/ProfileCompleteCTA';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../../hooks/useBooking';
import CurrentBookings from '../_components/CurrentBookings';

const UserHome = () => {
  const { user, loading } = useAuthContext();
  const { getUserCurrentBookings, getUserAllBookings } = useBooking();
  const [currentBookings, setCurrentBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.uid) {
        setBookingsLoading(true);
        const bookings = await getUserCurrentBookings(user.uid);
        setCurrentBookings(bookings);
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, [user?.uid]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      if (user?.uid) {
        const bookings = await getUserAllBookings(user.uid);
        setAllBookings(bookings);
      }
    };
    fetchAllBookings();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A8A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to UniSpace</h1>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
          <a
            href="/login"
            className="bg-[#1D3A8A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#214cc3] transition"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  const isProfileComplete = user.firstname && user.lastname && user.phoneNumber && user.occupation && user.bio;
  // && user.photoURL

  return (
    <UserLayout>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-5 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <br className='md:hidden' /> {user.firstname || 'there'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to find your perfect workspace? Let's get you set up.
          </p>
        </div>

        {/* Profile Completion CTA */}
        {!isProfileComplete && (
          <ProfileCompleteCTA/>
        )}

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-[#1D3A8A]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{allBookings.length}</p>
              </div>
            </div> 
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border relative">
            <span className="absolute top-4 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">Coming Soon</span>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">{user.points || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border relative">
            <span className="absolute top-4 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">Coming Soon</span>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{user.streak || 0} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Bookings */}
        <CurrentBookings
          bookings={currentBookings}
          loading={bookingsLoading}
          onBookingDeleted={bookingId => setCurrentBookings(currentBookings.filter(b => b.id !== bookingId))}
        />
      </main>
    </UserLayout>
  );
};

export default UserHome; 