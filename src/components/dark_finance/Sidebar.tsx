import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Scale,
  CreditCard,
  Target,
  Trophy,
  Clock,
  Bell,
  Calendar,
  BarChart3,
  History,
  Settings,
  Sun,
  Moon,
  LogOut,
  Plus,
  Sparkles,
  ChevronLeft,
  Edit2
} from 'lucide-react';
import EditProfileModal, { type UserProfile } from './EditProfileModal';

export type NavPage =
  | 'dashboard'
  | 'transactions'
  | 'categories'
  | 'balance'
  | 'accounts'
  | 'budgets'
  | 'goals'
  | 'upcoming'
  | 'reminders'
  | 'calendar'
  | 'reports'
  | 'history'
  | 'settings';

type SidebarProps = {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenAddModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  isOpen?: boolean;
  onToggleCollapse?: () => void;
};

export default function Sidebar({
  activePage,
  onNavigate,
  onOpenAddModal,
  isDarkMode,
  onToggleTheme,
  onLogout,
  isOpen = true,
  onToggleCollapse
}: SidebarProps) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('spendwise_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Nick Jenkins',
      tag: 'Personal Account',
      avatarColor: 'from-violet-700 to-indigo-600',
    };
  });

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem('spendwise_profile', JSON.stringify(updated));
    window.dispatchEvent(new Event('spendwise_profile_updated'));
  };

  React.useEffect(() => {
    const handler = () => {
      const saved = localStorage.getItem('spendwise_profile');
      if (saved) {
        try { setProfile(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('spendwise_profile_updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('spendwise_profile_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const primaryNav = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as NavPage, label: 'Transactions', icon: Receipt },
    { id: 'categories' as NavPage, label: 'Categories', icon: Tags },
    { id: 'balance' as NavPage, label: 'Balance', icon: Scale },
    { id: 'accounts' as NavPage, label: 'Accounts', icon: CreditCard },
    { id: 'budgets' as NavPage, label: 'Budgets', icon: Target },
    { id: 'goals' as NavPage, label: 'Goals', icon: Trophy },
    { id: 'upcoming' as NavPage, label: 'Upcoming', icon: Clock },
  ];

  const secondaryNav = [
    { id: 'reminders' as NavPage, label: 'Reminders', icon: Bell },
    { id: 'calendar' as NavPage, label: 'Calendar', icon: Calendar },
    { id: 'reports' as NavPage, label: 'Reports', icon: BarChart3 },
    { id: 'history' as NavPage, label: 'History', icon: History },
    { id: 'settings' as NavPage, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {isOpen && (
        <div
          onClick={onToggleCollapse}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity cursor-pointer"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 lg:w-64 flex flex-col shrink-0 min-h-screen border-r transition-all duration-300 ease-in-out select-none shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        } ${
          isDarkMode
            ? 'bg-[#120F2D] border-[#221C4A] text-slate-200'
            : 'bg-white border-slate-200 text-slate-700'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-opacity-10 border-slate-400">
          <div
            onClick={onLogout}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Back to Landing Page"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-violet-100" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-tight text-white group-hover:text-violet-300 transition-colors">SpendWise</span>
              <span className="text-[10px] text-violet-400 font-semibold tracking-wider uppercase">Pro Dashboard</span>
            </div>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Full screen report (Collapse sidebar)"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

      {/* User Profile */}
      <div className="px-5 py-4 flex flex-col items-center border-b border-opacity-10 border-slate-400 text-center">
        <div
          onClick={() => setIsEditProfileOpen(true)}
          className="relative mb-2 cursor-pointer group"
          title="Click to edit profile"
        >
          <div className={`w-16 h-16 rounded-full ring-2 ring-violet-500/50 overflow-hidden bg-gradient-to-tr ${profile.avatarColor} flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:ring-4 group-hover:scale-105 transition-all`}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#120F2D] absolute bottom-0 right-1" />
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
            <Edit2 className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => setIsEditProfileOpen(true)}
          className="cursor-pointer group flex flex-col items-center"
          title="Click to edit profile"
        >
          <span className="font-bold text-sm tracking-tight text-white group-hover:text-violet-300 transition flex items-center gap-1.5">
            {profile.name}
            <Edit2 className="w-3 h-3 text-slate-500 group-hover:text-violet-400" />
          </span>
          <span className="text-[11px] text-slate-400">{profile.tag}</span>
        </div>

        {/* Glowing + Add New Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-500 hover:brightness-110 shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Add New</span>
        </button>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-xs font-medium">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#251E52] text-white font-bold border-l-4 border-violet-500 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="py-2 px-3">
          <div className="h-px bg-slate-700/40 w-full" />
        </div>

        {secondaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#251E52] text-white font-bold border-l-4 border-violet-500 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Pro Account & Mode Toggle */}
      <div className="p-4 border-t border-opacity-10 border-slate-400 space-y-3">
        {/* Pro Account Banner */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-emerald-500/20 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Pro Account</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
        </div>

        {/* Light/Dark Mode Switch */}
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-3.5 h-3.5 text-violet-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <button
            onClick={onToggleTheme}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
              isDarkMode ? 'bg-violet-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Log Out */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Landing Page</span>
        </button>
      </div>
    </aside>
  </>
  );
}
