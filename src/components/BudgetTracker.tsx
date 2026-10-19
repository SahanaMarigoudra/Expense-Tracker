import { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Transaction = {
  id: number;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  transaction_date: string;
};

type Budget = {
  category: string;
  limit: number;
};

export default function BudgetTracker({ transactions }: { transactions: Transaction[] }) {
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food & Dining', limit: 500 },
    { category: 'Shopping', limit: 300 },
    { category: 'Entertainment', limit: 150 },
    { category: 'Housing & Rent', limit: 1200 },
  ]);

  const [newCat, setNewCat] = useState('Food & Dining');
  const [newLimit, setNewLimit] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Compute spend per category
  const spendMap = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(newLimit);
    if (!limitNum || limitNum <= 0) return;

    setBudgets(prev => {
      const existing = prev.filter(b => b.category !== newCat);
      return [...existing, { category: newCat, limit: limitNum }];
    });
    setNewLimit('');
    setShowAdd(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Monthly Budget Limits & Targets</h3>
            <p className="text-xs text-slate-400">Track spending thresholds to avoid overspending</p>
          </div>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition self-start sm:self-auto"
        >
          {showAdd ? 'Close' : '+ Set Category Budget'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddBudget} className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
            <input
              type="text"
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              placeholder="e.g. Groceries"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
              required
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Monthly Limit ($)</label>
            <input
              type="number"
              value={newLimit}
              onChange={e => setNewLimit(e.target.value)}
              placeholder="500"
              min="1"
              step="1"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Save Limit
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {budgets.map(b => {
          const spent = spendMap[b.category] || 0;
          const percentage = Math.min(100, Math.round((spent / b.limit) * 100));
          const isOver = spent > b.limit;

          return (
            <div key={b.category} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-800 truncate pr-2">{b.category}</span>
                {isOver ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Over
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> On Track
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between text-xs mb-2">
                <span className="text-slate-500 font-medium">Spent: <strong className="text-slate-800">${spent.toFixed(0)}</strong></span>
                <span className="text-slate-400 text-[11px]">Limit: ${b.limit}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver ? 'bg-rose-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>{percentage}% used</span>
                <span>${Math.max(0, b.limit - spent).toFixed(0)} remaining</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
