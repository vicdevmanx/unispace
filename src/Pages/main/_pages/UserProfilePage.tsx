import React, { useRef, useState, useEffect } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { User, Mail, Phone, Briefcase, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';
import UserLayout from '../_components/UserLayout';
import { useUser } from '../../../hooks/useUser';

function formatDate(date: string | { toDate: () => Date } | undefined): string {
  if (!date) return "N/A";
  
  let jsDate: Date;
  if (typeof date === "string") {
    jsDate = new Date(date);
  } else if (date && typeof date.toDate === "function") {
    jsDate = date.toDate();
  } else {
    return "N/A";
  }
  return jsDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

const UserProfilePage = () => {
  const { user, refreshUser } = useAuthContext();
  const { updateUser, loading, error } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    occupation: user?.occupation || '',
    bio: user?.bio || '',
    photoURL: user?.photoURL || '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setForm({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        occupation: user.occupation || '',
        bio: user.bio || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to UniSpace</h1>
          <p className="text-gray-600 mb-6">Please log in to access your profile</p>
          <a
            href="/login"
            className="bg-[#1D3A8A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#214cc3] transition inline-block"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      await updateUser(form, selectedImage || undefined);
      // Refresh user data from Firestore to update the context
      await refreshUser();
      setIsEditing(false);
      setSelectedImage(null);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
     setIsEditing(false);
    // ✅ Reset form back to original user data
    setForm({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      occupation: user.occupation || '',
      bio: user.bio || '',
      photoURL: user.photoURL || '',
    });
    setSelectedImage(null); // ✅ Also clear image if changed setIsEditing(false);
    // ✅ Reset form back to original user data
    setForm({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      occupation: user.occupation || '',
      bio: user.bio || '',
      photoURL: user.photoURL || '',
    });
    setSelectedImage(null); // ✅ Also clear image if changed
  }

  const getInitials = (firstname = '', lastname = '') => {
    return (firstname[0] || '').toUpperCase() + (lastname[0] || '').toUpperCase();
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    // Show preview immediately
    setForm(prev => ({ ...prev, photoURL: URL.createObjectURL(file) }));
  };

  return (
    <UserLayout>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your account settings and personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative self-center sm:self-auto">
                {form.photoURL ? (
                  <img
                    src={form.photoURL}
                    alt="Profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#1D3A8A] bg-white"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1D3A8A] rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                    {getInitials(user.firstname, user.lastname)}
                  </div>
                )}
                <button
                  className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                  onClick={handleImageClick}
                  disabled={!isEditing || uploading}
                  title={isEditing ? 'Change profile photo' : 'Edit to change photo'}
                >
                  {uploading ? (
                    <span className="w-3 h-3 sm:w-4 sm:h-4 block animate-spin border-2 border-[#1D3A8A] border-t-transparent rounded-full"></span>
                  ) : (
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  )}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={!isEditing || uploading}
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {user.firstname} {user.lastname}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#1D3A8A] text-white px-4 py-2 rounded-lg hover:bg-[#214cc3] transition flex items-center justify-center space-x-2 w-full sm:w-auto"
              disabled={uploading}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                 <button
                onClick={handleSave}
                className=" bg-[#1D3A8A] text-white rounded-lg hover:bg-[#214cc3] transition w-full sm:w-auto"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1D3A8A] focus:border-[#1D3A8A] disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1D3A8A] focus:border-[#1D3A8A] disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm sm:text-base"
                />
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1D3A8A] focus:border-[#1D3A8A] disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
                />
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1D3A8A] focus:border-[#1D3A8A] disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
                />
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1D3A8A] focus:border-[#1D3A8A] disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#1D3A8A] text-white rounded-lg hover:bg-[#214cc3] transition w-full sm:w-auto"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-[#1D3A8A]" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">{user.bookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Profile Complete</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">
                  {user.firstname && user.lastname && user.phoneNumber && user.occupation ? '100%' : '75%'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </UserLayout>
  );
};

export default UserProfilePage; 