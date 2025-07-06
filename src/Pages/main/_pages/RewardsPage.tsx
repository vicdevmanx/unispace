import React from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Star, Gift, Trophy, Award, TrendingUp, Calendar, User } from 'lucide-react';
import UserLayout from '../_components/UserLayout';

const RewardsPage = () => {
  const { user, loading } = useAuthContext();

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
          <p className="text-gray-600 mb-6">Please log in to access your rewards</p>
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

  return (
    <UserLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Rewards & Points
          </h1>
          <p className="text-gray-600">
            Earn points by booking workspaces and unlock amazing rewards.
          </p>
        </div>

        {/* Points Summary */}
        <div className="bg-gradient-to-r from-[#1D3A8A] to-[#214cc3] rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
              <p className="text-blue-100">Keep earning to unlock more rewards!</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{user.points || 0}</div>
              <div className="text-blue-100">Points</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">{user.points || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{user.streak || 0} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leaderboard Rank</p>
                <p className="text-2xl font-bold text-gray-900">#{user.leaderboardRank || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1D3A8A] transition">
              <div className="flex items-center mb-3">
                <Gift className="h-6 w-6 text-[#1D3A8A] mr-2" />
                <h3 className="font-medium text-gray-900">Free Hour</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Get 1 free hour of workspace usage</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1D3A8A]">100 points</span>
                <button className="bg-[#1D3A8A] text-white px-3 py-1 rounded text-sm hover:bg-[#214cc3] transition">
                  Redeem
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1D3A8A] transition">
              <div className="flex items-center mb-3">
                <Award className="h-6 w-6 text-[#1D3A8A] mr-2" />
                <h3 className="font-medium text-gray-900">Premium Upgrade</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Upgrade to premium for 1 day</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1D3A8A]">500 points</span>
                <button className="bg-[#1D3A8A] text-white px-3 py-1 rounded text-sm hover:bg-[#214cc3] transition">
                  Redeem
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1D3A8A] transition">
              <div className="flex items-center mb-3">
                <Star className="h-6 w-6 text-[#1D3A8A] mr-2" />
                <h3 className="font-medium text-gray-900">VIP Access</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Access to exclusive VIP workspaces</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1D3A8A]">1000 points</span>
                <button className="bg-[#1D3A8A] text-white px-3 py-1 rounded text-sm hover:bg-[#214cc3] transition">
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How to Earn */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-[#1D3A8A]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Book Workspaces</h3>
                <p className="text-sm text-gray-600">Earn 10 points for every hour booked</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Daily Streak</h3>
                <p className="text-sm text-gray-600">Earn bonus points for consecutive days</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Refer Friends</h3>
                <p className="text-sm text-gray-600">Earn 50 points for each friend who joins</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Leave Reviews</h3>
                <p className="text-sm text-gray-600">Earn 5 points for each review</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </UserLayout>
  );
};

export default RewardsPage; 