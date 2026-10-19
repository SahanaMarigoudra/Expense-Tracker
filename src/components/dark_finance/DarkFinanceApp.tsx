import { useState, useEffect, useCallback } from 'react';
import Sidebar, { type NavPage } from './Sidebar';
import DashboardOverview from './DashboardOverview';
import TransactionsPage from './TransactionsPage';
import CategoriesPage from './CategoriesPage';
import AccountsPage from './AccountsPage';
import BudgetsPage from './BudgetsPage';
import RemindersPage from './RemindersPage';
import CalendarPage from './CalendarPage';
import SettingsPage from './SettingsPage';
import AddTransactionModal from './AddTransactionModal';
import type {
  DashboardData,
  Account,
  Category
} from '../../types/finance';

const API = 'http://127.0.0.1:8002/api';

const defaultDash: DashboardData = {
  summary: {
    total_balance: 0, total_income: 0, total_expense: 0,
    net_savings: 0, transaction_count: 0, income_count: 0,
    expense_count: 0, balance_pct: 72, expense_pct: 28, income_pct: 100
  },
  recent_transactions: [],
  category_breakdown: [],
  monthly_trend: [],
  reminders: [],
  upcoming: [],
  accounts: []
};

type Props = { onLogout: () => void };

export default function DarkFinanceApp({ onLogout }: Props) {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dashData, setDashData] = useState<DashboardData>(defaultDash);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchAll = useCallback(async () => {
    try {
      const [dashRes, accsRes, catsRes] = await Promise.all([
        fetch(`${API}/dashboard`),
        fetch(`${API}/accounts`),
        fetch(`${API}/categories`)
      ]);

      if (dashRes.ok) setDashData(await dashRes.json());
      if (accsRes.ok) setAccounts(await accsRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const bg = isDarkMode ? 'bg-[#0D0B21]' : 'bg-slate-100';

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardOverview
            data={dashData}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSeeAllTransactions={() => setActivePage('transactions')}
            onSelectCategory={(cat) => setActivePage('categories')}
            onMarkReminderPaid={async (id) => {
              await fetch(`${API}/reminders/${id}/pay`, { method: 'POST' });
              fetchAll();
            }}
            onNavigate={(page) => setActivePage(page as NavPage)}
            isDarkMode={isDarkMode}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            categories={categories}
            accounts={accounts}
            isDarkMode={isDarkMode}
            onSuccess={fetchAll}
            initialCategoryFilter={categoryFilter}
          />
        );
      case 'categories':
        return (
          <CategoriesPage
            categories={categories}
            isDarkMode={isDarkMode}
            onRefresh={fetchAll}
            onFilterByCategory={(catName) => {
              setCategoryFilter(catName);
              setActivePage('transactions');
            }}
          />
        );
      case 'accounts':
      case 'balance':
        return (
          <AccountsPage
            accounts={accounts}
            isDarkMode={isDarkMode}
            onRefresh={fetchAll}
          />
        );
      case 'budgets':
      case 'goals':
        return (
          <BudgetsPage
            categories={categories}
            isDarkMode={isDarkMode}
          />
        );
      case 'reminders':
      case 'upcoming':
        return (
          <RemindersPage
            categories={categories}
            accounts={accounts}
            isDarkMode={isDarkMode}
          />
        );
      case 'calendar':
        return (
          <CalendarPage
            transactions={dashData.recent_transactions}
            reminders={dashData.reminders}
            isDarkMode={isDarkMode}
            onNavigate={(page) => setActivePage(page as NavPage)}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            accounts={accounts}
            categories={categories}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(p => !p)}
            onRefreshAll={fetchAll}
          />
        );
      case 'history':
        return (
          <TransactionsPage
            categories={categories}
            accounts={accounts}
            isDarkMode={isDarkMode}
            onSuccess={fetchAll}
            initialCategoryFilter={categoryFilter}
          />
        );
      case 'reports':
      default:
        return (
          <DashboardOverview
            data={dashData}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSeeAllTransactions={() => setActivePage('transactions')}
            onSelectCategory={(_cat) => setActivePage('categories')}
            onMarkReminderPaid={async (id: number) => {
              await fetch(`${API}/reminders/${id}/pay`, { method: 'POST' });
              fetchAll();
            }}
            onNavigate={(page) => setActivePage(page as NavPage)}
            isDarkMode={isDarkMode}
          />
        );
    }
  };

  return (
    <div className={`flex min-h-screen ${bg} transition-colors duration-200`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(p => !p)}
        onLogout={onLogout}
      />

      <main className="flex-1 overflow-y-auto p-6 md:p-8 max-h-screen">
        {/* Backend status banner */}
        {backendOnline === false && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
            ⚠️ Backend offline — start with:&nbsp;
            <code className="bg-black/30 px-2 py-0.5 rounded">
              uvicorn backend.app.main:app --host 127.0.0.1 --port 8002
            </code>
          </div>
        )}

        {renderPage()}
      </main>

      {isAddModalOpen && (
        <AddTransactionModal
          isOpen={true}
          categories={categories}
          accounts={accounts}
          isDarkMode={isDarkMode}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => { setIsAddModalOpen(false); fetchAll(); }}
        />
      )}
    </div>
  );
}
