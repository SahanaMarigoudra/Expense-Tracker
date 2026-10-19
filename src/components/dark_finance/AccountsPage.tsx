import React, { useState } from 'react';
import { CreditCard, Plus, ArrowRightLeft, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Account } from '../../types/finance';

type Props = {
  accounts: Account[];
  onRefresh: () => void;
  isDarkMode: boolean;
};

export default function AccountsPage({ accounts, onRefresh, isDarkMode }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // New account form
  const [name, setName] = useState('');
  const [type, setType] = useState('Savings');
  const [openingBalance, setOpeningBalance] = useState('');
  const [description, setDescription] = useState('');

  // Transfer form
  const [fromAcc, setFromAcc] = useState(accounts[0]?.name || '');
  const [toAcc, setToAcc] = useState(accounts[1]?.name || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [transferNotes, setTransferNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8002/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          type,
          opening_balance: parseFloat(openingBalance) || 0.0,
          description: description.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to create account');
      setShowAddModal(false);
      setName('');
      setOpeningBalance('');
      setDescription('');
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAcc === toAcc) {
      alert('Source and destination accounts must be different.');
      return;
    }
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) {
      alert('Transfer amount must be greater than zero.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8002/api/accounts/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_account: fromAcc,
          to_account: toAcc,
          amount: amt,
          transfer_date: transferDate,
          notes: transferNotes || undefined,
        }),
      });
      if (!res.ok) throw new Error('Transfer failed');
      setShowTransferModal(false);
      setTransferAmount('');
      setTransferNotes('');
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Accounts & Balances</h1>
          <p className="text-xs text-slate-400 mt-1">Manage wallets, bank balances, and execute account transfers</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1C183D] border border-[#2D265C] hover:border-violet-500 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
            <span>Transfer Funds</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Account</span>
          </button>
        </div>
      </div>

      {/* Total Combined Balance Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1C183D] via-[#221C4A] to-[#1C183D] border border-[#2D265C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Combined Financial Balance
          </span>
          <span className="text-3xl font-extrabold text-white">{formatCurrency(totalBalance)}</span>
          <span className="text-xs text-emerald-400 block mt-1">Calculated across {accounts.length} active accounts</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Transfers do not inflate income/expense totals</span>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div
            key={acc.id}
            className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-violet-500/50 transition"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-violet-300">
                  {acc.type}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{acc.name}</h3>
              <p className="text-[11px] text-slate-400 mb-4">{acc.description || 'Configured money repository'}</p>
            </div>

            <div className="pt-4 border-t border-slate-700/40 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Current Balance</span>
                <span className={`text-xl font-extrabold ${acc.current_balance >= 0 ? 'text-white' : 'text-rose-400'}`}>
                  {formatCurrency(acc.current_balance)}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Open: {formatCurrency(acc.opening_balance)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 max-w-md w-full shadow-2xl text-xs font-semibold">
            <h3 className="text-base font-bold text-white mb-4">Add Money Account</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BNP Bank, Cash Wallet, Crypto"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                >
                  <option value="Savings">Savings Account</option>
                  <option value="Current">Current Account</option>
                  <option value="Cash Wallet">Cash Wallet</option>
                  <option value="UPI Account">UPI / Digital Wallet</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Opening Balance (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={openingBalance}
                  onChange={e => setOpeningBalance(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Primary salary checking"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-md"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Funds Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 max-w-md w-full shadow-2xl text-xs font-semibold">
            <h3 className="text-base font-bold text-white mb-4">Transfer Money Between Accounts</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">From Account</label>
                  <select
                    value={fromAcc}
                    onChange={e => setFromAcc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  >
                    {accounts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">To Account</label>
                  <select
                    value={toAcc}
                    onChange={e => setToAcc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  >
                    {accounts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transfer Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={e => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transfer Date</label>
                <input
                  type="date"
                  required
                  value={transferDate}
                  onChange={e => setTransferDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly emergency fund transfer"
                  value={transferNotes}
                  onChange={e => setTransferNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-md"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
