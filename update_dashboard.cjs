const fs = require('fs');

const file = 'd:/Expense Tracker/src/components/dark_finance/DashboardOverview.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Check to lucide imports
content = content.replace("  Circle\n} from 'lucide-react';", "  Circle,\n  Check\n} from 'lucide-react';");

// 2. Add onNavigate to Props
content = content.replace(
  "  onMarkReminderPaid: (id: number) => void;\n  isDarkMode: boolean;\n};",
  "  onMarkReminderPaid: (id: number) => void;\n  onNavigate?: (page: string) => void;\n  isDarkMode: boolean;\n};"
);

// 3. Add onNavigate to function signature
content = content.replace(
  "  onMarkReminderPaid,\n  isDarkMode\n}: Props) {",
  "  onMarkReminderPaid,\n  onNavigate,\n  isDarkMode\n}: Props) {"
);

// 4. Add dropdown states
const stateBlock = `  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear().toString());
  const [openDropdown, setOpenDropdown] = useState<'account' | 'month' | 'year' | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(3);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const yearsList = ['2024', '2025', '2026', '2027'];

  const { summary, recent_transactions, category_breakdown, monthly_trend, reminders, accounts } = data;

  const currentAccountObj = accounts.find(a => a.name === selectedAccount);
  const displayedBalance = (selectedAccount !== 'All Accounts' && currentAccountObj)
    ? currentAccountObj.current_balance
    : summary.total_balance;

  const displayedTransactions = selectedAccount === 'All Accounts'
    ? recent_transactions
    : recent_transactions.filter(t => t.account_name === selectedAccount);`;

content = content.replace(
  /  const \[selectedAccount, setSelectedAccount\] = useState\('All Accounts'\);\r?\n  const \[hoveredBarIndex, setHoveredBarIndex\] = useState<number \| null>\(3\);\r?\n\r?\n  const \{ summary, recent_transactions, category_breakdown, monthly_trend, reminders, accounts \} = data;/,
  stateBlock
);

// 5. Replace Top Header Controls Bar
const topBarOldRegex = /\{\/\* Top Header Controls Bar \*\/\}[\s\S]*?\{\/\* Top 3 Summary Cards matching reference \*\/\}/;

const topBarNew = `{/* Top Header Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            My Dashboard
          </h1>
          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={() => onNavigate?.('settings')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Settings & Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onSeeAllTransactions}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Search Transactions"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold relative">
          {/* Account selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(curr => curr === 'account' ? null : 'account')}
              className={\`px-3.5 py-2 rounded-xl bg-[#1C183D] border transition flex items-center gap-2 cursor-pointer \${
                openDropdown === 'account' ? 'border-violet-500 text-white shadow-md' : 'border-[#2D265C] text-slate-200 hover:border-violet-500'
              }\`}
              title="Filter by account"
            >
              <Wallet className="w-3.5 h-3.5 text-violet-400" />
              <span>{selectedAccount}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {openDropdown === 'account' && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-52 rounded-2xl bg-[#1C183D] border border-[#2D265C] shadow-2xl z-40 py-1.5 animate-in fade-in">
                <button
                  type="button"
                  onClick={() => { setSelectedAccount('All Accounts'); setOpenDropdown(null); }}
                  className="w-full px-3.5 py-2 text-left hover:bg-violet-600/20 flex items-center justify-between text-xs text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>All Accounts</span>
                  {selectedAccount === 'All Accounts' && <Check className="w-3.5 h-3.5 text-violet-400" />}
                </button>
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => { setSelectedAccount(acc.name); setOpenDropdown(null); }}
                    className="w-full px-3.5 py-2 text-left hover:bg-violet-600/20 flex items-center justify-between text-xs text-slate-200 hover:text-white cursor-pointer"
                  >
                    <span>{acc.name}</span>
                    {selectedAccount === acc.name && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Month selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(curr => curr === 'month' ? null : 'month')}
              className={\`px-3.5 py-2 rounded-xl bg-[#1C183D] border transition flex items-center gap-2 cursor-pointer \${
                openDropdown === 'month' ? 'border-violet-500 text-white shadow-md' : 'border-[#2D265C] text-slate-200 hover:border-violet-500'
              }\`}
              title="Select month"
            >
              <span>{selectedMonth}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'month' && (
              <div className="absolute right-0 top-full mt-2 w-40 max-h-60 overflow-y-auto rounded-2xl bg-[#1C183D] border border-[#2D265C] shadow-2xl z-40 py-1.5 animate-in fade-in">
                {monthsList.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setSelectedMonth(m); setOpenDropdown(null); }}
                    className="w-full px-3.5 py-2 text-left hover:bg-violet-600/20 flex items-center justify-between text-xs text-slate-200 hover:text-white cursor-pointer"
                  >
                    <span>{m}</span>
                    {selectedMonth === m && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(curr => curr === 'year' ? null : 'year')}
              className={\`px-3.5 py-2 rounded-xl bg-[#1C183D] border transition flex items-center gap-2 cursor-pointer \${
                openDropdown === 'year' ? 'border-violet-500 text-white shadow-md' : 'border-[#2D265C] text-slate-200 hover:border-violet-500'
              }\`}
              title="Select year"
            >
              <span>{selectedYear}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'year' && (
              <div className="absolute right-0 top-full mt-2 w-32 rounded-2xl bg-[#1C183D] border border-[#2D265C] shadow-2xl z-40 py-1.5 animate-in fade-in">
                {yearsList.map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => { setSelectedYear(y); setOpenDropdown(null); }}
                    className="w-full px-3.5 py-2 text-left hover:bg-violet-600/20 flex items-center justify-between text-xs text-slate-200 hover:text-white cursor-pointer"
                  >
                    <span>{y}</span>
                    {selectedYear === y && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Edit / Quick Add Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="p-2 rounded-xl bg-[#1C183D] border border-[#2D265C] text-slate-400 hover:text-white hover:border-violet-500 transition cursor-pointer active:scale-95"
            title="Record New Transaction"
          >
            <Edit2 className="w-3.5 h-3.5 text-violet-400" />
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards matching reference */}`;

content = content.replace(topBarOldRegex, topBarNew);

// 6. Use displayedBalance in Balance card
content = content.replace(
  "{formatCurrency(summary.net_savings)}",
  "{formatCurrency(displayedBalance)}"
);

// 7. Use displayedTransactions in Transactions list
content = content.replace(
  "recent_transactions.slice(0, 8).map(t => (",
  "displayedTransactions.slice(0, 8).map(t => ("
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated DashboardOverview.tsx with interactive controls');
