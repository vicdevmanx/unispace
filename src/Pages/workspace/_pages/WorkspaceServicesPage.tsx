import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { Service } from '../../../types/Workspace';
import { useWorkspaceServices } from '../../../hooks/useWorkspaceServices';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';
import ServiceDialog from './ServiceDialog';
import { Eye, Trash2 } from 'lucide-react';
import WorkspaceServiceViewDialog from '../_components/WorkspaceServiceViewDialog';

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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

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

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
    try {
    await createService({ ...form, images: imageFiles });
    setForm(initialForm);
    setImageFiles([]);
    setImagePreviews([]);
    setShowDialog(false);
      toast.success('Service created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create service');
    }
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete.id);
        setServiceToDelete(null);
        setConfirmDeleteOpen(false);
        toast.success('Service deleted successfully!');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete service');
      }
    }
  };

  const handleCancelDelete = () => {
    setServiceToDelete(null);
    setConfirmDeleteOpen(false);
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
                          <button
                            className="text-blue-600 hover:text-blue-800 mr-2"
                            onClick={() => {
                              setSelectedService(service);
                              setViewDialogOpen(true);
                            }}
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(service)} disabled={loading} title="Delete">
                            <Trash2 size={18} />
                          </button>
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
          <ServiceDialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
            onSubmit={async (serviceData) => {
              await createService(serviceData);
              setShowDialog(false);
              listServices();
            }}
          />
        )}
        <WorkspaceServiceViewDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          service={selectedService}
        />
        {confirmDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm relative flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 text-[#1D3A8A]">Confirm Delete</h3>
              <p className="mb-6 text-center">Are you sure you want to delete <span className="font-semibold">{serviceToDelete?.name}</span>?</p>
              <div className="flex gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </WorkspaceLayout>
  );
};

export default WorkspaceServicesPage;
