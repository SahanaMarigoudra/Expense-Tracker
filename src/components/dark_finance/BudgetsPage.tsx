import { API } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { Target, Trophy, Plus, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import type { Budget, SavingsGoal, Category } from '../../types/finance';

type Props = {
  categories: Category[];
  isDarkMode: boolean;
};

export default function BudgetsPage({ categories, isDarkMode }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState<number | null>(null);
  const [contribAmount, setContribAmount] = useState('');

  // Budget form
  const [budgetCat, setBudgetCat] = useState(categories[0]?.name || 'Food & Groceries');
  const [budgetLimit, setBudgetLimit] = useState('');

  // Goal form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDate, setGoalDate] = useState('');

  const fetchData = async () => {
    try {
      const [bRes, gRes] = await Promise.all([
        fetch(`${API}/budgets`),
        fetch(`${API}/goals`)
      ]);
      if (bRes.ok && gRes.ok) {
        setBudgets(await bRes.json());
        setGoals(await gRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: budgetCat,
          monthly_limit: parseFloat(budgetLimit)
        })
      });
      setShowAddBudget(false);
      setBudgetLimit('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: goalTitle,
          target_amount: parseFloat(goalTarget),
          current_amount: parseFloat(goalCurrent) || 0.0,
          target_date: goalDate || undefined
        })
      });
      setShowAddGoal(false);
      setGoalTitle('');
      setGoalTarget('');
      setGoalCurrent('');
      setGoalDate('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleContribute = async (goalId: number) => {
    const amt = parseFloat(contribAmount);
    if (!amt || amt <= 0) return;
    try {
      await fetch(`${API}/goals/${goalId}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt })
      });
      setShowContributeModal(null);
      setContribAmount('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-10">
      {/* ================= SECTION 1: BUDGETS ================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Target className="w-6 h-6 text-violet-400" />
              <span>Monthly Budgets & Category Limits</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Set spending thresholds to prevent overspending</p>
          </div>

          <button
            onClick={() => setShowAddBudget(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Set Category Budget</span>
          </button>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(b => {
            const isOver = b.spent > b.monthly_limit;
            return (
              <div
                key={b.id}
                className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-base text-white">{b.category}</h3>
                    {isOver ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3" /> Over Budget
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> On Track
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between text-xs mb-3">
                    <span className="text-slate-400">Spent: <strong className="text-white">{formatCurrency(b.spent)}</strong></span>
                    <span className="text-slate-400">Limit: <strong className="text-violet-300">{formatCurrency(b.monthly_limit)}</strong></span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 rounded-full bg-[#120F2D] overflow-hidden border border-slate-700/40">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-rose-500' : b.percentage >= 80 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(b.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 text-[11px] text-slate-400">
                  <span>{b.percentage}% consumed</span>
                  <span>{formatCurrency(b.remaining)} remaining</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION 2: SAVINGS GOALS ================= */}
      <div className="space-y-6 pt-4 border-t border-slate-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Savings Goals & Milestones</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Track target funds for vacation, emergency, education, or tech purchases</p>
          </div>

          <button
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 shadow-lg shadow-amber-500/30 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Savings Goal</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(g => (
            <div
              key={g.id}
              className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-base text-white">{g.title}</h3>
                  <span className="text-xs font-extrabold text-amber-400">{g.progress_percentage}%</span>
                </div>

                <div className="flex items-baseline justify-between text-xs mb-3">
                  <span className="text-slate-400">Saved: <strong className="text-emerald-400">{formatCurrency(g.current_amount)}</strong></span>
                  <span className="text-slate-400">Target: <strong className="text-white">{formatCurrency(g.target_amount)}</strong></span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#120F2D] overflow-hidden border border-slate-700/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${g.progress_percentage}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {g.target_date ? `Due: ${g.target_date}` : 'Ongoing Goal'}
                </span>
                <button
                  onClick={() => setShowContributeModal(g.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-sm"
                >
                  + Deposit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Set Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 max-w-md w-full shadow-2xl text-xs font-semibold">
            <h3 className="text-base font-bold text-white mb-4">Set Monthly Category Budget</h3>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={budgetCat}
                  onChange={e => setBudgetCat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                >
                  {categories.filter(c => c.type === 'expense').map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Monthly Limit (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  placeholder="500.00"
                  value={budgetLimit}
                  onChange={e => setBudgetLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAddBudget(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-md">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 max-w-md w-full shadow-2xl text-xs font-semibold">
            <h3 className="text-base font-bold text-white mb-4">Create Savings Goal</h3>
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund, New MacBook"
                  value={goalTitle}
                  onChange={e => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Target Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="2000.00"
                    value={goalTarget}
                    onChange={e => setGoalTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Saved ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={goalCurrent}
                    onChange={e => setGoalCurrent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Date</label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={e => setGoalDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAddGoal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-400 shadow-md">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 max-w-sm w-full shadow-2xl text-xs font-semibold">
            <h3 className="text-base font-bold text-white mb-2">Deposit to Goal</h3>
            <p className="text-slate-400 mb-4 text-[11px]">Add funds towards this target savings milestone</p>
            <input
              type="number"
              step="0.01"
              min="1"
              placeholder="Contribution amount ($)"
              value={contribAmount}
              onChange={e => setContribAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowContributeModal(null)} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={() => handleContribute(showContributeModal)}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-md"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
