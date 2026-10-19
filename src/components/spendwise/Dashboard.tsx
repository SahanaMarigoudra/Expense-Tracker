import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  TrendingUp,
  Receipt,
  Wallet,
  ArrowRight
} from 'lucide-react';
import Sidebar from './Sidebar';
import type { TabType } from './Sidebar';
import AddTransactionModal from './AddTransactionModal';
import TransactionHistory from './TransactionHistory';
import CategoryManagement from './CategoryManagement';
import FinancialSummary from './FinancialSummary';
import BudgetTracker from '../BudgetTracker';
import type { Transaction, Summary } from '../../types';

type Props = {
  onBackToLanding: () => void;
};

export default function Dashboard({ onBackToLanding }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total_income: 0,
    total_expense: 0,
    net_savings: 0,
    transaction_count: 0
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const fetchAllData = async () => {
    try {
      const [txRes, sumRes] = await Promise.all([
        fetch('http://127.0.0.1:8002/api/transactions'),
        fetch('http://127.0.0.1:8002/api/summary')
      ]);

      if (txRes.ok && sumRes.ok) {
        const txData = await txRes.json();
        const sumData = await sumRes.json();
        setTransactions(Array.isArray(txData) ? txData : txData.items ?? []);
        setSummary(sumData);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8002/api/transactions/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(val);
  };

  // Top category calculations for the Donut Chart
  const categoryStats = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const total = expenses.reduce((s, t) => s + t.amount, 0);

    const map: Record<string, number> = {};
    expenses.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

    const colors = ['#00A86B', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B'];

    const items = Object.entries(map).map(([category, amount], idx) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: colors[idx % colors.length]
    })).sort((a, b) => b.amount - a.amount);

    return { total, items };
  }, [transactions]);

  // Income vs Expenses monthly mockup data with current live data blended
  const monthlyData = [
    { month: 'Jan', income: 42000, expense: 24000 },
    { month: 'Feb', income: 45000, expense: 26000 },
    { month: 'Mar', income: 48000, expense: 29000 },
    { month: 'Apr', income: summary.total_income || 45000, expense: summary.total_expense || 28500 },
    { month: 'May', income: 47000, expense: 25000 },
    { month: 'Jun', income: 50000, expense: 27000 },
  ];

  return (
    <div className="flex min-h-screen bg-[#F6F8F7] text-slate-800">
      {/* Dark Forest Green Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onBackToLanding={onBackToLanding}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-18 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20">
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B] transition"
            />
          </div>

          {/* User & Notifications */}
          <div className="flex items-center gap-4">
            {/* Backend status pill */}
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                backendOnline === true
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-[#00A86B] animate-pulse' : 'bg-rose-500'}`} />
              {backendOnline ? 'SQLite Live' : 'Offline'}
            </span>

            {/* Notification Bell */}
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#00A86B] absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#0B1E19] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                S
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Sahana</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 md:p-8 space-y-6 flex-1">
          {activeTab === 'dashboard' && (
            <>
              {/* Dashboard Title & Date Range */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Good Morning, Sahana! Here is your financial overview.</p>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-600 shadow-xs self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>Apr 1, 2026 - Apr 30, 2026</span>
                </div>
              </div>

              {/* 3 Metric Cards matching reference image */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Income Card (Mint/Emerald) */}
                <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-500">Total Income</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    ₹ {formatINR(summary.total_income || 45000)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00A86B]">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+12% vs last month</span>
                  </div>
                </div>

                {/* Total Expenses Card (Soft Coral/Rose) */}
                <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                      <Receipt className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    ₹ {formatINR(summary.total_expense || 28500)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                    <ArrowDownRight className="w-4 h-4" />
                    <span>+8% vs last month</span>
                  </div>
                </div>

                {/* Net Savings Card (Sky Blue) */}
                <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-500">Net Savings</span>
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    ₹ {formatINR(summary.net_savings || 16500)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-500">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+15% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Two Main Charts Row: Income vs Expenses & Spending by Category */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Income vs Expenses Bar Chart */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-slate-800">Income vs Expenses</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00A86B]" /> Income
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Expenses
                      </span>
                    </div>
                  </div>

                  {/* Responsive SVG Bar Chart */}
                  <div className="h-64 flex items-end justify-between gap-4 pt-6 pb-2 border-b border-slate-100">
                    {monthlyData.map(item => {
                      const maxVal = 60000;
                      const incHeight = Math.round((item.income / maxVal) * 100);
                      const expHeight = Math.round((item.expense / maxVal) * 100);

                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <div className="flex items-end justify-center gap-1.5 w-full h-full pb-2">
                            {/* Income Bar (Green) */}
                            <div
                              className="w-3.5 bg-[#00A86B] rounded-t-md transition-all duration-500 group-hover:brightness-110"
                              style={{ height: `${incHeight}%` }}
                              title={`Income: ₹${item.income}`}
                            />
                            {/* Expense Bar (Red) */}
                            <div
                              className="w-3.5 bg-rose-400 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                              style={{ height: `${expHeight}%` }}
                              title={`Expense: ₹${item.expense}`}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-400">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-3 text-[11px] text-slate-400">
                    <span>Scale: 0 - 60K</span>
                    <span>Values in INR (₹)</span>
                  </div>
                </div>

                {/* Spending by Category Donut Chart */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                  <h3 className="text-base font-bold text-slate-800 mb-4">Spending by Category</h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
                    {/* Donut Circle */}
                    <div className="relative w-40 h-40 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="14" />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#00A86B"
                          strokeWidth="14"
                          strokeDasharray="66.8 238.7"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="14"
                          strokeDasharray="42.9 238.7"
                          strokeDashoffset="-66.8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="14"
                          strokeDasharray="28.6 238.7"
                          strokeDashoffset="-109.7"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="14"
                          strokeDasharray="23.8 238.7"
                          strokeDashoffset="-138.3"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="14"
                          strokeDasharray="19.1 238.7"
                          strokeDashoffset="-162.1"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#64748B"
                          strokeWidth="14"
                          strokeDasharray="57.3 238.7"
                          strokeDashoffset="-181.2"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                        <span className="text-base font-extrabold text-slate-800">
                          ₹ {formatINR(summary.total_expense || 28500)}
                        </span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-1.5 w-full text-xs">
                      {(categoryStats.items.length > 0 ? categoryStats.items.map(c => ({ name: c.category, pct: c.percentage, color: c.color })) : [
                        { name: 'Food', pct: 28, color: '#00A86B' },
                        { name: 'Shopping', pct: 18, color: '#3B82F6' },
                        { name: 'Travel', pct: 12, color: '#F59E0B' },
                        { name: 'Bills', pct: 10, color: '#EF4444' },
                        { name: 'Entertainment', pct: 8, color: '#8B5CF6' },
                        { name: 'Others', pct: 24, color: '#64748B' },
                      ]).map(item => (
                        <div key={item.name} className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{item.name}</span>
                          </span>
                          <span className="font-bold text-slate-800">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-[#00A86B] hover:underline flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Detailed Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Transactions List on Dashboard */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-bold text-[#00A86B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {(transactions.length > 0 ? transactions.slice(0, 5) : [
                    { id: 1, title: 'Salary', type: 'income', amount: 25000, category: 'Salary', transaction_date: '12 Apr 2026' },
                    { id: 2, title: 'Groceries', type: 'expense', amount: 2500, category: 'Food', transaction_date: '10 Apr 2026' },
                    { id: 3, title: 'Electricity Bill', type: 'expense', amount: 1200, category: 'Bills', transaction_date: '08 Apr 2026' },
                    { id: 4, title: 'Freelancing', type: 'income', amount: 8000, category: 'Income', transaction_date: '05 Apr 2026' },
                  ]).map((t: any) => (
                    <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            t.type === 'income' ? 'bg-emerald-50 text-[#00A86B]' : 'bg-rose-50 text-rose-500'
                          }`}
                        >
                          {t.title.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 block">{t.title}</span>
                          <span className="text-[11px] text-slate-400">
                            {t.category} • {t.transaction_date}
                          </span>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${t.type === 'income' ? 'text-[#00A86B]' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+ ' : '- '}₹ {formatINR(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tab Views */}
          {activeTab === 'transactions' && (
            <TransactionHistory
              transactions={transactions}
              onDelete={handleDelete}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'categories' && <CategoryManagement />}

          {activeTab === 'budget' && <BudgetTracker transactions={transactions} />}

          {activeTab === 'reports' && <FinancialSummary transactions={transactions} />}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl">
              <h2 className="text-xl font-bold text-slate-900 mb-2">System & Database Settings</h2>
              <p className="text-xs text-slate-400 mb-6">Manage local SQLite database and backend connectivity</p>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">SQLite Database File</span>
                    <span className="text-slate-400 font-mono">backend/expense_tracker.db</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-[#00A86B] font-bold rounded-lg">Connected</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">FastAPI Backend API</span>
                    <span className="text-slate-400 font-mono">http://127.0.0.1:8000</span>
                  </div>
                  <a
                    href="http://127.0.0.1:8000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#00A86B] text-white font-semibold rounded-lg hover:bg-[#008f5a] transition"
                  >
                    Open Swagger Docs
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={fetchAllData}
      />
    </div>
  );
}
