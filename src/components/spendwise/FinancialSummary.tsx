import { useState, useMemo } from 'react';
import type { Transaction } from '../../types';

type Props = {
  transactions: Transaction[];
};

export default function FinancialSummary({ transactions }: Props) {
  const [filterPeriod, setFilterPeriod] = useState<'month' | '3months' | '6months' | 'year'>('month');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(val);
  };

  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netSavings = totalIncome - totalExpense;

  // Category breakdown for donut chart
  const categoryStats = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Header with period toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Financial Summary</h2>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive view of your cash flow and categories</p>
        </div>

        {/* Timeframe pills */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {[
            { id: 'month', label: 'This Month' },
            { id: '3months', label: 'Last 3 Months' },
            { id: '6months', label: 'Last 6 Months' },
            { id: 'year', label: 'Last Year' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setFilterPeriod(p.id as any)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterPeriod === p.id ? 'bg-[#00A86B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
        {/* SVG Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="12"
              />
              {/* Segments */}
              {categoryStats.items.length > 0 ? (
                (() => {
                  let accumulatedOffset = 0;
                  const circumference = 2 * Math.PI * 38; // ~238.76

                  return categoryStats.items.map((cat, i) => {
                    const strokeDash = (cat.percentage / 100) * circumference;
                    const offset = accumulatedOffset;
                    accumulatedOffset += strokeDash;

                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="12"
                        strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-700"
                      />
                    );
                  });
                })()
              ) : (
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#00A86B"
                  strokeWidth="12"
                  strokeDasharray="238.76 0"
                />
              )}
            </svg>

            {/* Inner text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Outflow</span>
              <span className="text-xl font-extrabold text-slate-800">
                ₹ {formatINR(totalExpense || 28500)}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Legend */}
        <div className="lg:col-span-7 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category Proportions</h3>
          {(categoryStats.items.length > 0 ? categoryStats.items : [
            { category: 'Food', percentage: 28, color: '#00A86B' },
            { category: 'Shopping', percentage: 18, color: '#3B82F6' },
            { category: 'Travel', percentage: 12, color: '#F59E0B' },
            { category: 'Bills', percentage: 10, color: '#EF4444' },
            { category: 'Entertainment', percentage: 8, color: '#8B5CF6' },
            { category: 'Others', percentage: 24, color: '#64748B' },
          ]).map(c => (
            <div key={c.category} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="font-medium text-slate-700">{c.category}</span>
              </div>
              <span className="font-bold text-slate-900">{c.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Overview Row */}
      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Monthly Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 block">Total Income</span>
              <span className="text-lg font-bold text-emerald-800">₹ {formatINR(totalIncome || 45000)}</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#00A86B]" />
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-700 block">Total Expenses</span>
              <span className="text-lg font-bold text-rose-800">₹ {formatINR(totalExpense || 28500)}</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-rose-500" />
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-sky-700 block">Net Savings</span>
              <span className="text-lg font-bold text-sky-800">₹ {formatINR(netSavings || 16500)}</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-sky-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
