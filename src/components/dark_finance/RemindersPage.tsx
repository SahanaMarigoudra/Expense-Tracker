import React, { useState, useEffect } from 'react';
import { Bell, Plus, CheckCircle2, Clock, Trash2, Calendar } from 'lucide-react';
import type { Reminder, Category, Account } from '../../types/finance';

type Props = {
  categories: Category[];
  accounts: Account[];
  isDarkMode: boolean;
};

export default function RemindersPage({ categories, accounts, isDarkMode }: Props) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(categories[0]?.name || 'Bills & Utilities');
  const [frequency, setFrequency] = useState('Monthly');
  const [accountName, setAccountName] = useState(accounts[0]?.name || 'BNP Bank');

  const fetchReminders = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8002/api/reminders');
      if (res.ok) {
        setReminders(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://127.0.0.1:8002/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          due_date: dueDate,
          category,
          frequency,
          status: 'Upcoming',
          account_name: accountName
        })
      });
      setShowAddModal(false);
      setTitle('');
      setAmount('');
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:8002/api/reminders/${id}/pay`, {
        method: 'POST'
      });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:8002/api/reminders/${id}`, {
        method: 'DELETE'
      });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

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
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-violet-400" />
            <span>Reminders & Upcoming Bills</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Never miss utility bills, loans, rent, or recurring subscriptions</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Bill Reminder</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map(r => (
          <div
            key={r.id}
            className={`rounded-3xl p-6 border shadow-xl relative overflow-hidden flex flex-col justify-between transition ${
              r.status === 'Paid'
                ? 'bg-[#161233]/70 border-emerald-500/30 opacity-75'
                : 'bg-[#1C183D] border-[#2D265C]'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-white">{r.title}</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    r.status === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="text-2xl font-extrabold text-white tracking-tight mb-2">
                {formatCurrency(r.amount)}
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Due Date: <strong className="text-slate-300">{r.due_date}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Frequency: {r.frequency}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-700/40 flex items-center justify-between">
              {r.status !== 'Paid' ? (
                <button
                  onClick={() => handleMarkPaid(r.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Paid</span>
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Logged
                </span>
              )}

              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 max-w-md w-full shadow-2xl text-xs font-semibold">
            <h3 className="text-base font-bold text-white mb-4">Set Bill Reminder</h3>
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electricity Bill, Internet, Rent"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="120.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  >
                    {categories.filter(c => c.type === 'expense').map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  >
                    <option value="One-time">One-time</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-md">
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
