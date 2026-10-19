import React, { useState, useMemo, useEffect } from 'react';
import {
  Settings,
  Search,
  Wallet,
  ChevronDown,
  Edit2,
  Plus,
  ArrowRight,
  Home,
  ShoppingBag,
  BookOpen,
  HeartPulse,
  Dumbbell,
  Gamepad2,
  Milk,
  Circle,
  X,
  Briefcase,
  Gift,
  Coins,
  Laptop,
  Check,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import type { DashboardData, Transaction } from '../../types/finance';
import EditProfileModal, { type UserProfile } from './EditProfileModal';

type Props = {
  data: DashboardData;
  onOpenAddModal: () => void;
  onSeeAllTransactions: () => void;
  onSelectCategory: (cat: string) => void;
  onMarkReminderPaid: (id: number) => void;
  isDarkMode: boolean;
  onNavigate?: (page: string) => void;
};

export default function DashboardOverview({
  data,
  onOpenAddModal,
  onSeeAllTransactions,
  onSelectCategory,
  onMarkReminderPaid,
  isDarkMode,
  onNavigate
}: Props) {
  const [catType, setCatType] = useState<'expenses' | 'incomes'>('expenses');
  const [statType, setStatType] = useState<'bar' | 'line'>('bar');
  const [balanceChartType, setBalanceChartType] = useState<'pie' | 'bar'>('pie');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(3);

  // Top Filter Controls State
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dropdown open states
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // User Profile from localStorage with cross-component sync
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('spendwise_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Nick Jenkins',
      tag: 'Personal Account',
      avatarColor: 'from-violet-700 to-indigo-600',
    };
  });

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem('spendwise_profile', JSON.stringify(updated));
    window.dispatchEvent(new Event('spendwise_profile_updated'));
  };

  useEffect(() => {
    const handler = () => {
      const saved = localStorage.getItem('spendwise_profile');
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('spendwise_profile_updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('spendwise_profile_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const { summary, recent_transactions, accounts } = data;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Distinct account options
  const accountOptions = useMemo(() => {
    const names = new Set<string>();
    accounts.forEach(a => names.add(a.name));
    recent_transactions.forEach(t => {
      if (t.account_name) names.add(t.account_name);
    });
    return ['All Accounts', ...Array.from(names)];
  }, [accounts, recent_transactions]);

  const monthOptions = [
    'All Months',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const yearOptions = ['All Years', '2026', '2025', '2024', '2023'];

  // Filtered transactions based on Account, Month, Year, and Search
  const filteredTransactions = useMemo(() => {
    return recent_transactions.filter(t => {
      // Account filter
      if (selectedAccount !== 'All Accounts' && t.account_name !== selectedAccount) {
        return false;
      }

      // Month filter
      if (selectedMonth !== 'All Months') {
        const txDate = new Date(t.transaction_date);
        const monthName = txDate.toLocaleString('en-US', { month: 'long' });
        const monthShort = txDate.toLocaleString('en-US', { month: 'short' });
        if (
          monthName.toLowerCase() !== selectedMonth.toLowerCase() &&
          monthShort.toLowerCase() !== selectedMonth.toLowerCase()
        ) {
          return false;
        }
      }

      // Year filter
      if (selectedYear !== 'All Years') {
        const txYear = new Date(t.transaction_date).getFullYear().toString();
        if (txYear !== selectedYear) {
          return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title?.toLowerCase().includes(q);
        const matchCat = t.category?.toLowerCase().includes(q);
        const matchAcc = t.account_name?.toLowerCase().includes(q);
        const matchNotes = t.notes?.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchAcc && !matchNotes) {
          return false;
        }
      }

      return true;
    });
  }, [recent_transactions, selectedAccount, selectedMonth, selectedYear, searchQuery]);

  // Dynamic summary computation based on active filters
  const hasActiveFilter =
    selectedAccount !== 'All Accounts' ||
    selectedMonth !== 'All Months' ||
    selectedYear !== 'All Years' ||
    searchQuery.trim().length > 0;

  const dynamicSummary = useMemo(() => {
    if (!hasActiveFilter) {
      return {
        balance: summary.net_savings,
        income: summary.total_income,
        expense: summary.total_expense,
        txCount: summary.transaction_count,
        incomeCount: summary.income_count,
        expenseCount: summary.expense_count,
        balancePct: Math.round(summary.balance_pct || 72),
        expensePct: Math.round(summary.expense_pct || 28),
        incomePct: Math.round(summary.income_pct || 100),
      };
    }

    const incs = filteredTransactions.filter(t => t.type === 'income');
    const exps = filteredTransactions.filter(t => t.type === 'expense');

    const totInc = incs.reduce((sum, t) => sum + t.amount, 0);
    const totExp = exps.reduce((sum, t) => sum + t.amount, 0);
    const netBal = totInc - totExp;

    const incPct = totInc > 0 ? 100 : 0;
    const expPct = totInc > 0 ? Math.round((totExp / totInc) * 100) : 0;
    const balPct = totInc > 0 ? Math.round((netBal / totInc) * 100) : 0;

    return {
      balance: netBal,
      income: totInc,
      expense: totExp,
      txCount: filteredTransactions.length,
      incomeCount: incs.length,
      expenseCount: exps.length,
      balancePct: balPct,
      expensePct: expPct,
      incomePct: incPct,
    };
  }, [hasActiveFilter, summary, filteredTransactions]);

  const resetAllFilters = () => {
    setSelectedAccount('All Accounts');
    setSelectedMonth('All Months');
    setSelectedYear('All Years');
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // 7 days data for Statistics chart
  const weekStats = [
    { day: '1', name: 'Mon', inc: 300, exp: 50, date: '01 May 2024' },
    { day: '2', name: 'Tue', inc: 800, exp: 120, date: '02 May 2024' },
    { day: '3', name: 'Wed', inc: 1500, exp: 400, date: '03 May 2024' },
    { day: '4', name: 'Thu', inc: 900, exp: 800, date: 'Mon, 04.05.2024' },
    { day: '5', name: 'Fri', inc: 400, exp: 150, date: '05 May 2024' },
    { day: '6', name: 'Sat', inc: 200, exp: 80, date: '06 May 2024' },
    { day: '7', name: 'Sun', inc: 100, exp: 30, date: '07 May 2024' },
  ];

  const maxVal = 2000;

  // SVG Line Chart coordinates math
  const chartW = 460;
  const chartH = 150;
  const padX = 25;
  const padY = 20;
  const usableW = chartW - padX * 2;
  const usableH = chartH - padY * 2;

  const pointsIncome = weekStats.map((item, i) => {
    const x = padX + (i / (weekStats.length - 1)) * usableW;
    const y = padY + usableH - (item.inc / maxVal) * usableH;
    return { x, y, item, i };
  });

  const pointsExpense = weekStats.map((item, i) => {
    const x = padX + (i / (weekStats.length - 1)) * usableW;
    const y = padY + usableH - (item.exp / maxVal) * usableH;
    return { x, y, item, i };
  });

  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');
  };

  const lineIncomePath = makeSmoothPath(pointsIncome);
  const lineExpensePath = makeSmoothPath(pointsExpense);

  const areaIncomePath = `${lineIncomePath} L ${pointsIncome[pointsIncome.length - 1].x},${chartH} L ${pointsIncome[0].x},${chartH} Z`;
  const areaExpensePath = `${lineExpensePath} L ${pointsExpense[pointsExpense.length - 1].x},${chartH} L ${pointsExpense[0].x},${chartH} Z`;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsAccountOpen(false);
        setIsMonthOpen(false);
        setIsYearOpen(false);
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-5 select-none">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Unique Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-white via-slate-100 to-violet-200 bg-clip-text text-transparent">
                WealthPulse
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                HQ
              </span>
            </h1>
          </div>

          {/* Quick Settings & Search Buttons */}
          <div className="flex items-center gap-1.5 ml-1 dropdown-container relative">
            <button
              onClick={() => setIsSettingsOpen(p => !p)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isSettingsOpen
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title="Dashboard Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Quick Settings Dropdown */}
            {isSettingsOpen && (
              <div className="absolute left-0 top-9 z-50 w-64 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-3 shadow-2xl space-y-2 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#2D265C]">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
                    Quick Preferences
                  </span>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="p-2 rounded-xl bg-[#120F2D] flex items-center justify-between">
                    <span>Currency Standard</span>
                    <span className="font-bold text-emerald-400">₹ INR</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#120F2D] flex items-center justify-between">
                    <span>Theme</span>
                    <span className="text-violet-300 font-semibold">{isDarkMode ? 'Dark Navy' : 'Light'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onNavigate?.('settings');
                  }}
                  className="w-full mt-1 py-1.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Open Full Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              onClick={() => setIsSearchOpen(p => !p)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isSearchOpen || searchQuery
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title="Search Transactions"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdowns & Filters Row */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {/* Account selector dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsAccountOpen(p => !p);
                setIsMonthOpen(false);
                setIsYearOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl bg-[#1C183D] border text-slate-200 flex items-center gap-1.5 hover:border-violet-500 transition cursor-pointer ${
                selectedAccount !== 'All Accounts'
                  ? 'border-violet-500/70 text-violet-200'
                  : 'border-[#2D265C]'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-violet-400" />
              <span className="max-w-[120px] truncate">{selectedAccount}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-10 z-50 w-52 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-1.5 shadow-2xl space-y-1 max-h-60 overflow-y-auto animate-in fade-in duration-100">
                {accountOptions.map(acc => (
                  <button
                    key={acc}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setIsAccountOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 rounded-xl text-left flex items-center justify-between transition cursor-pointer text-[11px] ${
                      selectedAccount === acc
                        ? 'bg-violet-600/25 text-violet-300 font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{acc}</span>
                    {selectedAccount === acc && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Month selector dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsMonthOpen(p => !p);
                setIsAccountOpen(false);
                setIsYearOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl bg-[#1C183D] border text-slate-200 flex items-center gap-1.5 hover:border-violet-500 transition cursor-pointer ${
                selectedMonth !== 'All Months'
                  ? 'border-violet-500/70 text-violet-200'
                  : 'border-[#2D265C]'
              }`}
            >
              <span>{selectedMonth}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isMonthOpen && (
              <div className="absolute right-0 top-10 z-50 w-44 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-1.5 shadow-2xl space-y-1 max-h-60 overflow-y-auto animate-in fade-in duration-100">
                {monthOptions.map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setIsMonthOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 rounded-xl text-left flex items-center justify-between transition cursor-pointer text-[11px] ${
                      selectedMonth === m
                        ? 'bg-violet-600/25 text-violet-300 font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedMonth === m && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year selector dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsYearOpen(p => !p);
                setIsAccountOpen(false);
                setIsMonthOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl bg-[#1C183D] border text-slate-200 flex items-center gap-1.5 hover:border-violet-500 transition cursor-pointer ${
                selectedYear !== 'All Years'
                  ? 'border-violet-500/70 text-violet-200'
                  : 'border-[#2D265C]'
              }`}
            >
              <span>{selectedYear}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isYearOpen && (
              <div className="absolute right-0 top-10 z-50 w-36 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-1.5 shadow-2xl space-y-1 animate-in fade-in duration-100">
                {yearOptions.map(y => (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y);
                      setIsYearOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 rounded-xl text-left flex items-center justify-between transition cursor-pointer text-[11px] ${
                      selectedYear === y
                        ? 'bg-violet-600/25 text-violet-300 font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{y}</span>
                    {selectedYear === y && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Edit Profile trigger with Photo option */}
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="p-1.5 rounded-xl bg-[#1C183D] border border-[#2D265C] text-slate-400 hover:text-white hover:border-violet-500 transition cursor-pointer"
            title="Edit Profile & Add Photo"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Reset Filters Badge */}
          {hasActiveFilter && (
            <button
              onClick={resetAllFilters}
              className="px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 transition flex items-center gap-1 text-[10px] font-bold cursor-pointer"
              title="Reset all filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {(isSearchOpen || searchQuery) && (
        <div className="p-2.5 rounded-2xl bg-[#1C183D] border border-violet-500/40 flex items-center gap-2 text-xs shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <Search className="w-4 h-4 text-violet-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by description, category, bank account, notes..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-[12px]"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] text-violet-300 font-semibold px-2 py-0.5 rounded-md bg-violet-600/30 shrink-0">
            {filteredTransactions.length} found
          </span>
        </div>
      )}

      {/* Top 3 Summary Cards - dynamically updated & compact font sizes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="rounded-2xl bg-[#1C183D] border border-[#2D265C] p-4 sm:p-5 relative overflow-hidden shadow-xl hover:border-cyan-500/40 transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-slate-400 text-[11px] font-semibold block mb-0.5">Balance</span>
              <span className="text-[10px] text-slate-500">
                {dynamicSummary.txCount} {dynamicSummary.txCount === 1 ? 'Transaction' : 'Transactions'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-cyan-400/80 bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-[11px] shadow-sm shadow-cyan-400/20">
              {dynamicSummary.balancePct}%
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
            {formatCurrency(dynamicSummary.balance)}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {hasActiveFilter ? 'Filtered net balance' : 'Total net balance'}
          </div>
        </div>

        {/* Expense Card */}
        <div className="rounded-2xl bg-[#1C183D] border border-[#2D265C] p-4 sm:p-5 relative overflow-hidden shadow-xl hover:border-rose-500/40 transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-slate-400 text-[11px] font-semibold block mb-0.5">Expense</span>
              <span className="text-[10px] text-slate-500">
                {dynamicSummary.expenseCount} {dynamicSummary.expenseCount === 1 ? 'Transaction' : 'Transactions'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-rose-500/80 bg-rose-500/10 flex items-center justify-center text-rose-400 font-black text-[11px] shadow-sm shadow-rose-500/20">
              -{dynamicSummary.expensePct}%
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-bold text-rose-400 tracking-tight">
            -{formatCurrency(dynamicSummary.expense)}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {hasActiveFilter ? 'Filtered expenditure' : 'Total debited expenditure'}
          </div>
        </div>

        {/* Income Card */}
        <div className="rounded-2xl bg-[#1C183D] border border-[#2D265C] p-4 sm:p-5 relative overflow-hidden shadow-xl hover:border-emerald-500/40 transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-slate-400 text-[11px] font-semibold block mb-0.5">Income</span>
              <span className="text-[10px] text-slate-500">
                {dynamicSummary.incomeCount} {dynamicSummary.incomeCount === 1 ? 'Transaction' : 'Transactions'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-emerald-400/80 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-[11px] shadow-sm shadow-emerald-400/20">
              {dynamicSummary.incomePct}%
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-bold text-emerald-400 tracking-tight">
            +{formatCurrency(dynamicSummary.income)}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            {hasActiveFilter ? 'Filtered earnings' : 'Total credited revenue'}
          </div>
        </div>
      </div>

      {/* Middle Grid Row: Categories Mosaic | Statistics Bar/Line Chart | Reminders Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Categories Mosaic Tiles Block (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
              Categories
            </h3>
            {/* Expenses / Incomes toggle pills */}
            <div className="flex p-0.5 rounded-lg bg-[#120F2D] text-[10px] font-semibold border border-[#26204C]">
              <button
                onClick={() => setCatType('expenses')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  catType === 'expenses'
                    ? 'bg-[#292257] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setCatType('incomes')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  catType === 'incomes'
                    ? 'bg-[#292257] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Incomes
              </button>
            </div>
          </div>

          {/* Mosaic Grid: switches cleanly between Expenses and Incomes */}
          {catType === 'expenses' ? (
            <div className="grid grid-cols-3 gap-2.5 flex-1">
              {/* Rent & Housing 30% */}
              <button
                onClick={() => onSelectCategory('Rent & Housing')}
                className="col-span-1 row-span-2 rounded-2xl bg-[#59420D]/60 border border-[#8C6714]/40 hover:brightness-110 transition p-3 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <Home className="w-6 h-6 text-[#FBBF24] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#FDE68A]">30%</span>
                <span className="text-[9px] text-[#FDE68A]/70 truncate max-w-full">Housing</span>
              </button>

              {/* Food & Groceries 20% */}
              <button
                onClick={() => onSelectCategory('Food & Groceries')}
                className="col-span-2 rounded-2xl bg-[#3E1668]/60 border border-[#6B21A8]/40 hover:brightness-110 transition p-2.5 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Milk className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <span className="text-xs font-bold text-violet-200 block">20%</span>
                  <span className="text-[9px] text-violet-300/70">Groceries</span>
                </div>
              </button>

              {/* Shopping 15% */}
              <button
                onClick={() => onSelectCategory('Shopping')}
                className="col-span-1 rounded-2xl bg-[#064E3B]/60 border border-[#059669]/40 hover:brightness-110 transition p-2.5 flex flex-col items-center justify-center cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-emerald-200">15%</span>
              </button>

              {/* Education 10% */}
              <button
                onClick={() => onSelectCategory('Education')}
                className="col-span-1 rounded-2xl bg-[#0E4C56]/60 border border-[#0891B2]/40 hover:brightness-110 transition p-2.5 flex flex-col items-center justify-center cursor-pointer group"
              >
                <BookOpen className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-cyan-200">10%</span>
              </button>

              {/* Personal Care 9% */}
              <button
                onClick={() => onSelectCategory('Personal Care')}
                className="rounded-xl bg-[#5C1D24]/60 border border-[#E11D48]/40 p-2 flex flex-col items-center justify-center group cursor-pointer"
              >
                <HeartPulse className="w-4 h-4 text-rose-400 mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-rose-200">9%</span>
              </button>

              {/* Fitness 8% */}
              <button
                onClick={() => onSelectCategory('Entertainment')}
                className="rounded-xl bg-[#4A1D6B]/60 border border-[#9333EA]/40 p-2 flex flex-col items-center justify-center group cursor-pointer"
              >
                <Dumbbell className="w-4 h-4 text-purple-400 mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-purple-200">8%</span>
              </button>

              {/* Gaming 5% */}
              <button
                onClick={() => onSelectCategory('Entertainment')}
                className="rounded-xl bg-[#52410D]/60 border border-[#CA8A04]/40 p-2 flex flex-col items-center justify-center group cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-yellow-400 mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-yellow-200">5%</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 flex-1">
              {/* Salary 60% */}
              <button
                onClick={() => onSelectCategory('Salary')}
                className="col-span-2 row-span-2 rounded-2xl bg-[#064E3B]/60 border border-[#059669]/40 hover:brightness-110 transition p-4 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <Briefcase className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-emerald-200">60%</span>
                <span className="text-[10px] text-emerald-300/80">Monthly Salary</span>
              </button>

              {/* Freelance 20% */}
              <button
                onClick={() => onSelectCategory('Freelance')}
                className="col-span-1 rounded-2xl bg-[#0E4C56]/60 border border-[#0891B2]/40 hover:brightness-110 transition p-2.5 flex flex-col items-center justify-center cursor-pointer group"
              >
                <Laptop className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-cyan-200">20%</span>
                <span className="text-[9px] text-cyan-300/70">Freelance</span>
              </button>

              {/* Investments 12% */}
              <button
                onClick={() => onSelectCategory('Investments')}
                className="col-span-1 rounded-2xl bg-[#3E1668]/60 border border-[#6B21A8]/40 hover:brightness-110 transition p-2.5 flex flex-col items-center justify-center cursor-pointer group"
              >
                <Coins className="w-5 h-5 text-violet-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-violet-200">12%</span>
                <span className="text-[9px] text-violet-300/70">Returns</span>
              </button>

              {/* Gifts 8% */}
              <button
                onClick={() => onSelectCategory('Gifts & Donations')}
                className="col-span-3 rounded-xl bg-[#59420D]/60 border border-[#8C6714]/40 p-2 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-amber-200">Gifts & Grants (8%)</span>
              </button>
            </div>
          )}

          <div className="pt-2 text-right">
            <span className="text-[10px] text-slate-400">
              {catType === 'expenses' ? 'Others 3%' : 'Bonus & Interest included'}
            </span>
          </div>
        </div>

        {/* Statistics Chart (5 cols) - Fully Functional Bar & Line Graph */}
        <div className="lg:col-span-5 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-5 shadow-xl flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              Statistics
            </h3>
            {/* Bar / Line toggle */}
            <div className="flex p-0.5 rounded-lg bg-[#120F2D] text-[10px] font-semibold border border-[#26204C]">
              <button
                onClick={() => setStatType('bar')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  statType === 'bar' ? 'bg-[#292257] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bar Graph
              </button>
              <button
                onClick={() => setStatType('line')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  statType === 'line' ? 'bg-[#292257] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Line Graph
              </button>
            </div>
          </div>

          {/* Subheader: Period + Legend */}
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold">Weekly Velocity</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Expense
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Income
              </span>
            </div>
          </div>

          {/* Chart Display Area: Respects statType (Bar vs Line) */}
          {statType === 'bar' ? (
            /* Dual Bar Chart */
            <div className="relative h-52 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-700/30">
              {weekStats.map((item, idx) => {
                const incH = Math.round((item.inc / maxVal) * 100);
                const expH = Math.round((item.exp / maxVal) * 100);
                const isHovered = hoveredBarIndex === idx;

                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group"
                  >
                    {/* Tooltip bubble on hover */}
                    {isHovered && (
                      <div className="absolute -top-10 z-20 px-2.5 py-1 rounded-xl bg-[#120F2D] border border-cyan-400 text-cyan-300 text-[10px] font-bold shadow-xl shadow-cyan-400/20 whitespace-nowrap animate-in fade-in duration-100">
                        <div>+₹{item.inc} / -₹{item.exp}</div>
                        <div className="text-[8px] text-slate-400 font-normal">{item.date}</div>
                      </div>
                    )}

                    <div className="flex items-end justify-center gap-1 w-full h-full pb-2">
                      {/* Income Bar (Green Gradient) */}
                      <div
                        className="w-3 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-300 hover:brightness-125"
                        style={{ height: `${incH}%` }}
                      />
                      {/* Expense Bar (Coral Gradient) */}
                      <div
                        className="w-3 rounded-t-lg bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-300 hover:brightness-125"
                        style={{ height: `${expH}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.day}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Smooth SVG Line Chart with Dual Lines, Area Glow & Hover Tooltips */
            <div className="relative h-52 flex flex-col justify-end pt-2 pb-2 border-b border-slate-700/30">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full h-40 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Income Line Gradient Area */}
                  <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Expense Line Gradient Area */}
                  <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Horizontal Grid Lines */}
                  <pattern id="gridLine" width="100%" height="35" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="100%" y2="0" stroke="#2D265C" strokeWidth="1" strokeDasharray="3 3" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#gridLine)" />

                {/* Area Fills */}
                <path d={areaIncomePath} fill="url(#incomeAreaGrad)" />
                <path d={areaExpensePath} fill="url(#expenseAreaGrad)" />

                {/* Line Curves */}
                <path
                  d={lineIncomePath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={lineExpensePath}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {pointsIncome.map(pt => (
                  <circle
                    key={`inc-${pt.i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredBarIndex === pt.i ? 5 : 3.5}
                    fill="#10B981"
                    stroke="#1C183D"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredBarIndex(pt.i)}
                  />
                ))}

                {pointsExpense.map(pt => (
                  <circle
                    key={`exp-${pt.i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredBarIndex === pt.i ? 5 : 3.5}
                    fill="#F43F5E"
                    stroke="#1C183D"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredBarIndex(pt.i)}
                  />
                ))}
              </svg>

              {/* Day Labels along bottom */}
              <div className="flex justify-between items-center px-4 pt-1">
                {weekStats.map((item, idx) => (
                  <span
                    key={item.day}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    className={`text-[10px] font-semibold cursor-pointer transition ${
                      hoveredBarIndex === idx ? 'text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                ))}
              </div>

              {/* Active Line Hover Floating Badge */}
              {hoveredBarIndex !== null && (
                <div className="absolute top-2 right-4 px-2 py-1 rounded-lg bg-[#120F2D] border border-cyan-400 text-cyan-300 text-[10px] font-bold shadow-md shadow-cyan-400/20">
                  <span>Day {weekStats[hoveredBarIndex].day}: </span>
                  <span className="text-emerald-400">+₹{weekStats[hoveredBarIndex].inc}</span> /{' '}
                  <span className="text-rose-400">-₹{weekStats[hoveredBarIndex].exp}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500">
            <span>Scale: ₹0 – ₹2,000</span>
            <span>Smooth Real-Time Interpolation</span>
          </div>
        </div>

        {/* Reminders Panel (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
              Reminders
            </h3>
            <button
              onClick={onOpenAddModal}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-0.5">
            {/* Today Section */}
            <div>
              <div className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-[9px] font-bold text-violet-300 mb-1.5 border border-violet-500/20">
                Today, 4 May
              </div>
              <div className="space-y-1.5">
                <div
                  onClick={() => onMarkReminderPaid(1)}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Circle className="w-3.5 h-3.5 text-violet-400 hover:fill-violet-400 transition" />
                    <span className="text-slate-200 font-medium text-[11px]">Pay Monthly Loan</span>
                  </div>
                  <span className="text-[10px] text-slate-400">▾</span>
                </div>
              </div>
            </div>

            {/* Tomorrow Section */}
            <div>
              <div className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-[9px] font-bold text-slate-300 mb-1.5 border border-slate-700/30">
                Tomorrow, 5 May
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <Circle className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-slate-200 font-medium text-[11px] truncate max-w-[130px]">
                    Online Meeting with Client
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">▾</span>
              </div>
            </div>

            {/* Later Section */}
            <div>
              <div className="text-[9px] font-bold text-slate-500 mb-1 px-1">Tuesday, 25 May</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 p-1 text-slate-300 hover:text-white cursor-pointer text-[11px]">
                  <Circle className="w-3 h-3 text-slate-500" />
                  <span>Send Money to Kate</span>
                </div>
                <div className="flex items-center gap-2 p-1 text-slate-300 hover:text-white cursor-pointer text-[11px]">
                  <Circle className="w-3 h-3 text-slate-500" />
                  <span>Cancel Subscription</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Row: Balance Concentric Gauges / Bar | Transactions Feed | Upcoming Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Balance Concentric Gauge Circles / Comparative Bar (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              Balance Breakdown
            </h3>
            {/* Pie / Bar toggle */}
            <div className="flex p-0.5 rounded-lg bg-[#120F2D] text-[10px] font-semibold border border-[#26204C]">
              <button
                onClick={() => setBalanceChartType('pie')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  balanceChartType === 'pie'
                    ? 'bg-[#292257] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pie Chart
              </button>
              <button
                onClick={() => setBalanceChartType('bar')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  balanceChartType === 'bar'
                    ? 'bg-[#292257] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bar Graph
              </button>
            </div>
          </div>

          {/* Toggle between Gauge Rings and Comparative Bars */}
          {balanceChartType === 'pie' ? (
            <div className="flex items-center justify-between gap-4 my-auto py-2">
              {/* Triple Gauge Rings */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Outer Ring: Income 100% (Emerald) */}
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#221C4A" strokeWidth="5" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="5"
                    strokeDasharray="263.89 0"
                    strokeLinecap="round"
                  />

                  {/* Middle Ring: Expense (Coral/Red) */}
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#221C4A" strokeWidth="5" />
                  <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="5"
                    strokeDasharray={`${(dynamicSummary.expensePct / 100) * 213.6} 213.6`}
                    strokeLinecap="round"
                  />

                  {/* Inner Ring: Balance (Cyan/Blue) */}
                  <circle cx="50" cy="50" r="26" fill="none" stroke="#221C4A" strokeWidth="5" />
                  <circle
                    cx="50"
                    cy="50"
                    r="26"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="5"
                    strokeDasharray={`${(dynamicSummary.balancePct / 100) * 163.3} 163.3`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Legend with dynamically updated values */}
              <div className="space-y-2.5 text-xs flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-300 text-[11px] font-medium">Balance</span>
                  <span className="font-bold text-white text-[11px] ml-auto">
                    {dynamicSummary.balancePct}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-300 text-[11px] font-medium">Expense</span>
                  <span className="font-bold text-white text-[11px] ml-auto">
                    {dynamicSummary.expensePct}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-300 text-[11px] font-medium">Income</span>
                  <span className="font-bold text-white text-[11px] ml-auto">
                    {dynamicSummary.incomePct}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Comparative Bars View */
            <div className="my-auto py-2 space-y-3.5">
              {/* Income Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-1">
                  <span className="text-emerald-400">Income</span>
                  <span className="text-white font-bold">{formatCurrency(dynamicSummary.income)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#120F2D] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-full" />
                </div>
              </div>

              {/* Expense Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-1">
                  <span className="text-rose-400">Expense</span>
                  <span className="text-white font-bold">-{formatCurrency(dynamicSummary.expense)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#120F2D] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400"
                    style={{ width: `${Math.min(100, dynamicSummary.expensePct)}%` }}
                  />
                </div>
              </div>

              {/* Balance Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold mb-1">
                  <span className="text-cyan-400">Net Savings</span>
                  <span className="text-white font-bold">{formatCurrency(dynamicSummary.balance)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#120F2D] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                    style={{ width: `${Math.min(100, dynamicSummary.balancePct)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Feed (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
              <span>Transactions</span>
              {hasActiveFilter && (
                <span className="text-[9px] text-violet-300 font-normal">
                  ({filteredTransactions.length} of {recent_transactions.length})
                </span>
              )}
            </h3>
            <button
              onClick={onSeeAllTransactions}
              className="text-[11px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer transition"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live Transactions list (filtered by search/account/month/year) */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-1">
            {filteredTransactions.length === 0 ? (
              <div className="text-slate-500 text-[11px] text-center py-8">
                {hasActiveFilter
                  ? 'No transactions match current filters.'
                  : 'No transactions yet — click "+ Add New" to create one!'}
              </div>
            ) : (
              filteredTransactions.slice(0, 8).map(t => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        t.type === 'income'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                    </div>
                    <div>
                      <span className="font-semibold text-white text-[11px] block leading-tight truncate max-w-[130px]">
                        {t.title}
                      </span>
                      <span
                        className={`text-[9px] ${
                          t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        #{t.category.toLowerCase().replace(/\s+/g, '_')}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[10px] hidden sm:inline truncate max-w-[90px]">
                    {t.account_name}
                  </span>
                  <span
                    className={`font-bold text-[11px] ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Panel (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#1C183D] border border-[#2D265C] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
              Upcoming
            </h3>
            <button
              onClick={onOpenAddModal}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-0.5">
            {/* Today Section */}
            <div>
              <div className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-[9px] font-bold text-violet-300 mb-1.5 border border-violet-500/20">
                Today, 4 May
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Home className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-slate-200 font-semibold text-[11px] block leading-tight">
                      Home bills
                    </span>
                    <span className="text-[9px] text-slate-400">#electricity</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Home className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-slate-200 font-semibold text-[11px] block leading-tight">
                      Home bills
                    </span>
                    <span className="text-[9px] text-slate-400">#rent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Friday Section */}
            <div>
              <div className="text-[9px] font-bold text-slate-500 mb-1 px-1">Friday, 10 May</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5">
                  <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-slate-200 font-medium text-[11px] block leading-tight">
                      Entertainment
                    </span>
                    <span className="text-[9px] text-slate-400">#subscription</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5">
                  <Wallet className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-200 font-medium text-[11px] block leading-tight">
                      Transport
                    </span>
                    <span className="text-[9px] text-slate-400">#monthly_ticket</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal with Photo Upload Support */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
