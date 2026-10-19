import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  ArrowDown,
  ArrowUp,
  Wallet,
  Zap,
  ShoppingCart,
  CreditCard,
  ChevronRight as ChevronRightSmall,
  ShoppingBag,
  Fuel,
  Home,
  Wifi,
  Smartphone,
  Utensils,
  Briefcase,
  DollarSign,
  User,
  Clock
} from 'lucide-react';
import type { Transaction, Reminder } from '../../types/finance';

type Props = {
  transactions: Transaction[];
  reminders: Reminder[];
  isDarkMode: boolean;
  onNavigate?: (page: string) => void;
};

// Rich default data matching the reference screenshot for October 2026
const DEMO_MONTH_DATA: Record<
  number,
  {
    type: 'income' | 'expense' | 'bill';
    amount: number;
    title: string;
    hasBill?: boolean;
    billName?: string;
    bothDots?: boolean;
    secondary?: { type: 'income' | 'expense'; amount: number; title: string };
  }
> = {
  1: { type: 'expense', amount: 2500, title: 'Mobile Recharge', hasBill: true },
  2: { type: 'income', amount: 12000, title: 'Freelance Payment' },
  5: { type: 'expense', amount: 1240, title: 'Groceries' },
  7: { type: 'expense', amount: 2850, title: 'Fuel' },
  8: { type: 'income', amount: 25000, title: 'Salary' },
  10: { type: 'expense', amount: 1800, title: 'Shopping' },
  12: { type: 'expense', amount: 3450, title: 'Utilities' },
  14: { type: 'expense', amount: 780, title: 'Food' },
  15: { type: 'income', amount: 20000, title: 'Freelance Payment' },
  16: { type: 'expense', amount: 355, title: 'Internet' },
  18: { type: 'expense', amount: 255, title: 'Electricity Bill', bothDots: true },
  21: { type: 'expense', amount: 1200, title: 'Food' },
  23: { type: 'bill', amount: 4500, title: 'Credit Card', hasBill: true, billName: 'Credit Card' },
  27: { type: 'expense', amount: 950, title: 'Petrol' },
  29: { type: 'income', amount: 15000, title: 'Salary' },
  30: { type: 'bill', amount: 8200, title: 'EMI', hasBill: true, billName: 'EMI' },
};

// Sample detailed transactions for day 18 matching reference
const DAY_18_DETAILS = [
  {
    id: 101,
    title: 'Electricity Bill',
    category: 'Utilities • Electricity',
    time: '05:32 PM',
    amount: 255,
    type: 'expense' as const,
    icon: Zap,
    iconBg: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 102,
    title: 'Grocery Store',
    category: 'Food & Groceries • Supermarket',
    time: '12:14 PM',
    amount: 1240,
    type: 'expense' as const,
    icon: ShoppingCart,
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 103,
    title: 'Salary Credit',
    category: 'Income • Salary',
    time: '09:00 AM',
    amount: 20000,
    type: 'income' as const,
    icon: CreditCard,
    iconBg: 'bg-blue-600/20 text-blue-400',
  },
];

export default function CalendarPage({ transactions, reminders, isDarkMode, onNavigate }: Props) {
  // Set default to October 2026 and day 18 to match reference
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1)); // October 2026
  const [selectedDay, setSelectedDay] = useState<number>(18);

  // User profile name from localStorage
  const [userName, setUserName] = useState('Sahana');

  useEffect(() => {
    const saved = localStorage.getItem('spendwise_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          const first = parsed.name.trim().split(' ')[0];
          setUserName(first || 'Sahana');
        }
      } catch (e) {}
    }
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 1));
    setSelectedDay(18);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isDemoMonth = year === 2026 && month === 9; // October 2026

  // Date Key formatter YYYY-MM-DD
  const dateKey = (day: number) => {
    const dStr = String(day).padStart(2, '0');
    const mStr = String(month + 1).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  // Day Name for selected date e.g. "Sunday, October 18"
  const selectedDateObj = new Date(year, month, selectedDay);
  const selectedDayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const selectedMonthName = selectedDateObj.toLocaleDateString('en-US', { month: 'long' });

  // Get data for selected day
  const selectedDayDetails = useMemo(() => {
    if (isDemoMonth && selectedDay === 18) {
      return {
        txList: DAY_18_DETAILS,
        totalSpent: 255,
        totalIncome: 0,
        availableBalance: 18745,
        expenseCount: 1,
        incomeCount: 1,
        totalTxCount: 2,
      };
    }

    // Dynamic data from real transactions
    const dk = dateKey(selectedDay);
    const dayTxs = transactions.filter(t => t.transaction_date === dk);
    const incTxs = dayTxs.filter(t => t.type === 'income');
    const expTxs = dayTxs.filter(t => t.type === 'expense');

    const totInc = incTxs.reduce((s, t) => s + t.amount, 0);
    const totExp = expTxs.reduce((s, t) => s + t.amount, 0);

    // If on demo month, fall back to sample day data if no real transactions exist
    if (isDemoMonth && DEMO_MONTH_DATA[selectedDay] && dayTxs.length === 0) {
      const demo = DEMO_MONTH_DATA[selectedDay];
      const isInc = demo.type === 'income';
      const isExp = demo.type === 'expense';
      const isBill = demo.type === 'bill';

      const demoList = [
        {
          id: 500 + selectedDay,
          title: demo.title,
          category: isInc ? 'Income • Freelance' : 'General • ' + demo.title,
          time: '02:30 PM',
          amount: demo.amount,
          type: (isInc ? 'income' : 'expense') as 'income' | 'expense',
          icon: isInc ? CreditCard : isBill ? CreditCard : ShoppingCart,
          iconBg: isInc
            ? 'bg-blue-600/20 text-blue-400'
            : isBill
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-emerald-500/20 text-emerald-400',
        },
      ];

      return {
        txList: demoList,
        totalSpent: isInc ? 0 : demo.amount,
        totalIncome: isInc ? demo.amount : 0,
        availableBalance: Math.max(0, 18745 + (isInc ? demo.amount : -demo.amount)),
        expenseCount: isInc ? 0 : 1,
        incomeCount: isInc ? 1 : 0,
        totalTxCount: 1,
      };
    }

    return {
      txList: dayTxs.map((t, idx) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        time: '12:00 PM',
        amount: t.amount,
        type: t.type,
        icon: t.type === 'income' ? CreditCard : ShoppingCart,
        iconBg: t.type === 'income' ? 'bg-blue-600/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400',
      })),
      totalSpent: totExp,
      totalIncome: totInc,
      availableBalance: 18745 + totInc - totExp,
      expenseCount: expTxs.length,
      incomeCount: incTxs.length,
      totalTxCount: dayTxs.length,
    };
  }, [selectedDay, isDemoMonth, transactions, year, month]);

  return (
    <div className="space-y-5 select-none font-sans text-white">
      {/* ─── Top Header Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>Financial</span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                Calendar
              </span>
            </h1>
            <p className="text-[11px] text-blue-200/50">Your money, mapped out.</p>
          </div>
        </div>

        {/* Month Selector + Today + User Profile */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
          {/* Month Stepper Pill */}
          <div className="flex items-center rounded-xl bg-[#0B172C] border border-[#182C4E] p-0.5 shadow-md">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 flex items-center gap-2 text-white font-bold text-[12px] min-w-[130px] justify-center">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {monthNames[month]} {year}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl bg-[#16294C] hover:bg-[#1E3768] text-blue-200 border border-blue-500/30 text-xs font-bold transition shadow-sm cursor-pointer active:scale-95"
          >
            Today
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#0B172C] border border-[#182C4E] text-xs text-white shadow-md">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Hi, {userName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid: Calendar (Left) + Selected Day (Right) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ─── Left Column: Calendar Grid Box (8 cols) ─── */}
        <div className="lg:col-span-8 rounded-3xl bg-[#0A1628]/95 border border-[#162846] p-5 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Weekdays Row */}
            <div className="grid grid-cols-7 text-center text-xs text-slate-400 font-medium pb-3 border-b border-[#142642]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-2 pt-3">
              {/* Previous Month Padding Empty Cells */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="rounded-2xl bg-[#081224]/30 border border-[#102038]/40 min-h-[92px]"
                />
              ))}

              {/* Days in Current Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;

                // Match demo or real transaction data
                const demo = isDemoMonth ? DEMO_MONTH_DATA[day] : null;

                const dk = dateKey(day);
                const realTxs = transactions.filter(t => t.transaction_date === dk);
                const realRems = reminders.filter(r => r.due_date === dk);

                const hasRealInc = realTxs.some(t => t.type === 'income');
                const hasRealExp = realTxs.some(t => t.type === 'expense');
                const totRealInc = realTxs
                  .filter(t => t.type === 'income')
                  .reduce((s, t) => s + t.amount, 0);
                const totRealExp = realTxs
                  .filter(t => t.type === 'expense')
                  .reduce((s, t) => s + t.amount, 0);

                const hasBill = demo?.hasBill || realRems.length > 0;
                const isExpense = demo ? demo.type === 'expense' : hasRealExp;
                const isIncome = demo ? demo.type === 'income' : hasRealInc;
                const isBillDue = demo?.type === 'bill';

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-2xl p-2.5 text-left transition relative flex flex-col justify-between cursor-pointer min-h-[92px] ${
                      isSelected
                        ? 'border-2 border-blue-500 bg-blue-600/15 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                        : 'border border-[#142642] bg-[#0C1830] hover:border-blue-500/40 hover:bg-[#0F203C]'
                    }`}
                  >
                    {/* Top Row: Day Number + Amber Bell if Bill is Due */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {day}
                      </span>
                      {hasBill && (
                        <Bell className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400/20" />
                      )}
                    </div>

                    {/* Middle Content inside Day Cell */}
                    <div className="w-full space-y-0.5 text-left">
                      {/* Special Day 18 display with two dots matching reference */}
                      {day === 18 && isDemoMonth ? (
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            <span>₹255</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block truncate leading-tight">
                            Electricity Bill
                          </span>
                        </div>
                      ) : demo ? (
                        <div>
                          {isExpense && (
                            <>
                              <div className="flex items-center gap-1 text-[10.5px] font-bold text-rose-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                <span>₹{demo.amount.toLocaleString('en-IN')}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 block truncate leading-tight">
                                {demo.title}
                              </span>
                            </>
                          )}

                          {isIncome && (
                            <>
                              <div className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                <span>₹{demo.amount.toLocaleString('en-IN')}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 block truncate leading-tight">
                                {demo.title}
                              </span>
                            </>
                          )}

                          {isBillDue && (
                            <>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                                <Bell className="w-2.5 h-2.5 shrink-0 text-amber-400" />
                                <span>1 due</span>
                              </div>
                              <span className="text-[9px] text-slate-400 block truncate leading-tight">
                                {demo.billName}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        /* Dynamic data from real transactions */
                        <div>
                          {totRealExp > 0 && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                              <span>-{formatCurrency(totRealExp)}</span>
                            </div>
                          )}
                          {totRealInc > 0 && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>+{formatCurrency(totRealInc)}</span>
                            </div>
                          )}
                          {realRems.length > 0 && (
                            <div className="text-[9px] text-amber-300 font-semibold flex items-center gap-1">
                              <Bell className="w-2.5 h-2.5 text-amber-400" />
                              <span>{realRems.length} due</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Legend Pill Bar inside Calendar Card */}
          <div className="pt-5 flex items-center">
            <div className="inline-flex items-center gap-5 px-4 py-1.5 rounded-full bg-[#081224] border border-[#162846] text-[11px] text-slate-300 shadow-md">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Income</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Expense</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-amber-400" />
                <span>Upcoming Bill</span>
              </span>
            </div>
          </div>
        </div>

        {/* ─── Right Column: Selected Day Detail Sidebar (4 cols) ─── */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0A1628]/95 border border-[#162846] p-5 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-5">
            {/* Day Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10 shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">
                  {selectedDayName}, {selectedMonthName} {selectedDay}
                </h2>
                <p className="text-[11px] text-blue-200/50">
                  {selectedDayDetails.totalTxCount} transactions • {selectedDayDetails.expenseCount} expense • {selectedDayDetails.incomeCount} income
                </p>
              </div>
            </div>

            {/* 3 Metric Summary Cards: Total Spent | Income | Available Balance */}
            <div className="grid grid-cols-3 gap-2">
              {/* Total Spent */}
              <div className="p-2.5 rounded-2xl bg-[#0C1830] border border-[#162846] flex flex-col justify-between shadow-md">
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Total Spent</span>
                  <span className="text-xs font-bold text-white flex items-center gap-0.5 mt-0.5">
                    ₹{selectedDayDetails.totalSpent.toLocaleString('en-IN')}
                    <ChevronRightSmall className="w-3 h-3 text-slate-500" />
                  </span>
                </div>
              </div>

              {/* Income */}
              <div className="p-2.5 rounded-2xl bg-[#0C1830] border border-[#162846] flex flex-col justify-between shadow-md">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5">
                  <ArrowUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Income</span>
                  <span className="text-xs font-bold text-white flex items-center gap-0.5 mt-0.5">
                    ₹{selectedDayDetails.totalIncome.toLocaleString('en-IN')}
                    <ChevronRightSmall className="w-3 h-3 text-slate-500" />
                  </span>
                </div>
              </div>

              {/* Available Balance */}
              <div className="p-2.5 rounded-2xl bg-[#0C1830] border border-[#162846] flex flex-col justify-between shadow-md">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-1.5">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Available Balance</span>
                  <span className="text-xs font-bold text-white flex items-center gap-0.5 mt-0.5">
                    ₹{selectedDayDetails.availableBalance.toLocaleString('en-IN')}
                    <ChevronRightSmall className="w-3 h-3 text-slate-500" />
                  </span>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div>
              <h3 className="text-xs font-bold text-white mb-2.5 tracking-tight">
                Transactions
              </h3>

              <div className="space-y-2">
                {selectedDayDetails.txList.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#0C1830]/50 border border-[#142642] text-center text-slate-400 text-xs">
                    No transactions on this day.
                  </div>
                ) : (
                  selectedDayDetails.txList.map(tx => {
                    const IconComponent = tx.icon;
                    return (
                      <div
                        key={tx.id}
                        className="p-3 rounded-2xl bg-[#0C1830] border border-[#162846] hover:border-blue-500/40 transition flex items-center justify-between shadow-md group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${tx.iconBg} flex items-center justify-center shrink-0`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block leading-tight">
                              {tx.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {tx.category}
                            </span>
                            <span className="text-[9px] text-slate-500 block">
                              {tx.time}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-1">
                          <span
                            className={`font-extrabold text-xs ${
                              tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                          <ChevronRightSmall className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Bills Section (Bottom of Sidebar) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <h4 className="text-xs font-bold text-white">Upcoming Bills</h4>
              </div>
              <button
                onClick={() => onNavigate?.('reminders')}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* Bill Item Card */}
            <div className="p-3 rounded-2xl bg-[#0C1830] border border-[#162846] flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block leading-tight">
                    Credit Card Bill
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Due in 5 days • Oct 23, 2026
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate?.('reminders')}
                className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500/20 transition cursor-pointer"
              >
                <span>Upcoming</span>
                <ChevronRightSmall className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
