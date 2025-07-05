import React from 'react';
import { Service } from '../../../types/Workspace';

interface WorkspaceServiceViewDialogProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
}

const WorkspaceServiceViewDialog: React.FC<WorkspaceServiceViewDialogProps> = ({ open, onClose, service }) => {
  if (!open || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full max-w-2xl relative flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#1D3A8A] text-center">Service Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Name:</span> {service.name}
            </div>
            <div>
              <span className="font-medium">Type:</span> {service.type}
            </div>
            <div>
              <span className="font-medium">Address:</span> {service.address}
            </div>
            <div>
              <span className="font-medium">Geo Address:</span> {service.geoAddress}
            </div>
            <div>
              <span className="font-medium">Capacity:</span> {service.capacity}
            </div>
            <div>
              <span className="font-medium">Contact Line:</span> {service.contactLine}
            </div>
            <div>
              <span className="font-medium">Min Duration:</span> {service.minDuration} min
            </div>
            <div>
              <span className="font-medium">Max Duration:</span> {service.maxDuration} min
            </div>
            <div>
              <span className="font-medium">Min Charge:</span> ₦{service.minCharge}
            </div>
            <div>
              <span className="font-medium">Max Charge:</span> ₦{service.maxCharge}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Working Days:</span> {service.workingDays?.join(', ')}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Working Time:</span> {service.workingTime?.start} - {service.workingTime?.end}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Features:</span> {service.features?.join(', ')}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Description:</span> {service.description}
            </div>
            {service.images && service.images.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium">Images:</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {service.images.map((img, idx) => (
                    typeof img === 'string' ? (
                      <img key={idx} src={img} alt="Service" className="w-16 h-16 object-cover rounded border" />
                    ) : null
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceServiceViewDialog; 