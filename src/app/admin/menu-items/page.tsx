// app/admin/menu-items/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Utensils, Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
  createdAt: string;
}

const CATEGORIES = [
  'ALL',
  'CHAMPAGNE',
  'COCKTAIL',
  'COGNAC',
  'TEQUILA',
  'MOCKTAIL',
];

export default function AdminMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'COCKTAIL',
    price: 0,
    image: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, [filter]);

  const fetchMenuItems = async () => {
    try {
      const url = filter === 'ALL' ? '/api/menu-items' : `/api/menu-items?category=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setMenuItems(data.menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingItem ? `/api/menu-items/${editingItem.id}` : '/api/menu-items';
      const method = editingItem ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMenuItems();
        setShowModal(false);
        setEditingItem(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      price: item.price,
      image: item.image || '',
      isAvailable: item.isAvailable,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const toggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });

      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'COCKTAIL',
      price: 0,
      image: '',
      isAvailable: true,
    });
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Menu Items Management</h1>
          <p className="text-gray-400">Manage your menu offerings</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${filter === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
              >
                {category.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg p-6 border border-emerald-700/30">
            <div className="flex items-start justify-between mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.isAvailable
                  ? 'bg-emerald-900/50 text-emerald-400'
                  : 'bg-red-900/50 text-red-400'
                }`}>
                {item.category.replace('_', ' ')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(item.id, item.isAvailable)}
                  className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition"
                  title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                >
                  {item.isAvailable ? (
                    <Eye size={16} className="text-emerald-400" />
                  ) : (
                    <EyeOff size={16} className="text-red-400" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-blue-900/50 text-blue-400 rounded hover:bg-blue-900 transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
            {item.description && (
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
            )}
            <div className="text-2xl font-bold text-emerald-400">
              GHS {item.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Utensils className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No menu items found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CHAMPAGNE">Champagne</option>
                    <option value="COCKTAIL">Cocktail</option>
                    <option value="COGNAC">Cognac</option>
                    <option value="TEQUILA">Tequila</option>
                    <option value="MOCKTAIL">Mocktail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Price (GHS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-emerald-600"
                  />
                  <span className="text-gray-300">Available for order</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}