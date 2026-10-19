import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Check, X } from 'lucide-react';
import type { TransactionType } from '../../types';

type CategoryItem = {
  id: string;
  name: string;
  type: TransactionType;
};

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Salary', type: 'income' },
  { id: '2', name: 'Freelancing', type: 'income' },
  { id: '3', name: 'Business', type: 'income' },
  { id: '4', name: 'Investment', type: 'income' },
  { id: '5', name: 'Other Income', type: 'income' },
  { id: '6', name: 'Food', type: 'expense' },
  { id: '7', name: 'Shopping', type: 'expense' },
  { id: '8', name: 'Travel', type: 'expense' },
  { id: '9', name: 'Bills', type: 'expense' },
  { id: '10', name: 'Entertainment', type: 'expense' },
  { id: '11', name: 'Others', type: 'expense' },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [activeTab, setActiveTab] = useState<TransactionType>('income');
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const currentList = categories.filter(c => c.type === activeTab);

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    setCategories(prev => [
      ...prev,
      { id: Date.now().toString(), name: newCatName.trim(), type: activeTab }
    ]);
    setNewCatName('');
    setShowAddInput(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, name: editingName.trim() } : c))
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Categories</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage and organize your custom transaction tags</p>
        </div>

        <button
          onClick={() => setShowAddInput(true)}
          className="px-4 py-2 bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-6 max-w-sm">
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'income'
              ? 'bg-[#00A86B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Income Categories
        </button>
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'expense'
              ? 'bg-[#00A86B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Expense Categories
        </button>
      </div>

      {/* Add Input Bar */}
      {showAddInput && (
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Enter new ${activeTab} category name...`}
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 bg-[#00A86B] text-white text-xs font-semibold rounded-lg hover:bg-[#008f5a] transition"
          >
            Save
          </button>
          <button
            onClick={() => setShowAddInput(false)}
            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Category List */}
      <div className="divide-y divide-slate-100">
        {currentList.map(cat => (
          <div key={cat.id} className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/60 rounded-xl transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00A86B] flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              {editingId === cat.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    className="px-2 py-1 text-xs border rounded-lg"
                  />
                  <button onClick={() => handleSaveEdit(cat.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingId(cat.id);
                  setEditingName(cat.name);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                title="Edit category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
