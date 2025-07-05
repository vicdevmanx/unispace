import React, { useEffect, useState } from 'react';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/Firebase';

interface Transaction {
  id: string;
  bookingId: string;
  userId: string;
  workspaceId?: string;
  amount: number;
  method: 'paystack' | 'cashtoken';
  status: 'success' | 'failed' | 'pending';
  reference?: string;
  createdAt: string;
  extra?: any;
}

const WorkspaceTransactionsPage: React.FC = () => {
  const { workspace } = useWorkspacePortalContext();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'pending' | 'success' | 'failed'>('all');

  const fetchTransactions = async () => {
    if (!workspace?.id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch Paystack transactions
      const paystackQ = query(
        collection(db, 'transactions'),
        where('workspaceId', '==', workspace.id)
      );
      const paystackSnap = await getDocs(paystackQ);
      const paystackTxs = paystackSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'paystack',
        date: doc.data().createdAt || doc.data().date || '',
        reference: doc.data().reference,
        status: (doc.data().status || '').toLowerCase(),
      }));
      // Fetch Cashtoken transactions
      const cashtokenQ = query(collection(db, 'cashtokens'), where('workspaceId', '==', workspace.id));
      const cashtokenSnap = await getDocs(cashtokenQ);
      const cashtokenTxs = cashtokenSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'cashtoken',
        date: doc.data().createdAt || '',
        reference: doc.data().token,
        status: (doc.data().status || '').toLowerCase(),
      }));
      // Combine and sort by date desc
      const allTxs = [...paystackTxs, ...cashtokenTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(allTxs);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'paystack':
        return 'bg-blue-100 text-blue-800';
      case 'cashtoken':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <WorkspaceLayout>
      <div className="mb-8 flex items-center gap-4 justify-between flex-wrap">
        <h1 className="text-3xl font-bold text-[#1D3A8A]">All Transactions</h1>
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
        <button 
          onClick={() => setTab('all')} 
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'all' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          All
        </button>
        <button 
          onClick={() => setTab('pending')} 
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'pending' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setTab('success')} 
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'success' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Success
        </button>
        <button 
          onClick={() => setTab('failed')} 
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${tab === 'failed' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Failed
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)} Transactions
        </h2>
        
        {loading ? (
          <div className="text-center text-[#4B5563] py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : filteredTransactions(tab, transactions).length === 0 ? (
          <div className="text-center text-[#4B5563] py-4">
            No {tab === 'all' ? '' : tab + ' '}transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 font-semibold">User ID</th>
                  <th className="py-3 px-4 font-semibold">Booking ID</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions(tab, transactions).map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-[#F3F4F6]">
                    <td className="py-3 px-4 font-medium">{tx.userId}</td>
                    <td className="py-3 px-4 font-mono text-sm">{tx.bookingId}</td>
                    <td className="py-3 px-4 font-semibold">₦{tx.amount?.toLocaleString?.() || tx.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getMethodColor(tx.type)}`}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">
                      {tx.reference || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {tx.date ? new Date(tx.date).toLocaleString() : '-'}
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
function filteredTransactions(tab: 'all' | 'pending' | 'success' | 'failed', txs: any[]) {
  if (tab === 'all') return txs;
  return txs.filter(tx => tx.status === tab);
}

export default WorkspaceTransactionsPage; 