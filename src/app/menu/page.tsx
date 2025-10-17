/* eslint-disable @typescript-eslint/no-explicit-any */
// app/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
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
  const [message, setMessage] = useState('');

  const categories = ['ALL', 'APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'COCKTAIL', 'WINE'];

  useEffect(() => {
    // In production, fetch from API
    setMenuItems([
      {
        id: '1',
        name: 'Truffle Foie Gras',
        description: 'Pan-seared foie gras with truffle reduction',
        category: 'APPETIZER',
        price: 150,
      },
      {
        id: '2',
        name: 'Lobster Bisque',
        description: 'Creamy lobster soup with cognac',
        category: 'APPETIZER',
        price: 85,
      },
      {
        id: '3',
        name: 'Wagyu Beef Tenderloin',
        description: 'Premium A5 Wagyu with red wine jus',
        category: 'MAIN_COURSE',
        price: 450,
      },
      {
        id: '4',
        name: 'Chilean Sea Bass',
        description: 'Pan-roasted with lemon butter sauce',
        category: 'MAIN_COURSE',
        price: 320,
      },
      {
        id: '5',
        name: 'Chocolate Soufflé',
        description: 'Classic French chocolate soufflé with vanilla ice cream',
        category: 'DESSERT',
        price: 75,
      },
      {
        id: '6',
        name: 'Dom Pérignon 2012',
        description: 'Vintage champagne',
        category: 'WINE',
        price: 1200,
      },
      {
        id: '7',
        name: 'Casa Privé Signature',
        description: 'House special cocktail with premium spirits',
        category: 'COCKTAIL',
        price: 95,
      },
    ]);
  }, []);

  const filteredItems = selectedCategory === 'ALL' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find(i => i.id === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
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
    setMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerInfo,
          items: cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            notes: item.notes,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order failed');
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setMessage('Order placed successfully!');
        setCart([]);
        setShowCheckout(false);
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text text-transparent">
            Casa Privé Menu
          </h1>
          <p className="text-center text-gray-300 mb-12">
            Exquisite cuisine crafted for discerning palates
          </p>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {category.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-slate-800 p-6 rounded-lg border border-emerald-700/30 hover:border-yellow-500/50 transition">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded-full mb-2">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl font-bold text-yellow-500 mb-2">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-400">GHS {item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-emerald-700 p-4 shadow-lg">
              <div className="container mx-auto max-w-7xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="text-yellow-500" size={24} />
                  <div>
                    <div className="text-white font-bold">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                    </div>
                    <div className="text-emerald-400 text-lg font-bold">
                      GHS {totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-400"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}

          {/* Checkout Modal */}
          {showCheckout && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6">Checkout</h2>

                {/* Cart Items */}
                <div className="mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-700">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-sm">GHS {item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 bg-slate-700 rounded hover:bg-slate-600"
                        >
                          <Minus size={16} className="text-white" />
                        </button>
                        <span className="text-white font-bold">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 bg-slate-700 rounded hover:bg-slate-600"
                        >
                          <Plus size={16} className="text-white" />
                        </button>
                        <span className="text-emerald-400 font-bold ml-4 w-20 text-right">
                          GHS {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-right mt-4">
                    <span className="text-xl font-bold text-yellow-500">
                      Total: GHS {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={customerInfo.customerName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Table Number or Name *</label>
                    <input
                      type="text"
                      value={customerInfo.tableNumberOrName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumberOrName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Email (for receipt)</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Payment Method *</label>
                    <select
                      value={customerInfo.paymentMethod}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="PAYSTACK">Pay Online (Paystack)</option>
                      <option value="CASH">Pay with Cash</option>
                    </select>
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg mb-4 ${message.includes('success') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                    {message}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}