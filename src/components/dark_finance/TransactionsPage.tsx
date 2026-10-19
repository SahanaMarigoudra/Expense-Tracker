import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Plus
} from 'lucide-react';
import type { Transaction, Account, Category } from '../../types/finance';
import AddTransactionModal from './AddTransactionModal';
import { API } from '../../config/api';

type Props = {
  categories: Category[];
  accounts: Account[];
  isDarkMode: boolean;
  onSuccess: () => void;
  initialCategoryFilter?: string;
};

export default function TransactionsPage({ categories, accounts, isDarkMode, onSuccess, initialCategoryFilter }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState(initialCategoryFilter || 'all');
  const [filterAccount, setFilterAccount] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (initialCategoryFilter) {
      setFilterCategory(initialCategoryFilter);
      setCurrentPage(1);
    }
  }, [initialCategoryFilter]);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/transactions`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : data.items ?? []);
      }
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await fetch(`${API}/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
      onSuccess();
    } catch (err) { console.error(err); }
  };

  const handleExportCSV = () => {
    window.open(`${API}/transactions/export/csv`, '_blank');
  };

  // Filter & sort
  const filtered = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCat = filterCategory === 'all' || t.category === filterCategory;
    const matchesAcc = filterAccount === 'all' || t.account_name === filterAccount;
    return matchesSearch && matchesType && matchesCat && matchesAcc;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      const cmp = new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
      return sortOrder === 'desc' ? cmp : -cmp;
    } else {
      const cmp = b.amount - a.amount;
      return sortOrder === 'desc' ? cmp : -cmp;
    }
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Transaction History</h1>
          <p className="text-xs text-slate-400 mt-1">Search, filter, and audit every incoming and outgoing record</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1C183D] border border-[#2D265C] hover:border-violet-500 transition flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-violet-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-[#1C183D] border border-[#2D265C] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, notes, or tags..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value as any); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Types</option>
          <option value="income">Income (+)</option>
          <option value="expense">Expense (-)</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select
          value={filterAccount}
          onChange={e => { setFilterAccount(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Accounts</option>
          {accounts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#120F2D]/80 border-b border-[#2D265C] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Account</th>
                <th className="py-4 px-6">Payment</th>
                <th
                  className="py-4 px-6 text-right cursor-pointer"
                  onClick={() => {
                    setSortBy('amount');
                    setSortOrder(s => s === 'desc' ? 'asc' : 'desc');
                  }}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26204C]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    {transactions.length === 0
                      ? 'No transactions yet. Click "Add New" to get started!'
                      : 'No transactions match your filters.'}
                  </td>
                </tr>
              ) : (
                paginated.map(t => (
                  <tr key={t.id} className="hover:bg-white/5 transition">
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">{t.transaction_date}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-white block">{t.title}</span>
                      {t.notes && <span className="text-[10px] text-slate-400">{t.notes}</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 text-violet-300 font-medium text-[11px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{t.account_name}</td>
                    <td className="py-4 px-6 text-slate-400">{t.payment_method || 'Card'}</td>
                    <td className="py-4 px-6 text-right whitespace-nowrap font-extrabold text-sm">
                      <span className={t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-[#2D265C] flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-[#120F2D] border border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition ${currentPage === p ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-[#120F2D] border border-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddTransactionModal
          isOpen={true}
          categories={categories}
          accounts={accounts}
          isDarkMode={isDarkMode}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchTransactions(); onSuccess(); }}
        />
      )}
    </div>
  );
}
