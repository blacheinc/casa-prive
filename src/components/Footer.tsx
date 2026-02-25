// components/Footer.tsx - Casa Privé x Alora Beach Resort
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-emerald-700/30 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-slate-800/50 border border-emerald-700/20 p-8 md:p-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Image
                                    src="/logo.png"
                                    alt="Casa Privé Logo"
                                    width={40}
                                    height={40}
                                    className="group-hover:scale-110 transition-transform"
                                    style={{ background: 'transparent' }}
                                />
                                <span className="text-lg font-light text-emerald-400">CASA PRIVÉ <span className="text-yellow-500">×</span> ALORA BEACH</span>
                            </div>
                            <p className="text-gray-400 text-xs font-light leading-relaxed">
                                An exclusive monthly experience of premium drinks, music, and luxury at Alora Beach Resort. Two icons of luxury united.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-light mb-4 text-sm tracking-wider">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/tickets" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Get Tickets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/booking" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Book Table
                                    </Link>
                                </li>
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
                                    <Link href="/faq" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition text-xs font-light">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-light mb-4 text-sm tracking-wider">Contact Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Mail size={14} className="text-yellow-500 flex-shrink-0" />
                                    <a href="mailto:info@casaprivé.com" className="hover:text-emerald-400 font-light">
                                        info@casaprivé.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Phone size={14} className="text-yellow-500 flex-shrink-0" />
                                    <a href="tel:+233244963777" className="hover:text-emerald-400 font-light">
                                        +233 24 496 3777
                                    </a>
                                </li>
                                <li className="flex items-start gap-2 text-gray-400 text-xs">
                                    <MapPin size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span className="font-light">Alora Beach Resort, Accra, Ghana</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-emerald-700/30 pt-6 text-center">
                        <p className="text-gray-400 text-xs font-light">
                            © {new Date().getFullYear()} Casa Privé × Alora Beach Resort. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-xs mt-2 font-light">
                            A partnership crafted for unforgettable experiences
                        </p>

                        {/* Powered By */}
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span className="text-gray-500 text-xs font-light">Powered by</span>
                            <a
                                href="https://xecuteteam.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                <Image
                                    src="/uploads/xecute.png"
                                    alt="Xecute"
                                    width={70}
                                    height={20}
                                    className="opacity-70 hover:opacity-100 transition-opacity"
                                    style={{ background: 'transparent' }}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
