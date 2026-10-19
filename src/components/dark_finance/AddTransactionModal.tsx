import { API } from '../../config/api';
import React, { useState } from 'react';
import { X, Plus, Calendar, DollarSign, Wallet, Tag } from 'lucide-react';
import type { TransactionType, Category, Account } from '../../types/finance';

type Props = {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  accounts: Account[];
  isDarkMode: boolean;
};

export default function AddTransactionModal({
  isOpen = true,
  onClose,
  onSuccess,
  categories = [],
  accounts = [],
  isDarkMode
}: Props) {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [accountName, setAccountName] = useState(accounts[0]?.name || 'BNP Bank');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isOpen === false) return null;

  const filteredCategories = categories.filter(c => c.type === type);
  const activeCategory = category || (filteredCategories[0]?.name || (type === 'expense' ? 'Food & Groceries' : 'Salary'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          amount: parsedAmount,
          type,
          category: activeCategory,
          account_name: accountName,
          payment_method: paymentMethod,
          transaction_date: date,
          notes: notes.trim() || undefined
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || 'Failed to save transaction');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className={`rounded-3xl border w-full max-w-lg shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-[#1C183D] border-[#2D265C] text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-opacity-10 border-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 text-violet-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold">Record Transaction</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">
          {/* Income / Expense Toggle */}
          <div className="flex p-1 rounded-xl bg-[#120F2D] border border-[#2D265C]">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-400 mb-1">Title / Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Salary, Rent, Supermarket, Netflix"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Category *</label>
              <select
                value={activeCategory}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
              >
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))
                ) : (
                  <option value={activeCategory}>{activeCategory}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Account *</label>
              <select
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
              >
                {accounts.length > 0 ? (
                  accounts.map(a => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))
                ) : (
                  <option value="BNP Bank">BNP Bank</option>
                )}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-slate-400 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
            >
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 mb-1">Notes (Optional)</label>
            <input
              type="text"
              placeholder="Add extra reference or tags (e.g. #electricity)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-opacity-10 border-slate-400">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
