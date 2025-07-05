import React, { useEffect, useState } from 'react';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/Firebase';
import { useBooking } from '../../../hooks/useBooking';
import { toast } from 'sonner';

interface CashtokenTx {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  token: string;
  note?: string;
  status: string;
  createdAt: string;
  workspaceId: string;
  type?: string;
}

const WorkspaceCashtokenTransactions: React.FC = () => {
  const { workspace } = useWorkspacePortalContext();
  const [transactions, setTransactions] = useState<CashtokenTx[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const { validateCashtoken } = useBooking();
  const [tab, setTab] = useState<'all' | 'pending' | 'validated' | 'rejected'>('all');

  const fetchTransactions = async () => {
    if (!workspace?.id) return;
    setLoading(true);
    setError(null);
    try {
      // Get all cashtoken txs for this workspace's bookings
      const q = query(collection(db, 'cashtokens'));
      const snap = await getDocs(q);
      // Optionally filter by workspaceId if stored in cashtoken
      let txs: CashtokenTx[] = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as CashtokenTx))
        .filter(tx => tx.bookingId && tx.userId && tx.amount && tx.workspaceId === workspace.id);
      // Sort newest first
      txs = txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTransactions(txs);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [workspace?.id]);

  const handleRefresh = () => {
    fetchTransactions();
  };

  const handleValidate = async (tx: CashtokenTx, status: 'validated' | 'rejected') => {
    setValidatingId(tx.id);
    try {
      await validateCashtoken(tx.id, tx.bookingId, status);
      setTransactions(prev => prev.filter(t => t.id !== tx.id));
      setError(null);
      toast.success(`Transaction ${status === 'validated' ? 'validated' : 'rejected'} successfully.`);
    } catch (err: any) {
      setError(err.message || 'Failed to update transaction');
      toast.error(err.message || 'Failed to update transaction');
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="mb-8 flex items-center gap-4 justify-between flex-wrap">
        <h1 className="text-3xl font-bold text-[#1D3A8A]">Cashtoken Transactions</h1>
        <button
          className="px-3 py-2 rounded-lg bg-[#1D3A8A] text-white font-semibold hover:bg-[#214cc3] transition text-sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'all' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}>All</button>
        <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'pending' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}>Pending</button>
        <button onClick={() => setTab('validated')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'validated' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}>Validated</button>
        <button onClick={() => setTab('rejected')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'rejected' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}>Rejected</button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)} Cashtoken Transactions</h2>
        {loading ? (
          <div className="text-center text-[#4B5563] py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : filteredTransactions(tab, transactions).length === 0 ? (
          <div className="text-center text-[#4B5563] py-4">No {tab === 'all' ? '' : tab + ' '}cashtoken transactions.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b">
                  <th className="py-2">User ID</th>
                  <th>Booking ID</th>
                  <th>Amount</th>
                  <th>Token</th>
                  <th>Type</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions(tab, transactions).map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-[#F3F4F6]">
                    <td className="py-2 font-semibold">{tx.userId}</td>
                    <td>{tx.bookingId}</td>
                    <td>₦{tx.amount}</td>
                    <td>{tx.token}</td>
                    <td>{tx.type ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1) : '-'}</td>
                    <td>{tx.note || '-'}</td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        tx.status === 'validated' ? 'bg-green-100 text-green-800' :
                        tx.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="flex gap-2 items-center py-2">
                      {tx.status === 'pending' && (
                        <>
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                            onClick={() => handleValidate(tx, 'validated')}
                            disabled={validatingId === tx.id}
                          >
                            {validatingId === tx.id ? 'Validating...' : 'Validate'}
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                            onClick={() => handleValidate(tx, 'rejected')}
                            disabled={validatingId === tx.id}
                          >
                            {validatingId === tx.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};

// Helper to filter transactions by tab
function filteredTransactions(tab: 'all' | 'pending' | 'validated' | 'rejected', txs: CashtokenTx[]) {
  if (tab === 'all') return txs;
  return txs.filter(tx => tx.status === tab);
}

export default WorkspaceCashtokenTransactions; 