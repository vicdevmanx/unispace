import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspacePortalContext } from '../../../../contexts/WorkspacePortalContext';
import { uploadImageToCloudinary } from '../../../../utils/cloudinary';
import { getAuth, signOut } from 'firebase/auth';
import Cookies from 'js-cookie';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phoneNumber: '',
  address: '',
  cacNumber: '',
  brandLogo: null as File | null,
  cacDocument: null as File | null,
};

const WorkspaceRegister: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string | null>(null);
  const [cacDocumentPreview, setCacDocumentPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { register, loading, error } = useWorkspacePortalContext();

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password || !form.phoneNumber || !form.address) {
      setFormError('Please fill in all required fields.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!form.cacNumber || !form.brandLogo || !form.cacDocument) {
      setFormError('Please provide CAC number, brand logo, and CAC document.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if ((name === 'brandLogo' || name === 'cacDocument') && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must be less than 5MB');
        setForm((prev) => ({ ...prev, [name]: null }));
        if (name === 'brandLogo') setBrandLogoPreview(null);
        if (name === 'cacDocument') setCacDocumentPreview(null);
        return;
      }
      setFormError(null);
      setForm((prev) => ({ ...prev, [name]: file }));
      if (name === 'brandLogo') setBrandLogoPreview(URL.createObjectURL(file));
      if (name === 'cacDocument') setCacDocumentPreview(URL.createObjectURL(file));
    } else if (name === 'imageFile') {
      // deprecated, ignore
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setFormError(null);
    setSubmitting(true);
    let brandLogoUrl = '';
    let cacDocumentUrl = '';
    try {
      if (form.brandLogo) {
        brandLogoUrl = await uploadImageToCloudinary(form.brandLogo);
      }
      if (form.cacDocument) {
        cacDocumentUrl = await uploadImageToCloudinary(form.cacDocument);
      }
      const ok = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        address: form.address,
        cacNumber: form.cacNumber,
        brandLogo: brandLogoUrl,
        cacDocument: cacDocumentUrl,
      });
      if (ok) {
        setForm(initialForm);
        setBrandLogoPreview(null);
        setCacDocumentPreview(null);
        await signOut(getAuth());
        Cookies.remove('unispace_session');
        setSubmitting(false);
        setTimeout(() => navigate('/workspace/login'), 10);
      } else {
        setSubmitting(false);
      }
    } catch (err: any) {
      setFormError(err.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] relative px-2 sm:px-4">
      {/* Loader overlay */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-[#1D3A8A] rounded-full animate-spin"></div>
        </div>
      )}
      <form
        onSubmit={step === 1 ? handleNext : handleSubmit}
        className="bg-white p-4 sm:p-8 rounded-xl shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl space-y-6"
      >
        <div className="flex justify-center mb-4">
          <img
            src='/unispace_logo.svg'
            alt="Unispace Logo"
            className="h-12 sm:h-16 w-auto"
            style={{ maxWidth: '180px' }}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2 sm:gap-0">
          <span className={`font-semibold ${step === 1 ? 'text-[#1D3A8A]' : 'text-gray-400'}`}>Step 1</span>
          <div className="w-full sm:w-8 h-1 bg-gray-200 mx-2 rounded-full flex-1">
            <div className={`h-1 rounded-full transition-all duration-300 ${step === 2 ? 'bg-[#1D3A8A] w-full' : 'bg-[#1D3A8A] w-1/2'}`}></div>
          </div>
          <span className={`font-semibold ${step === 2 ? 'text-[#1D3A8A]' : 'text-gray-400'}`}>Step 2</span>
        </div>
        {step === 1 && (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-[#1D3A8A]">Workspace Details</h2>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">Workspace Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Workspace Name" required />
            </div>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Email" type="email" required />
            </div>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">Password</label>
              <input name="password" value={form.password} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Password" type="password" required />
            </div>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">Phone Number</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Phone Number" required />
            </div>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Address" required />
            </div>
            {(formError || error) && <div className="text-red-500 text-sm mb-2">{formError || error}</div>}
            <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 rounded w-full" disabled={loading || submitting}>
              Next
            </button>
            <div className="mt-4 text-center text-sm">
              Already have an account? <a href="/workspace/login" className="text-[#1D3A8A] underline">Login</a>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-[#1D3A8A]">Verification & Branding</h2>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">CAC Number <span className="text-xs text-gray-500">(Corporate Affairs Commission)</span></label>
              <input name="cacNumber" value={form.cacNumber} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="CAC Number" required />
            </div>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">Brand Logo <span className="text-xs text-gray-500">(max 5MB)</span></label>
              <input name="brandLogo" onChange={handleChange} className="border rounded px-4 py-2 w-full" type="file" accept="image/*" />
              {brandLogoPreview && (
                <img src={brandLogoPreview} alt="Brand Logo Preview" className="w-24 h-24 object-cover rounded mx-auto border-2 border-[#1D3A8A] mb-2" />
              )}
            </div>
            <div className="space-y-3">
              <label className="block font-semibold text-[#1D3A8A]">CAC Document Image <span className="text-xs text-gray-500">(max 5MB, upload your CAC certificate)</span></label>
              <input name="cacDocument" onChange={handleChange} className="border rounded px-4 py-2 w-full" type="file" accept="image/*" />
              {cacDocumentPreview && (
                <img src={cacDocumentPreview} alt="CAC Document Preview" className="w-24 h-24 object-cover rounded mx-auto border-2 border-[#1D3A8A] mb-2" />
              )}
            </div>
            {(formError || error) && <div className="text-red-500 text-sm mb-2">{formError || error}</div>}
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleBack} className="bg-gray-200 text-[#1D3A8A] font-semibold py-2 rounded w-full sm:w-1/2" disabled={loading || submitting}>
                Back
              </button>
              <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 rounded w-full sm:w-1/2" disabled={loading || submitting}>
                {(loading || submitting) ? 'Registering...' : 'Register'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default WorkspaceRegister; 