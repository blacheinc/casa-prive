/* eslint-disable @typescript-eslint/no-explicit-any */
// app/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Wine } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    tableNumberOrName: '',
    email: '',
    paymentMethod: 'PAYSTACK',
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingMenu, setFetchingMenu] = useState(true);
  const [message, setMessage] = useState('');

  const categories = ['ALL', 'COCKTAIL', 'WHISKEY', 'TEQUILA', 'CHAMPAGNE', 'GIN', 'VODKA', 'RUM', 'BEER', 'COGNAC'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setFetchingMenu(true);
      const response = await fetch('/api/menu-items');
      const data = await response.json();

      if (response.ok) {
        // Map database items to match the component interface
        const items = data.menuItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          category: item.category,
          price: item.price,
        }));
        setMenuItems(items);
      } else {
        console.error('Failed to fetch menu items:', data.error);
        setMessage('Failed to load menu items. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMessage('Failed to load menu items. Please refresh the page.');
    } finally {
      setFetchingMenu(false);
    }
  };

  const filteredItems = selectedCategory === 'ALL' ? menuItems : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find(i => i.id === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      setCart(cart.filter(i => i.id !== itemId));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!customerInfo.customerName || !customerInfo.tableNumberOrName) {
      setMessage('Please fill in your name and table number');
      return;
    }

    if (cart.length === 0) {
      setMessage('Your cart is empty');
      return;
    }

    setLoading(true);
    setMessage('Processing your order...');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerInfo,
          items: cart.map(item => ({ menuItemId: item.id, quantity: item.quantity, notes: item.notes })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order failed');
      }

      if (data.paymentUrl) {
        setMessage('Redirecting to payment...');
        window.location.href = data.paymentUrl;
      } else {
        // Redirect to success page (using 'id' param to match your existing page)
        window.location.href = `/order/success?id=${data.order.id}`;
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <div className="relative h-80 mb-12 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <Wine className="w-12 h-12 text-yellow-500 mb-4" />
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
              Drinks Menu
            </h1>
            <p className="text-gray-200 font-light text-sm max-w-xl">
              Premium spirits, craft cocktails, and world-class wines
            </p>
          </div>
        </div>

        {/* Loading State */}
        {fetchingMenu && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-gray-300 mt-4 font-light">Loading menu...</p>
          </div>
        )}

        {/* Categories */}
        {!fetchingMenu && (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded text-xs font-light tracking-wider transition ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800/50 border border-emerald-700/30 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Drinks Items */}
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded hover:border-yellow-500/50 transition">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded-full mb-2 font-light">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-light text-yellow-500 mb-2">{item.name}</h3>
                      <p className="text-gray-400 text-xs mb-4 font-light">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-light text-emerald-400">GHS {item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500 transition flex items-center gap-2 font-light"
                        >
                          <Plus size={14} />
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 font-light">No items found in this category.</p>
              </div>
            )}
          </>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-emerald-700 p-4 shadow-lg z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShoppingCart className="text-yellow-500" size={24} />
                <div>
                  <div className="text-white font-light text-sm">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </div>
                  <div className="text-emerald-400 text-lg font-light">
                    GHS {totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm rounded font-light tracking-wider hover:from-emerald-500 hover:to-emerald-400"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-emerald-700/30 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-light text-yellow-500 mb-6">Checkout</h2>

              {/* Cart Items */}
              <div className="mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div className="flex-1">
                      <h4 className="text-white font-light text-sm">{item.name}</h4>
                      <p className="text-gray-400 text-xs font-light">GHS {item.price} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeFromCart(item.id)} className="p-1 bg-slate-700 rounded hover:bg-slate-600">
                        <Minus size={14} className="text-white" />
                      </button>
                      <span className="text-white font-light text-sm">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="p-1 bg-slate-700 rounded hover:bg-slate-600">
                        <Plus size={14} className="text-white" />
                      </button>
                      <span className="text-emerald-400 font-light ml-4 w-20 text-right text-sm">
                        GHS {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-right mt-4">
                  <span className="text-lg font-light text-yellow-500">
                    Total: GHS {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Your Name *</label>
                  <input
                    type="text"
                    value={customerInfo.customerName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Table Number or Name *</label>
                  <input
                    type="text"
                    value={customerInfo.tableNumberOrName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumberOrName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Email (for receipt)</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-light">Payment Method *</label>
                  <select
                    value={customerInfo.paymentMethod}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PAYSTACK">Pay Online (Paystack)</option>
                    <option value="CASH">Pay with Cash</option>
                  </select>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded mb-4 text-sm ${
                  message.includes('success') || message.includes('Processing') || message.includes('Redirecting')
                    ? 'bg-emerald-900/50 text-emerald-300' 
                    : 'bg-red-900/50 text-red-300'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white text-sm rounded hover:bg-slate-600 font-light"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm rounded hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 font-light"
                >
                  {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}