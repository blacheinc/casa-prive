// components/Footer.tsx
import Link from 'next/link';
import { Crown, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';


export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-emerald-700/30 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Casa Privé Logo"
                                width={64}
                                height={64}
                                className="mx-auto animate-pulse"
                            />
                            <span className="text-xl font-bold text-emerald-400">CASA PRIVÉ</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            The epitome of luxury and bespoke entertainment. An exclusive sanctuary celebrating the art of living.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/booking" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    Book a Table
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    View Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/membership" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    Membership
                                </Link>
                            </li>
                            <li>
                                <Link href="/rules" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    Event Guidelines
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/waitlist" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    Join Waitlist
                                </Link>
                            </li>
                            <li>
                                <Link href="/feedback" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    Feedback
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <Mail size={16} className="text-yellow-500" />
                                <a href="mailto:info@casaprive.com" className="hover:text-emerald-400">
                                    info@casaprive.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <Phone size={16} className="text-yellow-500" />
                                <a href="tel:+233123456789" className="hover:text-emerald-400">
                                    +233 12 345 6789
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-gray-400 text-sm">
                                <MapPin size={16} className="text-yellow-500 mt-1" />
                                <span>Kumasi, Ashanti Region, Ghana</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-emerald-700/30 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Casa Privé. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        Crafted with excellence for discerning individuals
                    </p>
                </div>
            </div>
        </footer>
    );
}