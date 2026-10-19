import { useEffect, useState } from 'react';

type SummaryData = {
  total_income: number;
  total_expense: number;
  net_savings: number;
  transaction_count: number;
};

export default function SummaryCards({ refreshKey }: { refreshKey: number }) {
  const [summary, setSummary] = useState<SummaryData>({
    total_income: 0,
    total_expense: 0,
    net_savings: 0,
    transaction_count: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8002/api/summary');
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error('Failed to fetch summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [refreshKey]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Net Balance / Savings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Balance</span>
          <span className={`p-2 rounded-xl text-xs font-medium ${summary.net_savings >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
            {summary.net_savings >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {loading ? '...' : formatCurrency(summary.net_savings)}
        </div>
        <p className="text-xs text-slate-500 mt-2">Overall balance across all transactions</p>
      </div>

      {/* Total Income Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Income</span>
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-bold text-emerald-600 tracking-tight">
          {loading ? '...' : formatCurrency(summary.total_income)}
        </div>
        <p className="text-xs text-slate-500 mt-2">Total earnings registered</p>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Expenses</span>
          <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-bold text-rose-600 tracking-tight">
          {loading ? '...' : formatCurrency(summary.total_expense)}
        </div>
        <p className="text-xs text-slate-500 mt-2">Total spent across categories</p>
      </div>

      {/* Total Transactions Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Activity</span>
          <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {loading ? '...' : summary.transaction_count}
        </div>
        <p className="text-xs text-slate-500 mt-2">Total transactions recorded</p>
      </div>
    </div>
  );
}
