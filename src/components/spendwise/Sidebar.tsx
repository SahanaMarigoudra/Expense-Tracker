import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  Tags,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Sprout
} from 'lucide-react';

export type TabType = 'dashboard' | 'add_transaction' | 'transactions' | 'categories' | 'budget' | 'reports' | 'settings';

type SidebarProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onBackToLanding: () => void;
};

export default function Sidebar({
  activeTab,
  onTabChange,
  onOpenAddModal,
  onBackToLanding
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add_transaction' as TabType, label: 'Add Transaction', icon: PlusCircle, isAction: true },
    { id: 'transactions' as TabType, label: 'Transactions', icon: Receipt },
    { id: 'categories' as TabType, label: 'Categories', icon: Tags },
    { id: 'budget' as TabType, label: 'Budget', icon: Target },
    { id: 'reports' as TabType, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B1E19] text-white flex flex-col min-h-screen border-r border-[#15342C] shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-[#15342C]/60">
        <div className="w-9 h-9 rounded-xl bg-[#00A86B] flex items-center justify-center text-white shadow-lg shadow-[#00A86B]/30">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white block leading-tight">SpendWise</span>
          <span className="text-[10px] text-[#00A86B] font-medium tracking-wide">SMART EXPENSE TRACKER</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 px-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  onOpenAddModal();
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00A86B] text-white shadow-md shadow-[#00A86B]/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00A86B]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer / Exit to Landing */}
      <div className="p-4 border-t border-[#15342C]/60">
        <button
          onClick={onBackToLanding}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Exit to Landing Page</span>
        </button>
      </div>
    </aside>
  );
}
