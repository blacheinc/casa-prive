// components/Navigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crown, Menu, X } from 'lucide-react';
import Image from 'next/image';


export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/booking', label: 'Book Table' },
        { href: '/menu', label: 'Menu' },
        { href: '/rules', label: 'Guidelines' },
        { href: '/membership', label: 'Membership' },
        { href: '/feedback', label: 'Feedback' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-emerald-700/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            alt="Casa Privé Logo"
                            width={64}
                            height={64}
                            className="mx-auto animate-pulse"
                        />
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-500 bg-clip-text text-transparent">
                            CASA PRIVÉ
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-300 hover:text-emerald-400 transition font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-300 hover:text-emerald-400"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-emerald-700/30">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-3 text-gray-300 hover:text-emerald-400 transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}