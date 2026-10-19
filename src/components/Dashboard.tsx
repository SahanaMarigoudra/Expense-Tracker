import { API } from '../config/api';
import { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowLeft,
  PlusCircle,
  Download,
  BarChart2,
  ListOrdered,
  Target,
  RefreshCw
} from 'lucide-react';
import SummaryCards from './SummaryCards';
import AnalyticsCharts from './AnalyticsCharts';
import BudgetTracker from './BudgetTracker';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

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

export default function Dashboard({ onBackToHome }: { onBackToHome: () => void }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets'>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch transactions for analytics and charts
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/transactions`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : data.items ?? []);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  const handleTransactionChange = () => {
    setRefreshKey(prev => prev + 1);
    setShowAddModal(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const headers = ['ID', 'Title', 'Type', 'Amount', 'Category', 'Date', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      `"${t.category.replace(/"/g, '""')}"`,
      t.transaction_date,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ExpenseFlow_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top App Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Back to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">ExpenseFlow Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Backend Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                backendOnline === true
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : backendOnline === false
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline === true
                    ? 'bg-emerald-500 animate-pulse'
                    : backendOnline === false
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="hidden sm:inline">
                {backendOnline === true
                  ? 'SQLite & API Connected'
                  : backendOnline === false
                  ? 'Backend Offline'
                  : 'Connecting...'}
              </span>
            </span>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs cursor-pointer"
              title="Export Transactions as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            {/* Quick Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-2 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Overview & Charts</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Transactions ({transactions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('budgets')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'budgets'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Budget Limits</span>
            </button>
          </div>

          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Metric Summary Cards */}
        <SummaryCards refreshKey={refreshKey} />

        {/* Tab 1: Overview & Charts */}
        {activeTab === 'overview' && (
          <div>
            <AnalyticsCharts transactions={transactions} />
            <BudgetTracker transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <TransactionForm onCreated={handleTransactionChange} />
              </div>
              <div className="lg:col-span-7">
                <TransactionList refreshKey={refreshKey} onDeleted={handleTransactionChange} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Transaction Manager */}
        {activeTab === 'transactions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <TransactionForm onCreated={handleTransactionChange} />
            </div>
            <div className="lg:col-span-8">
              <TransactionList refreshKey={refreshKey} onDeleted={handleTransactionChange} />
            </div>
          </div>
        )}

        {/* Tab 3: Dedicated Budgets */}
        {activeTab === 'budgets' && (
          <div className="space-y-8">
            <BudgetTracker transactions={transactions} />
            <AnalyticsCharts transactions={transactions} />
          </div>
        )}
      </main>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-2 relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            <TransactionForm onCreated={handleTransactionChange} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-white">
        ExpenseFlow Dashboard • Connected to FastAPI & SQLite Database at <code>127.0.0.1:8000</code>
      </footer>
    </div>
  );
}
