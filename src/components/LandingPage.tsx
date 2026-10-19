import {
  Wallet,
  ArrowRight,
  Zap,
  BarChart3,
  Database,
  Lock,
  Layers,
  Sparkles,
  CheckCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function LandingPage({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-violet-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">ExpenseFlow</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                v2.0 Full-Stack
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            <a href="#security" className="hover:text-white transition">Privacy & Tech</a>
          </nav>

          <button
            onClick={onOpenDashboard}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Powered by FastAPI 0.135 & SQLite 3.54
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          Master Your Money with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400">
            Absolute Clarity.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          A high-performance, private expense tracker built with FastAPI, SQLite, and React. Track income, budget spending, and visualize real-time analytics with sub-millisecond precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onOpenDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="http://127.0.0.1:8002/docs"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span>Explore Swagger API</span>
          </a>
        </div>

        {/* Feature Highlights Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Local SQLite Storage
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Sub-millisecond Query Latency
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Zero Cloud Dependency
          </span>
        </div>
      </section>

      {/* Interactive Mock Preview */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24">
        <div className="relative rounded-2xl border border-slate-700/80 bg-slate-800/60 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-400 ml-2 font-mono">expenseflow-dashboard.internal</span>
            </div>
            <button
              onClick={onOpenDashboard}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Enter Dashboard &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Net Savings</span>
              <span className="text-2xl font-bold text-white">$2,500.00</span>
              <span className="text-[11px] text-emerald-400 block mt-1">+100% Surplus Rate</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Monthly Inflow</span>
              <span className="text-2xl font-bold text-emerald-400">$2,500.00</span>
              <span className="text-[11px] text-slate-400 block mt-1">Verified via SQLite</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Budget Health Score</span>
              <span className="text-2xl font-bold text-indigo-400">98 / 100</span>
              <span className="text-[11px] text-slate-400 block mt-1">Optimal liquidity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 block">
            Engineered For Performance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything You Need To Track, Analyze & Save.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Category Breakdown</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated category aggregation gives you clear visual bars and percentages for food, housing, bills, and entertainment.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Fast Summary</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Powered by SQLite and SQLAlchemy queries calculating balance, expenses, and income across all dates in microseconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">100% Data Privacy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your financial logs never leave your device. All records remain encrypted and stored locally in your SQLite database.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Budget Thresholds</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Define monthly budget caps per category and receive visual alert badges the moment spending exceeds target thresholds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Flexible Filtering</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Filter transaction history by date, type (Income or Expense), category, or search keywords instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">RESTful FastAPI Architecture</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Built on OpenAPI standards with full Swagger UI documentation, strict Pydantic v2 validation, and clean REST endpoints.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-indigo-900/60 via-slate-800/80 to-violet-900/60 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            No signup needed. Start tracking your transactions and analyzing your spending habits immediately.
          </p>
          <button
            onClick={onOpenDashboard}
            className="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        ExpenseFlow • Built with FastAPI, SQLite, React & Vite © 2026
      </footer>
    </div>
  );
}
