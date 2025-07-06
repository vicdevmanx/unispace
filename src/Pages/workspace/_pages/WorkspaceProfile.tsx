import React, { useState } from 'react';
import { toast } from 'sonner';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';

const WorkspaceProfile = () => {
  const { workspace, loading, error, updateWorkspaceProfile, updateWorkspacePassword } = useWorkspacePortalContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [form, setForm] = useState({
    name: workspace?.name || '',
    email: workspace?.email || '',
    phoneNumber: workspace?.phoneNumber || '',
    address: workspace?.address || '',
    image: workspace?.image || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (workspace) {
      setForm({
        name: workspace.name,
        email: workspace.email,
        phoneNumber: workspace.phoneNumber,
        address: workspace.address,
        image: workspace.image,
      });
    }
  }, [workspace]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id) return;
    
    setSaving(true);
    
    try {
      let imageUrl = form.image;
      
      // Upload image to Cloudinary if a new image was selected
      if (imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast.error('Failed to upload image. Please try again.');
          setSaving(false);
          return;
        }
      }

      // Update workspace profile in Firebase
      await updateWorkspaceProfile(workspace.id, {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        image: imageUrl,
      });

      // Update local state
      setForm(prev => ({ ...prev, image: imageUrl }));
      setImageFile(null);
      setImagePreview(null);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      setSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      setSaving(false);
      return;
    }

    try {
      await updateWorkspacePassword(passwordForm.newPassword);
      toast.success('Password updated successfully!');
      setPasswordForm({
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!workspace) return <div className="h-screen flex items-center justify-center text-red-500">Workspace not found or not logged in.</div>;

  return (
    <WorkspaceLayout>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1D3A8A] mb-6">Workspace Settings</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#1D3A8A] text-[#1D3A8A]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-[#1D3A8A] text-[#1D3A8A]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Password
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div>
            <div className="flex flex-col items-center mb-6">
              <img
                src={imagePreview || form.image || '/unispace_logo.svg'}
                alt={form.name}
                className="w-24 h-24 rounded-full object-cover mb-2 border-4 border-[#1D3A8A]"
              />
              {editMode && (
                <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
              )}
            </div>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <label className="font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                disabled={!editMode}
                required
              />
              <label className="font-medium">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                disabled={!editMode}
                required
              />
              <label className="font-medium">Phone Number</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                disabled={!editMode}
                required
              />
              <label className="font-medium">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                disabled={!editMode}
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      className="bg-gray-200 text-[#1D3A8A] font-semibold py-2 px-4 rounded"
                      onClick={() => {
                        setEditMode(false);
                        setImageFile(null);
                        setImagePreview(null);
                        if (workspace) {
                          setForm({
                            name: workspace.name,
                            email: workspace.email,
                            phoneNumber: workspace.phoneNumber,
                            address: workspace.address,
                            image: workspace.image,
                          });
                        }
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Settings
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div>
            <h2 className="text-xl font-bold text-[#1D3A8A] mb-6">Change Password</h2>
            {!showPasswordForm ? (
              <button
                type="button"
                className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            ) : (
              <form className="grid grid-cols-1 gap-4" onSubmit={handlePasswordSubmit}>
                <label className="font-medium">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="border rounded px-4 py-2"
                  required
                  minLength={6}
                />
                <label className="font-medium">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="border rounded px-4 py-2"
                  required
                  minLength={6}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="bg-gray-200 text-[#1D3A8A] font-semibold py-2 px-4 rounded"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded"
                    disabled={saving}
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceProfile; 