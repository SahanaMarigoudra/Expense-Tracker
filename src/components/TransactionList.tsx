import { API } from '../config/api';
import { useEffect, useState } from 'react';

type Transaction = {
  id: number;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  transaction_date: string;
  notes?: string;
  created_at?: string;
};

export default function TransactionList({
  refreshKey,
  onDeleted
}: {
  refreshKey?: number;
  onDeleted?: () => void;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/transactions`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.items ?? [];
      setTransactions(items);
    } catch (err: any) {
      setError(err.message || 'Error loading transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API}/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setTransactions(prev => prev.filter(t => t.id !== id));
      if (onDeleted) onDeleted();
    } catch (err: any) {
      alert(err.message || 'Could not delete transaction');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header with Search and Filter */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
          <p className="text-xs text-slate-500 mt-1">Review, filter and manage all records</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 w-48 sm:w-56"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'all' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'income' ? 'bg-white shadow-xs text-emerald-600 font-semibold' : 'text-slate-600'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'expense' ? 'bg-white shadow-xs text-rose-600 font-semibold' : 'text-slate-600'
              }`}
            >
              Expense
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-xs border-b border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchTransactions} className="underline font-semibold hover:text-red-800">
            Retry
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <svg className="animate-spin h-6 w-6 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-xs">Loading records from SQLite database...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">No transactions found</p>
            <p className="text-xs text-slate-400 mt-1">
              {transactions.length === 0
                ? 'Get started by adding your first transaction above!'
                : 'No transactions match the selected filter.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Transaction</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-slate-800">{t.title}</div>
                    {t.notes && <div className="text-[11px] text-slate-400 line-clamp-1">{t.notes}</div>}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-[11px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                    {t.transaction_date}
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-sm ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                      title="Delete transaction"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      {deletingId === t.id ? (
                        <svg className="animate-spin h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
