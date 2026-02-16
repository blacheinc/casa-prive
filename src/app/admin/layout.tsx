// app/admin/layout.tsx - UPDATED with production auth
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    ShoppingBag,
    Users,
    Crown,
    Clock,
    MessageSquare,
    Settings,
    Menu,
    X,
    LogOut,
    Table,
    Ticket
} from 'lucide-react';
import Image from 'next/image';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        // Check authentication
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
        { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Members', href: '/admin/members', icon: Crown },
        { name: 'Tables', href: '/admin/packages', icon: Table },
        { name: 'Menu', href: '/admin/menu-items', icon: Menu },
        { name: 'Waitlist', href: '/admin/waitlist', icon: Clock },
        { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-emerald-700/30 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-emerald-700/30">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Casa Privé Logo"
                            width={64}
                            height={64}
                            className="mx-auto animate-pulse"
                            style={{ background: 'transparent' }}
                        />
                        <span className="text-xl font-bold text-emerald-400">CASA PRIVÉ</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                        ? 'bg-emerald-900/50 text-emerald-400'
                                        : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 border-t border-emerald-700/30">
                    {user && (
                        <div className="p-4 border-b border-emerald-700/30">
                            <div className="text-sm text-gray-400">Logged in as</div>
                            <div className="text-white font-medium">{user.username}</div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-slate-800 transition"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-emerald-700/30 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-sm text-gray-400 hover:text-emerald-400 transition"
                            >
                                View Website
                            </Link>
                            <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}