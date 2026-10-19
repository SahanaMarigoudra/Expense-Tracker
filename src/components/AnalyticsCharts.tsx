import { useMemo } from 'react';
import { PieChart, TrendingUp } from 'lucide-react';

type Transaction = {
  id: number;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  transaction_date: string;
};

export default function AnalyticsCharts({ transactions }: { transactions: Transaction[] }) {
  // Compute category breakdown for expenses
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);

    const map: Record<string, number> = {};
    expenses.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

    const colors = [
      '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
      '#8b5cf6', '#14b8a6', '#f43f5e', '#84cc16', '#64748b'
    ];

    return Object.entries(map)
      .map(([cat, amount], idx) => ({
        category: cat,
        amount,
        percentage: totalExp > 0 ? (amount / totalExp) * 100 : 0,
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Compute daily / timeline spend
  const recentTimeline = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    // Group by date (last 7 recorded distinct dates)
    const map: Record<string, number> = {};
    expenses.forEach(t => {
      map[t.transaction_date] = (map[t.transaction_date] || 0) + t.amount;
    });

    const sortedDates = Object.keys(map).sort();
    const lastDates = sortedDates.slice(-7);
    const maxVal = Math.max(...lastDates.map(d => map[d]), 1);

    return lastDates.map(date => ({
      date,
      amount: map[date],
      heightPct: Math.round((map[date] / maxVal) * 100)
    }));
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const savingsRate = totalIncome > 0
    ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Category Breakdown Card */}
      <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Expense Breakdown by Category</h3>
              <p className="text-xs text-slate-400">Where your money goes across all categories</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            {categoryData.length} Categories
          </span>
        </div>

        {categoryData.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No expense data available to generate visual breakdown.
          </div>
        ) : (
          <div className="space-y-4">
            {categoryData.slice(0, 5).map(item => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.category}
                  </span>
                  <span className="font-semibold text-slate-900">
                    ${item.amount.toFixed(2)}{' '}
                    <span className="text-slate-400 font-normal">({item.percentage.toFixed(1)}%)</span>
                  </span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spending Trend & Health Score Card */}
      <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Financial Insights</h3>
              <p className="text-xs text-slate-400">Real-time health & spending velocity</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Savings Rate
              </span>
              <span className="text-2xl font-black text-indigo-600">{savingsRate}%</span>
              <span className="text-[11px] text-slate-400 block mt-1">Target: &gt;20%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Financial Health
              </span>
              <span className={`text-2xl font-black ${savingsRate >= 30 ? 'text-emerald-600' : savingsRate >= 10 ? 'text-amber-500' : 'text-rose-500'}`}>
                {savingsRate >= 30 ? 'Excellent' : savingsRate >= 10 ? 'Moderate' : 'Tight'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Based on Net Balance</span>
            </div>
          </div>

          {/* Mini Bar Chart */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-3">Daily Outflow Velocity</span>
            {recentTimeline.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No trend history available yet.</p>
            ) : (
              <div className="flex items-end justify-between gap-2 h-28 pt-4">
                {recentTimeline.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      ${Math.round(item.amount)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t-md transition-all duration-300 group-hover:from-indigo-600 group-hover:to-violet-500"
                      style={{ height: `${Math.max(item.heightPct, 8)}%` }}
                    />
                    <span className="text-[9px] text-slate-400 truncate max-w-full">
                      {item.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Net Outflow: <strong className="text-slate-800">${totalExpense.toFixed(2)}</strong></span>
          <span>Inflow: <strong className="text-emerald-600">${totalIncome.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
}
