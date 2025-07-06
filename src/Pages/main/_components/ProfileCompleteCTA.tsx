import React from 'react'
// Import the image
import ProfileCompleteImg from '../../assets/ProfileCompleteCTA.jpg'
import { useNavigate } from 'react-router-dom'

const ProfileCompleteCTA = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-[#1D3A8A] to-[#214cc3] rounded-xl p-6 mb-8 text-white">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0 flex justify-center sm:block">
          <img
            src="/ProfileCompleteCTA.jpg"
            alt="Complete Profile"
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl object-cover shadow-lg border-4 border-white bg-white"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
          <p className="text-blue-100 mb-4">
            Help us personalize your experience by completing your profile. 
            This will help us recommend the best workspaces for you.
          </p>
          <button onClick={() => navigate('/profile')} className="bg-white text-[#1D3A8A] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompleteCTA
