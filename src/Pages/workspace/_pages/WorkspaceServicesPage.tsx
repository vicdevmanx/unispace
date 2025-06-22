import React, { useEffect, useState } from 'react';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { Service } from '../../../types/Workspace';
import { useWorkspaceServices } from '../../../hooks/useWorkspaceServices';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';

const initialForm: Partial<Service> = {
  name: '',
  address: '',
  geoAddress: '',
  workingDays: [],
  workingTime: { start: '', end: '' },
  capacity: 0,
  minDuration: 0,
  maxDuration: 0,
  minCharge: 0,
  maxCharge: 0,
  contactLine: '',
  features: [],
  type: '',
  description: '',
};

const WorkspaceServicesPage = () => {
  const { workspace } = useWorkspacePortalContext();
  const workspaceId = workspace?.id;

  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<Partial<Service>>(initialForm);
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    services,
    loading,
    error,
    listServices,
    createService,
    deleteService,
  } = useWorkspaceServices(workspaceId);

  useEffect(() => {
    listServices();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'workingDays' || name === 'features') {
      setForm((prev) => ({ ...prev, [name]: value.split(',').map(v => v.trim()) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleWorkingTimeChange = (field: 'start' | 'end', value: string) => {
    setForm((prev) => ({
      ...prev,
      workingTime: {
        start: field === 'start' ? value : prev.workingTime?.start || '',
        end: field === 'end' ? value : prev.workingTime?.end || '',
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      setImagePreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createService({ ...form, images: imageFiles });
    setForm(initialForm);
    setImageFiles([]);
    setImagePreviews([]);
    setShowDialog(false);
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
  };

  return (
    <WorkspaceLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1D3A8A]">Workspace Services</h1>
          <button
            className="bg-[#1D3A8A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#214cc3] transition"
            onClick={() => setShowDialog(true)}
          >
            + Add New Service
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">All Services</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Working Days</th>
                    <th>Working Time</th>
                    <th>Min Duration</th>
                    <th>Max Duration</th>
                    <th>Min Charge</th>
                    <th>Max Charge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center text-[#4B5563] py-4">No services yet. Add a new one above.</td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service.id} className="border-b hover:bg-[#F3F4F6]">
                        <td className="py-2 font-semibold">{service.name}</td>
                        <td>{service.type}</td>
                        <td>{service.capacity}</td>
                        <td>{service.workingDays?.join(', ')}</td>
                        <td>{service.workingTime?.start} - {service.workingTime?.end}</td>
                        <td>{service.minDuration} min</td>
                        <td>{service.maxDuration} min</td>
                        <td>₦{service.minCharge}</td>
                        <td>₦{service.maxCharge}</td>
                        <td>
                          <button className="text-red-500 hover:underline" onClick={() => handleDelete(service.id)} disabled={loading}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Add New Service Dialog */}
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowDialog(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-[#1D3A8A]">Add New Service</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Service Name" required />
                <input name="type" value={form.type} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Type (room, seat, etc.)" required />
                <input name="address" value={form.address} onChange={handleChange} className="border rounded px-4 py-2 md:col-span-2" placeholder="Address" required />
                <input name="geoAddress" value={form.geoAddress} onChange={handleChange} className="border rounded px-4 py-2 md:col-span-2" placeholder="Geo Address (Google Maps link)" />
                <input name="capacity" value={form.capacity} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Capacity" type="number" min={1} required />
                <input name="contactLine" value={form.contactLine} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Contact Line" required />
                <input name="minDuration" value={form.minDuration} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Min Duration (min)" type="number" min={1} required />
                <input name="maxDuration" value={form.maxDuration} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Max Duration (min)" type="number" min={1} required />
                <input name="minCharge" value={form.minCharge} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Min Charge (₦)" type="number" min={0} required />
                <input name="maxCharge" value={form.maxCharge} onChange={handleChange} className="border rounded px-4 py-2" placeholder="Max Charge (₦)" type="number" min={0} required />
                <input name="workingDays" value={form.workingDays} onChange={handleChange} className="border rounded px-4 py-2 md:col-span-2" placeholder="Working Days (comma separated)" />
                <div className="flex gap-2">
                  <input name="workingTime.start" value={form.workingTime?.start || ''} onChange={e => handleWorkingTimeChange('start', e.target.value)} className="border rounded px-4 py-2" placeholder="Start Time (e.g. 08:00)" type="time" />
                  <input name="workingTime.end" value={form.workingTime?.end || ''} onChange={e => handleWorkingTimeChange('end', e.target.value)} className="border rounded px-4 py-2" placeholder="End Time (e.g. 18:00)" type="time" />
                </div>
                <input name="features" value={form.features} onChange={handleChange} className="border rounded px-4 py-2 md:col-span-2" placeholder="Features (comma separated)" />
                <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-4 py-2 md:col-span-2" placeholder="Description" />
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Images</label>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {imagePreviews.map((src, idx) => (
                      <img key={idx} src={src} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="button" className="bg-gray-200 text-[#1D3A8A] font-semibold py-2 px-4 rounded mr-2" onClick={() => setShowDialog(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </WorkspaceLayout>
  );
};

export default WorkspaceServicesPage;
