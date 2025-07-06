import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import UserLayout from '../_components/UserLayout';
import { Tab } from '@headlessui/react';
import { CreditCard, Key, Calendar, Loader2 } from 'lucide-react';
import { db } from '../../../lib/Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-700',
  validated: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-700',
};

const typeColors: Record<string, string> = {
  paystack: 'bg-blue-100 text-blue-800',
  cashtoken: 'bg-purple-100 text-purple-800',
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'paystack', label: 'Paystack' },
  { key: 'cashtoken', label: 'Cashtoken' },
  { key: 'success', label: 'Success' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
];

const UserTransactionsPage = () => {
  const { user, loading: userLoading } = useAuthContext();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.uid) return;
      setLoading(true);
      // Fetch Paystack transactions
      const paystackQ = query(collection(db, 'transactions'), where('userId', '==', user.uid));
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
      const cashtokenQ = query(collection(db, 'cashtokens'), where('userId', '==', user.uid));
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
      setLoading(false);
    };
    fetchTransactions();
  }, [user?.uid]);

  const filteredTxs = transactions.filter(tx => {
    if (tab === 'all') return true;
    if (tab === 'paystack') return tx.type === 'paystack';
    if (tab === 'cashtoken') return tx.type === 'cashtoken';
    if (tab === 'success') return ['success', 'validated'].includes(tx.status);
    if (tab === 'pending') return tx.status === 'pending';
    if (tab === 'failed') return ['failed', 'rejected'].includes(tx.status);
    return true;
  });

  return (
    <UserLayout>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1D3A8A] mb-6">My Transactions</h1>
        <div className="mb-6 flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`px-4 py-2 rounded-lg font-medium border transition-all text-sm ${tab === t.key ? 'bg-[#1D3A8A] text-white border-[#1D3A8A]' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-[#1D3A8A]/10'}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Reference/Token</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading || userLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <Loader2 className="animate-spin inline-block mr-2" /> Loading transactions...
                  </td>
                </tr>
              ) : filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTxs.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-[#F3F4F6]">
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${typeColors[tx.type] || 'bg-gray-100 text-gray-700'}`}>
                        {tx.type === 'paystack' ? <CreditCard className="w-4 h-4 mr-1 inline" /> : <Key className="w-4 h-4 mr-1 inline" />}
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-900">₦{tx.amount?.toLocaleString?.() || tx.amount}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[tx.status] || 'bg-gray-100 text-gray-700'}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-700">{tx.reference}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{tx.date ? format(new Date(tx.date), 'PPP p') : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </UserLayout>
  );
};

export default UserTransactionsPage; 