// components/Navigation.tsx - Casa Privé x Alora Beach Resort
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/booking', label: 'Get Table' },
        { href: '/menu', label: 'Drinks Menu' },
        { href: '/rules', label: 'Guidelines' },
        { href: '/feedback', label: 'Feedback' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-slate-900/95 backdrop-blur-md border-b border-emerald-700/30 shadow-lg'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            src="/logo.png"
                            alt="Casa Privé Logo"
                            width={40}
                            height={40}
                            className="group-hover:scale-110 transition-transform"
                            style={{ background: 'transparent' }}
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-light tracking-wider text-white">
                                CASA PRIVÉ
                            </span>
                            <span className="text-[10px] font-light tracking-wider text-yellow-500">
                                × ALORA BEACH RESORT
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-light hover:text-emerald-400 transition-colors tracking-wide ${isScrolled ? 'text-gray-300' : 'text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden transition-colors ${isScrolled ? 'text-gray-300' : 'text-white'
                            } hover:text-emerald-400`}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-emerald-700/30 bg-slate-900/95 backdrop-blur-md">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-3 text-sm text-gray-300 hover:text-emerald-400 transition-colors font-light"
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
