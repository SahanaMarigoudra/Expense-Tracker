import { API } from '../../config/api';
import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Database,
  Palette,
  Download,
  RotateCcw,
  Check,
  Sparkles,
  Bell,
  HardDrive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { Account, Category } from '../../types/finance';

type Props = {
  accounts: Account[];
  categories: Category[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onRefreshAll: () => void;
};

export default function SettingsPage({
  accounts,
  categories,
  isDarkMode,
  onToggleTheme,
  onRefreshAll
}: Props) {
  // Profile settings
  const [name, setName] = useState('Nick Jenkins');
  const [tag, setTag] = useState('Personal Account');
  const [email, setEmail] = useState('user@spendwise.app');
  const [currency, setCurrency] = useState('INR');
  const [defaultAccount, setDefaultAccount] = useState(accounts[0]?.name || 'BNP Bank');
  const [budgetAlertThreshold, setBudgetAlertThreshold] = useState('80');
  const [themeColor, setThemeColor] = useState('violet');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('spendwise_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.tag) setTag(parsed.tag);
      } catch (e) {}
    }
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'spendwise_profile',
      JSON.stringify({ name, tag, currency, defaultAccount })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportJSON = async () => {
    try {
      const [txRes, accRes, catRes] = await Promise.all([
        fetch(`${API}/transactions`),
        fetch(`${API}/accounts`),
        fetch(`${API}/categories`)
      ]);

      const backup = {
        exportDate: new Date().toISOString(),
        currency: 'INR (₹)',
        transactions: await txRes.json(),
        accounts: await accRes.json(),
        categories: await catRes.json()
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spendwise_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting database backup.');
    }
  };

  const handleExportCSV = () => {
    window.open(`${API}/transactions/export/csv`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 text-violet-400 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4" />
            </div>
            Settings & Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, regional currency, and local SQLite database configuration
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Currency (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 shadow-xl space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2D265C]">
              <User className="w-4 h-4 text-violet-400" />
              Profile Details
            </h2>

            <form onSubmit={handleSavePreferences} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Account Subtitle / Role</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-400 mb-1">Primary Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
                  >
                    <option value="INR">₹ INR (Indian Rupee)</option>
                    <option value="USD">$ USD (US Dollar)</option>
                    <option value="EUR">€ EUR (Euro)</option>
                    <option value="GBP">£ GBP (British Pound)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Default Account for Transactions</label>
                  <select
                    value={defaultAccount}
                    onChange={e => setDefaultAccount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Budget Alert Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={budgetAlertThreshold}
                  onChange={e => setBudgetAlertThreshold(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#120F2D] text-white focus:outline-none focus:border-violet-500 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block font-normal">
                  Send proactive alert when spending hits {budgetAlertThreshold}% of monthly category limit.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition cursor-pointer active:scale-95"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Data Backup & Export Section */}
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2D265C]">
              <Database className="w-4 h-4 text-emerald-400" />
              Data Export & Backup
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Download your complete transaction ledger, accounts, and budgets in universal CSV or JSON format for tax preparation or backup.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#120F2D] border border-slate-700 hover:border-violet-500 transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4 text-violet-400" />
                <span>Export Transactions (CSV)</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#120F2D] border border-slate-700 hover:border-emerald-500 transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Full System Backup (JSON)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Database Info & System Status (1 col) */}
        <div className="space-y-6">
          {/* SQLite Database Status */}
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2D265C]">
              <HardDrive className="w-4 h-4 text-teal-400" />
              Database Engine
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Engine</span>
                <span className="text-white font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  SQLite 3 (Embedded Local)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Database File</span>
                <code className="text-[11px] text-slate-300 bg-[#120F2D] px-2 py-1 rounded block mt-0.5 truncate border border-slate-800">
                  D:\Expense Tracker\expense_tracker.db
                </code>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Active Tables</span>
                <span className="text-slate-200 block mt-0.5">
                  7 tables (transactions, accounts, categories, budgets, savings_goals, reminders, transfers)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">FastAPI Host</span>
                <span className="text-emerald-400 font-bold block mt-0.5">
                  http://127.0.0.1:8002
                </span>
              </div>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2D265C]">
              <Palette className="w-4 h-4 text-pink-400" />
              Theme & Appearance
            </h3>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Dark OLED Mode</span>
              <button
                type="button"
                onClick={onToggleTheme}
                className="w-10 h-6 rounded-full bg-violet-600 p-1 flex items-center transition cursor-pointer"
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="pt-2 border-t border-[#2D265C] text-[11px] text-slate-400">
              SpendWise v2.0.0 Pro Edition &bull; High-Performance Personal Finance Management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
