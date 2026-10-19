import { useState } from 'react';
import { Search, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Transaction } from '../../types';

type Props = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
};

export default function TransactionHistory({ transactions, onDelete }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique categories
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  // Filter logic
  const filtered = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesType && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header & Filters */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Transaction History</h2>
            <p className="text-xs text-slate-400 mt-0.5">Filter, search, and manage all your expense records</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Apr 1, 2026 - Apr 30, 2026</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search by description */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B] transition"
            />
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={e => { setSelectedType(e.target.value as any); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B] transition"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B] transition"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6">Description</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Type</th>
              <th className="py-3.5 px-6 text-right">Amount</th>
              <th className="py-3.5 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No transactions found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedItems.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition group">
                  <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                    {t.transaction_date}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-slate-800 block">{t.title}</span>
                    {t.notes && <span className="text-[11px] text-slate-400">{t.notes}</span>}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-[11px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap font-bold text-sm">
                    <span className={t.type === 'income' ? 'text-[#00A86B]' : 'text-rose-500'}>
                      {t.type === 'income' ? '+ ' : '- '}₹ {formatINR(t.amount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center whitespace-nowrap">
                    <button
                      onClick={() => onDelete(t.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#00A86B] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
