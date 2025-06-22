import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspacePortalContext } from '../../../../contexts/WorkspacePortalContext';
import { uploadImageToCloudinary } from '../../../../utils/cloudinary';
import { getAuth, signOut } from 'firebase/auth';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phoneNumber: '',
  address: '',
  imageFile: null as File | null,
};

const WorkspaceRegister: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, loading, error } = useWorkspacePortalContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === 'imageFile' && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must be less than 5MB');
        setForm((prev) => ({ ...prev, imageFile: null }));
        setImagePreview(null);
        return;
      }
      setFormError(null);
      setForm((prev) => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    let imageUrl = '';
    try {
      if (form.imageFile) {
        imageUrl = await uploadImageToCloudinary(form.imageFile);
      }
      const ok = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        address: form.address,
        image: imageUrl,
      });
      if (ok) {
        setForm(initialForm);
        setImagePreview(null);
        setSubmitting(false);
        await signOut(getAuth());
        navigate('/workspace/login');
      } else {
        setSubmitting(false);
      }
    } catch (err: any) {
      setFormError(err.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] relative">
      {/* Loader overlay */}
      {(loading || submitting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-[#1D3A8A] rounded-full animate-spin"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1D3A8A]">Workspace Registration</h2>
        <input name="name" value={form.name} onChange={handleChange} className="border rounded px-4 py-2 mb-3 w-full" placeholder="Workspace Name" required />
        <input name="email" value={form.email} onChange={handleChange} className="border rounded px-4 py-2 mb-3 w-full" placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleChange} className="border rounded px-4 py-2 mb-3 w-full" placeholder="Password" type="password" required />
        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="border rounded px-4 py-2 mb-3 w-full" placeholder="Phone Number" required />
        <input name="imageFile" onChange={handleChange} className="border rounded px-4 py-2 mb-3 w-full" type="file" accept="image/*" />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded mx-auto border-2 border-[#1D3A8A] mb-2" />
        )}
        <textarea name="address" value={form.address} onChange={handleChange} className="border rounded px-4 py-2 mb-3 w-full" placeholder="Address" required />
        {(formError || error) && <div className="text-red-500 text-sm mb-2">{formError || error}</div>}
        <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 rounded w-full" disabled={loading || submitting}>
          {(loading || submitting) ? 'Registering...' : 'Register'}
        </button>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/workspace/login" className="text-[#1D3A8A] underline">Login</a>
        </div>
      </form>
    </div>
  );
};

export default WorkspaceRegister; 