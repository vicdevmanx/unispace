import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { Pencil, Trash2 } from 'lucide-react';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';

interface Discount {
  id: string;
  code: string;
  percentage: number;
  expiry: string;
  usageLimit: number;
}

const initialForm = {
  code: '',
  percentage: 0,
  expiry: '',
  usageLimit: 1,
};

const WorkspaceDiscountsPage = () => {
  const { workspace, getDiscounts, addDiscount, updateDiscount, deleteDiscount } = useWorkspacePortalContext();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspace?.id) return;
    setLoading(true);
    getDiscounts(workspace.id)
      .then((data: Discount[]) => setDiscounts(data))
      .catch((error: any) => {
        toast.error(error.message || 'Failed to load discounts');
      })
      .finally(() => setLoading(false));
  }, [workspace?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'percentage' || name === 'usageLimit' ? Number(value) : value }));
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id) return;
    setLoading(true);
    try {
      if (editId) {
        await updateDiscount(workspace.id, editId, form);
        setDiscounts((prev) => prev.map((d) => d.id === editId ? { ...form, id: editId } : d));
        toast.success('Discount updated successfully!');
      } else {
        const newDiscount = await addDiscount(workspace.id, form);
        setDiscounts((prev) => [...prev, newDiscount]);
        toast.success('Discount added successfully!');
      }
      setForm(initialForm);
      setShowForm(false);
      setEditId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save discount');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (discount: Discount) => {
    setForm({ ...discount });
    setEditId(discount.id);
    setShowForm(true);
  };

  const handleDeleteClick = (discount: Discount) => {
    setDiscountToDelete(discount);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!workspace?.id || !discountToDelete) return;
    setLoading(true);
    try {
      await deleteDiscount(workspace.id, discountToDelete.id);
      setDiscounts((prev) => prev.filter((d) => d.id !== discountToDelete.id));
      setDiscountToDelete(null);
      setConfirmDeleteOpen(false);
      toast.success('Discount deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete discount');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDiscountToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, code }));
  };

  return (
    <WorkspaceLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1D3A8A]">Discount Codes</h1>
        <button
          className="bg-[#1D3A8A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#214cc3] transition"
          onClick={() => { setShowForm(true); setForm(initialForm); setEditId(null); }}
        >
          + Add Discount
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">All Discounts</h2>
        {loading ? (
          <div className="text-center text-[#4B5563] py-4">Loading...</div>
        ) : discounts.length === 0 ? (
          <div className="text-center text-[#4B5563] py-4">No discounts yet. Add a new one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Code</th>
                  <th>Percentage</th>
                  <th>Expiry</th>
                  <th>Usage Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount.id} className="border-b hover:bg-[#F3F4F6]">
                    <td className="py-2 font-semibold">{discount.code}</td>
                    <td>{discount.percentage}%</td>
                    <td>{discount.expiry}</td>
                    <td>{discount.usageLimit}</td>
                    <td className="flex gap-6 items-center py-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                        onClick={() => handleEdit(discount)}
                        disabled={loading}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                        onClick={() => handleDeleteClick(discount)}
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Add/Edit Discount Form Dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full max-w-md relative flex flex-col">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setShowForm(false); setEditId(null); setForm(initialForm); }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#1D3A8A] text-center">{editId ? 'Edit Discount' : 'Add Discount'}</h2>
            <form onSubmit={handleAddDiscount} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Code</label>
                <div className="flex gap-2">
                  <input name="code" value={form.code} onChange={handleChange} className="border rounded px-4 py-2 w-full" placeholder="e.g. SUMMER20" required />
                  <button type="button" className="bg-gray-200 px-3 py-2 rounded text-xs font-semibold hover:bg-gray-300" onClick={generateCode}>
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Percentage (%)</label>
                <input name="percentage" type="number" value={form.percentage} onChange={handleChange} className="border rounded px-4 py-2 w-full" min={1} max={100} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Expiry Date</label>
                <input name="expiry" type="date" value={form.expiry} onChange={handleChange} className="border rounded px-4 py-2 w-full" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Usage Limit</label>
                <input name="usageLimit" type="number" value={form.usageLimit} onChange={handleChange} className="border rounded px-4 py-2 w-full" min={1} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" className="bg-gray-200 text-[#1D3A8A] font-semibold py-2 px-4 rounded" onClick={() => { setShowForm(false); setEditId(null); setForm(initialForm); }}>
                  Cancel
                </button>
                <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded" disabled={loading}>
                  {editId ? 'Save Changes' : 'Add Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm relative flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-[#1D3A8A]">Confirm Delete</h3>
            <p className="mb-6 text-center">Are you sure you want to delete <span className="font-semibold">{discountToDelete?.code}</span>?</p>
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
                disabled={loading}
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

export default WorkspaceDiscountsPage; 