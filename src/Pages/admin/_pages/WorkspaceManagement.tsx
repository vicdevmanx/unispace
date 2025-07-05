import React, { useEffect, useState } from 'react';
import AdminLayout from '../_components/AdminLayout';
import { useWorkspace } from '../../../hooks/useWorkspace';
import { useWorkspaceServices } from '../../../hooks/useWorkspaceServices';
import { generatePassword } from '../../../utils/password';
import { sendWorkspaceCredentials } from '../../../utils/ZeptoMail';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/Firebase';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phoneNumber: '',
  brandLogo: null as File | null,
  cacDocument: null as File | null,
  cacNumber: '',
  address: '',
};

const WorkspaceManagement = () => {
  const {
    workspaces,
    loading,
    error,
    // createWorkspace,
    listWorkspaces,
    deleteWorkspace,
    toggleWorkspaceVisibility,
    getWorkspaceById,
  } = useWorkspace();
  const [form, setForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string | null>(null);
  const [cacDocumentPreview, setCacDocumentPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    listWorkspaces();
  }, []);

  // Fetch services for selected workspace when dialog opens
  useEffect(() => {
    const fetchServices = async () => {
      if (showViewDialog && selectedWorkspace?.id) {
        setServicesLoading(true);
        setServicesError(null);
        try {
          const { collection, getDocs } = await import('firebase/firestore');
          const snapshot = await getDocs(collection(db, 'workspaces', selectedWorkspace.id, 'services'));
          setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err: any) {
          setServicesError(err.message || 'Failed to fetch services');
        } finally {
          setServicesLoading(false);
        }
      } else {
        setServices([]);
      }
    };
    fetchServices();
  }, [showViewDialog, selectedWorkspace]);

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
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGeneratePassword = () => {
    const password = generatePassword();
    setForm((prev) => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brandLogo) return;
    setCreating(true);

    // 1. Create workspace (pass password to backend/Firebase)
    // await createWorkspace({ ...form, password: form.password, imageFile: form.imageFile! });

    // (Serverless function call for ZeptoMail removed)
    // If you want to send email, call your utility or backend here

    setForm(initialForm);
    setBrandLogoPreview(null);
    setCacDocumentPreview(null);
    setCreating(false);
    setShowDialog(false);
    listWorkspaces();
  };

  const handleView = async (ws: any) => {
    const workspace = await getWorkspaceById(ws.id);
    setSelectedWorkspace(workspace);
    setShowViewDialog(true);
  };

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    await toggleWorkspaceVisibility(id, !currentVisible);
    listWorkspaces();
  };

  const handleDelete = async (id: string) => {
    await deleteWorkspace(id);
    listWorkspaces();
  };

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, 'workspaces', id), { approved: true });
    listWorkspaces();
  };

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1D3A8A]">Workspace Management</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Workspaces</h2>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : workspaces.length === 0 ? (
          <div className="text-[#4B5563]">No workspaces yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>CAC Number</th>
                  <th>Brand Logo</th>
                  <th>CAC Document</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.map((ws) => (
                  <tr key={ws.id} className="border-b hover:bg-[#F3F4F6]">
                    <td className="py-2 font-semibold">{ws.name}</td>
                    <td>{ws.email}</td>
                    <td>{ws.phoneNumber}</td>
                    <td>{ws.address}</td>
                    <td>{ws.cacNumber}</td>
                    <td>
                      {ws.brandLogo && <img src={ws.brandLogo} alt={ws.name + ' logo'} className="w-12 h-12 object-cover rounded" />}
                    </td>
                    <td>
                      {ws.cacDocument && <a href={ws.cacDocument} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>}
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${ws.visible !== false ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {ws.visible !== false ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${(ws as any).approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {(ws as any).approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="flex gap-2 py-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleView(ws)}
                      >
                        View
                      </button>
                      <button
                        className="text-yellow-600 hover:underline"
                        onClick={() => handleToggleVisibility(ws.id, ws.visible !== false)}
                      >
                        {ws.visible !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(ws.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                      {!(ws as any).approved && (
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => handleApprove(ws.id)}
                          disabled={loading}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* View Workspace Dialog */}
      {showViewDialog && selectedWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowViewDialog(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#1D3A8A]">Workspace Details</h2>
            {selectedWorkspace.brandLogo && (
              <img src={selectedWorkspace.brandLogo} alt={selectedWorkspace.name + ' logo'} className="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-[#1D3A8A]" />
            )}
            <div className="mb-2"><span className="font-semibold">Name:</span> {selectedWorkspace.name}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {selectedWorkspace.email}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {selectedWorkspace.phoneNumber}</div>
            <div className="mb-2"><span className="font-semibold">Address:</span> {selectedWorkspace.address}</div>
            <div className="mb-2"><span className="font-semibold">CAC Number:</span> {selectedWorkspace.cacNumber}</div>
            <div className="mb-2"><span className="font-semibold">CAC Document:</span> {selectedWorkspace.cacDocument && (
              <a href={selectedWorkspace.cacDocument} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Document</a>
            )}</div>
            {/* List services here */}
            <div className="mt-4 text-[#4B5563]">
              <span className="font-semibold">Services:</span>
              {servicesLoading ? (
                <div className="italic">Loading services...</div>
              ) : servicesError ? (
                <div className="text-red-500 italic">{servicesError}</div>
              ) : services.length === 0 ? (
                <span className="italic ml-2">No services found.</span>
              ) : (
                <table className="w-full mt-2 text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.name}</td>
                        <td>{service.type}</td>
                        <td>{service.capacity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
    </div>
      )}
    </AdminLayout>
  );
};

export default WorkspaceManagement; 