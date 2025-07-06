import React, { useState } from 'react';
import { Service } from '../../../types/Workspace';

const durationUnits = ['Minutes', 'Hour', 'Day', 'Week', 'Month', 'Year'];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialForm: Partial<Service> & { durationUnit?: string } = {
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
  durationUnit: '',
};

interface ServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const steps = [
  'Basic Info',
  'Capacity & Contact',
  'Duration & Charges',
  'Working Days & Time',
  'Features & Description',
  'Images',
];

const ServiceDialog: React.FC<ServiceDialogProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'features') {
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

  const handleDayToggle = (day: string) => {
    setForm((prev) => {
      const days = prev.workingDays || [];
      return {
        ...prev,
        workingDays: days.includes(day)
          ? days.filter((d: string) => d !== day)
          : [...days, day],
      };
    });
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) {
      handleNext();
      return;
    }
    onSubmit({ ...form, images: imageFiles });
    setForm(initialForm);
    setImageFiles([]);
    setImagePreviews([]);
    setStep(0);
  };

  if (!open) return null;

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
        <h2 className="text-2xl font-bold mb-4 text-[#1D3A8A] text-center">Add New Service</h2>
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6 w-full overflow-x-auto">
          {steps.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center min-w-[70px]">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mb-1 border-2 transition-all duration-200 ${
                step === idx
                  ? 'bg-[#1D3A8A] text-white border-[#1D3A8A] scale-110'
                  : step > idx
                  ? 'bg-[#1D3A8A]/80 text-white border-[#1D3A8A]/80'
                  : 'bg-gray-200 text-[#1D3A8A] border-gray-300'
              }`}>{idx + 1}</div>
              <span className={`text-xs text-center ${step === idx ? 'text-[#1D3A8A]' : 'text-gray-500'}`}>{label}</span>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-full ${step > idx ? 'bg-[#1D3A8A]' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Service Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. Meeting Room 1" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Type</label>
                <input name="type" value={form.type} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. room, seat" required />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Service Address" required />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Geo Address <span className="text-xs text-gray-500">(Google Maps link, optional)</span></label>
                <input name="geoAddress" value={form.geoAddress} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Paste Google Maps link here" />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Capacity</label>
                <input name="capacity" value={form.capacity} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. 10" type="number" min={1} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Contact Line</label>
                <input name="contactLine" value={form.contactLine} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. 08012345678" required />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Min Duration <span className="text-xs text-gray-500">(minimum)</span></label>
                <input name="minDuration" value={form.minDuration} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. 30" type="number" min={1} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Max Duration <span className="text-xs text-gray-500">(maximum)</span></label>
                <input name="maxDuration" value={form.maxDuration} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. 240" type="number" min={1} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Duration Unit</label>
                <select name="durationUnit" value={form.durationUnit} onChange={handleChange} className="border rounded px-4 py-2 w-full">
                  {durationUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Min Charge (₦) <span className="text-xs text-gray-500">(minimum)</span></label>
                <input name="minCharge" value={form.minCharge} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. 1000" type="number" min={0} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Max Charge (₦) <span className="text-xs text-gray-500">(maximum)</span></label>
                <input name="maxCharge" value={form.maxCharge} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. 5000" type="number" min={0} required />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Working Days</label>
                <div className="relative">
                  <button
                    type="button"
                    className="border rounded px-4 py-2 w-full text-left flex justify-between items-center"
                    onClick={() => setShowDaysDropdown((v) => !v)}
                  >
                    {form.workingDays && form.workingDays.length > 0
                      ? (form.workingDays as string[]).join(', ')
                      : 'Select working days'}
                    <span className="ml-2">▼</span>
                  </button>
                  {showDaysDropdown && (
                    <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 p-2 flex flex-col gap-1">
                      {weekDays.map(day => (
                        <label key={day} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Array.isArray(form.workingDays) && form.workingDays.includes(day)}
                            onChange={() => handleDayToggle(day)}
                          />
                          <span>{day}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">Choose one or more days</span>
              </div>
              <div>
                <label className="block font-medium mb-1">Working Time</label>
                <div className="flex gap-2">
                  <input name="workingTime.start" value={form.workingTime?.start || ''} onChange={e => handleWorkingTimeChange('start', e.target.value)} className="border rounded px-4 py-2 w-full" placeholder="Start Time" type="time" />
                  <input name="workingTime.end" value={form.workingTime?.end || ''} onChange={e => handleWorkingTimeChange('end', e.target.value)} className="border rounded px-4 py-2 w-full" placeholder="End Time" type="time" />
                </div>
                <span className="text-xs text-gray-500">e.g. 08:00 - 18:00</span>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Features <span className="text-xs text-gray-500">(comma separated)</span></label>
                <input name="features" value={form.features} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. Projector, Whiteboard, WiFi" />
                <span className="text-xs text-gray-500">Example: Projector, Whiteboard, WiFi</span>
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="Describe the service, amenities, etc." />
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <label className="block font-medium mb-1">Images</label>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
              <div className="flex gap-2 mt-2 flex-wrap">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                ))}
              </div>
              <span className="text-xs text-gray-500">Upload one or more images (jpg, png, etc.)</span>
            </div>
          )}
          <div className="flex justify-between gap-2 pt-6 flex-wrap">
            {step > 0 && (
              <button type="button" className="bg-gray-200 text-[#1D3A8A] font-semibold py-2 px-4 rounded" onClick={handleBack}>
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded">
                Next
              </button>
            ) : (
              <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded">
                Save Service
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceDialog; 