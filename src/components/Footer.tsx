// components/Footer.tsx - BOXED DESIGN
import Link from 'next/link';
import { Crown, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-emerald-700/30 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-slate-800/50 border border-emerald-700/20 p-8 md:p-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="Casa Privé Logo"
                                    width={40}
                                    height={40}
                                    className="group-hover:scale-110 transition-transform"
                                    style={{ background: 'transparent' }}
                                />
                                <span className="text-lg font-light text-emerald-400">CASA PRIVÉ</span>
                            </div>
                            <p className="text-gray-400 text-xs font-light leading-relaxed">
                                The epitome of luxury and bespoke entertainment. An exclusive sanctuary celebrating the art of living.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-light mb-4 text-sm tracking-wider">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/booking" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Book a Table
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/menu" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        View Menu
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href="/membership" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Membership
                                    </Link>
                                </li> */}
                                <li>
                                    <Link href="/rules" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Event Guidelines
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-light mb-4 text-sm tracking-wider">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/waitlist" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Join Waitlist
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/feedback" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Feedback
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        FAQs
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-light mb-4 text-sm tracking-wider">Contact Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Mail size={14} className="text-yellow-500 flex-shrink-0" />
                                    <a href="mailto:info@casaprive.com" className="hover:text-emerald-400 font-light">
                                        info@casaprive.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Phone size={14} className="text-yellow-500 flex-shrink-0" />
                                    <a href="tel:+233123456789" className="hover:text-emerald-400 font-light">
                                        +233 12 345 6789
                                    </a>
                                </li>
                                <li className="flex items-start gap-2 text-gray-400 text-xs">
                                    <MapPin size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span className="font-light">Kumasi, Ashanti Region, Ghana</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-emerald-700/30 pt-6 text-center">
                        <p className="text-gray-400 text-xs font-light">
                            © {new Date().getFullYear()} Casa Privé. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-xs mt-2 font-light">
                            Crafted with excellence for discerning individuals
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}