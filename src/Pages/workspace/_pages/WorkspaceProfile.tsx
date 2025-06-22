import React, { useState } from 'react';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';

const WorkspaceProfile = () => {
  const { workspace, loading, error } = useWorkspacePortalContext();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: workspace?.name || '',
    email: workspace?.email || '',
    phoneNumber: workspace?.phoneNumber || '',
    address: workspace?.address || '',
    image: workspace?.image || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    // TODO: Upload image to Cloudinary if changed, then update Firestore
    // Placeholder for update logic
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
    }, 1000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!workspace) return <div className="h-screen flex items-center justify-center text-red-500">Workspace not found or not logged in.</div>;

  return (
    <WorkspaceLayout>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1D3A8A] mb-6">Workspace Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <img
            src={imagePreview || form.image}
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
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex justify-end gap-2 mt-4">
            {editMode ? (
              <>
                <button
                  type="button"
                  className="bg-gray-200 text-[#1D3A8A] font-semibold py-2 px-4 rounded"
                  onClick={() => setEditMode(false)}
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
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceProfile; 