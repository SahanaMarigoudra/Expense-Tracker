import { API } from '../../config/api';
import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, Search, X } from 'lucide-react';
import type { Category, TransactionType } from '../../types/finance';

type Props = {
  categories: Category[];
  onRefresh: () => void;
  onFilterByCategory?: (categoryName: string) => void;
  isDarkMode: boolean;
};

/* ─── Category metadata: image + subtitle ─── */
const CATEGORY_META: Record<string, { img: string; sub: string; border: string }> = {
  // ── Expense ──
  'Bills & Utilities': {
    img: '/categories/bills-utilities.jpg',
    sub: 'Electricity, Water, Internet, Phone',
    border: 'from-yellow-400 via-orange-400 to-pink-500',
  },
  'Education': {
    img: '/categories/education.jpg',
    sub: 'Fees, Books, Courses',
    border: 'from-blue-400 via-indigo-500 to-violet-500',
  },
  'Electronics': {
    img: '/categories/electronics.jpg',
    sub: 'Mobiles, Laptops, Gadgets',
    border: 'from-cyan-400 via-blue-500 to-indigo-600',
  },
  'Entertainment': {
    img: '/categories/entertainment.jpg',
    sub: 'Movies, OTT, Events, Hobbies',
    border: 'from-pink-500 via-rose-500 to-orange-400',
  },
  'Food & Groceries': {
    img: '/categories/food-groceries.jpg',
    sub: 'Groceries, Dining, Beverages',
    border: 'from-green-400 via-emerald-500 to-teal-500',
  },
  'Fuel': {
    img: '/categories/fuel.jpg',
    sub: 'Petrol, Diesel, EV Charging',
    border: 'from-amber-400 via-orange-500 to-red-500',
  },
  'Gifts & Donations': {
    img: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80',
    sub: 'Gifts, Charity, Donations',
    border: 'from-pink-400 via-rose-400 to-red-400',
  },
  'Healthcare & Medicines': {
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    sub: 'Doctor Visits, Medicines, Health',
    border: 'from-sky-400 via-cyan-400 to-teal-400',
  },
  'Home & Maintenance': {
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    sub: 'Repairs, Cleaning, Household',
    border: 'from-amber-500 via-yellow-400 to-lime-400',
  },
  'Insurance': {
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
    sub: 'Life, Health, Vehicle, Others',
    border: 'from-violet-500 via-purple-500 to-indigo-500',
  },
  'Loan Payments': {
    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
    sub: 'EMI, Credit Card, Personal Loan',
    border: 'from-rose-500 via-red-500 to-orange-500',
  },
  'Other Expenses': {
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80',
    sub: 'Miscellaneous, Unplanned',
    border: 'from-slate-400 via-gray-400 to-zinc-500',
  },
  'Personal Care': {
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    sub: 'Skincare, Haircare, Hygiene',
    border: 'from-fuchsia-400 via-pink-400 to-rose-400',
  },
  'Rent & Housing': {
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    sub: 'Rent, Maintenance, Utilities',
    border: 'from-blue-500 via-indigo-500 to-violet-500',
  },
  'Restaurants & Dining': {
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    sub: 'Dine Out, Cafes, Takeaway',
    border: 'from-orange-400 via-amber-400 to-yellow-400',
  },
  'Shopping': {
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    sub: 'Clothes, Accessories, Essentials',
    border: 'from-pink-500 via-fuchsia-500 to-violet-500',
  },
  'Subscriptions': {
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    sub: 'OTT, Apps, Memberships',
    border: 'from-green-500 via-emerald-400 to-teal-400',
  },
  'Travel & Transport': {
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    sub: 'Flights, Trains, Bus, Local',
    border: 'from-cyan-400 via-sky-500 to-blue-600',
  },

  // ── Income ──
  'Salary': {
    img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80',
    sub: 'Monthly, Payslip, CTC',
    border: 'from-emerald-400 via-green-500 to-teal-500',
  },
  'Business Income': {
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    sub: 'Revenue, Profit, Sales',
    border: 'from-blue-400 via-indigo-500 to-violet-500',
  },
  'Freelancing': {
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    sub: 'Projects, Consulting, Gigs',
    border: 'from-violet-400 via-purple-400 to-fuchsia-500',
  },
  'Investments': {
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    sub: 'Stocks, Mutual Funds, Crypto',
    border: 'from-amber-400 via-yellow-400 to-lime-400',
  },
  'Interest': {
    img: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80',
    sub: 'Bank Interest, FD, RD',
    border: 'from-cyan-400 via-blue-400 to-indigo-400',
  },
  'Rental Income': {
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    sub: 'Property, PG, Lease',
    border: 'from-orange-400 via-amber-400 to-yellow-500',
  },
  'Refunds': {
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
    sub: 'Returns, Cashback, Reimbursements',
    border: 'from-teal-400 via-emerald-400 to-green-400',
  },
  'Other Income': {
    img: 'https://images.unsplash.com/photo-1602576666092-bf6447a729fc?w=600&q=80',
    sub: 'Miscellaneous, Windfalls',
    border: 'from-slate-400 via-gray-400 to-zinc-500',
  },
};

const getFallbackGradient = (name: string) => {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
  ];
  return gradients[name.length % gradients.length];
};

export default function CategoriesPage({
  categories,
  onRefresh,
  onFilterByCategory,
  isDarkMode,
}: Props) {
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#8B5CF6');
  const [error, setError] = useState<string | null>(null);

  // Ensure strict uniqueness by name + type to prevent repeated categories
  const uniqueCategories = Array.from(
    new Map(categories.map(c => [`${c.name.trim().toLowerCase()}-${c.type}`, c])).values()
  );

  const filtered = uniqueCategories
    .filter(c => c.type === activeTab)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const expenseCount = uniqueCategories.filter(c => c.type === 'expense').length;
  const incomeCount = uniqueCategories.filter(c => c.type === 'income').length;

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newCatName.trim()) return;
    try {
      const res = await fetch(`${API}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), type: activeTab, color: newCatColor, icon: 'Tag' }),
      });
      if (!res.ok) throw new Error('Failed to create category');
      setNewCatName('');
      setShowAddModal(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || 'Cannot delete category in use');
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Expense &amp; Income{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Categories
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize your financial life across {expenseCount + incomeCount} default and custom categories
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-violet-600/30 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* ── Tabs + Search bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-[#1C183D] border border-[#2D265C] gap-1">
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'expense'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💸</span> Expense Categories ({expenseCount})
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'income'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📈</span> Income Categories ({incomeCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="pl-8 pr-3 py-2 rounded-xl bg-[#1C183D] border border-[#2D265C] text-white text-xs focus:outline-none focus:border-violet-500 w-52 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* ── Category Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(cat => {
          const meta = CATEGORY_META[cat.name];
          const borderGrad = meta?.border || getFallbackGradient(cat.name);
          const imgSrc = meta?.img || '';
          const subtitle = meta?.sub || cat.name;

          return (
            <div
              key={cat.id}
              onClick={() => onFilterByCategory?.(cat.name)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.99]"
              style={{ aspectRatio: '16/9' }}
            >
              {/* Background image */}
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(cat.name)} opacity-60`}
                />
              )}

              {/* Dark gradient overlay from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Colored bottom border glow */}
              <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${borderGrad}`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-3.5">
                <div className="flex items-end justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-white leading-tight truncate drop-shadow-lg">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-slate-300/80 mt-0.5 truncate">{subtitle}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!cat.is_default && (
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }}
                        className="p-1 rounded-lg bg-black/40 text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition">
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom badge */}
              {!cat.is_default && (
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[9px] font-bold text-white bg-violet-600/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    Custom
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500 text-sm">
            No categories found{search ? ` for "${search}"` : ''}.
          </div>
        )}
      </div>

      {/* ── Add Category Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="rounded-3xl bg-[#1C183D] border border-[#2D265C] p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-white text-base">
                New {activeTab === 'expense' ? 'Expense' : 'Income'} Category
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <p className="mb-3 text-xs text-rose-400">{error}</p>}

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pet Care, Software Subscriptions"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F2D] border border-slate-700 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={e => setNewCatColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-slate-400 font-mono">{newCatColor}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-md cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
