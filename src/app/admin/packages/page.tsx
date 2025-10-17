// app/admin/packages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Crown, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface TablePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxGuests: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<TablePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TablePackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    features: [''],
    maxGuests: 6,
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty features
    const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
    
    try {
      const url = editingPackage ? `/api/packages/${editingPackage.id}` : '/api/packages';
      const method = editingPackage ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, features: cleanedFeatures }),
      });

      if (response.ok) {
        fetchPackages();
        setShowModal(false);
        setEditingPackage(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleEdit = (pkg: TablePackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      features: pkg.features.length > 0 ? pkg.features : [''],
      maxGuests: pkg.maxGuests,
      isActive: pkg.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error('Error updating package status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      features: [''],
      maxGuests: 6,
      isActive: true,
    });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

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
          <h1 className="text-3xl font-bold text-white mb-2">Table Packages Management</h1>
          <p className="text-gray-400">Manage booking packages and pricing</p>
        </div>
        <button
          onClick={() => {
            setEditingPackage(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Add Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`bg-slate-800 rounded-lg p-6 border-2 transition ${
              pkg.isActive 
                ? 'border-emerald-700/30 hover:border-emerald-500/50' 
                : 'border-slate-700 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  pkg.isActive
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-red-900/50 text-red-400'
                }`}>
                  {pkg.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(pkg.id, pkg.isActive)}
                  className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition"
                  title={pkg.isActive ? 'Deactivate' : 'Activate'}
                >
                  {pkg.isActive ? (
                    <Eye size={16} className="text-emerald-400" />
                  ) : (
                    <EyeOff size={16} className="text-red-400" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(pkg)}
                  className="p-2 bg-blue-900/50 text-blue-400 rounded hover:bg-blue-900 transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-yellow-500 mb-2">{pkg.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>

            <div className="text-3xl font-bold text-emerald-400 mb-4">
              GHS {pkg.price.toLocaleString()}
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs mb-2">FEATURES:</p>
              <ul className="space-y-1">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <p className="text-gray-400 text-xs">
                Max Guests: <span className="text-white font-bold">{pkg.maxGuests}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No packages found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPackage ? 'Edit Package' : 'Add Package'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPackage(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Package Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g., VIP Experience"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  placeholder="Brief description of the package"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Max Guests *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-300 text-sm">Features</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none text-sm"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-emerald-600"
                  />
                  <span className="text-gray-300">Active (available for booking)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPackage(null);
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
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}