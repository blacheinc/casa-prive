// src/app/privacy/page.tsx
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Your privacy is important to us
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
          <p className="text-gray-400 text-xs mt-4 font-light">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded mb-8">
          <p className="text-gray-300 font-light text-sm leading-relaxed">
            Casa Privé × Alora Beach Resort (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website
            and use our services for our monthly events at Alora Beach Resort. Please read this policy carefully. If you do not agree with the terms of
            this privacy policy, please do not access the site.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <PolicySection
            icon={<FileText className="w-6 h-6" />}
            title="Information We Collect"
            content={
              <>
                <p className="mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Personal Information:</strong> Name, email address, phone number, and payment information when you make a booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Booking Details:</strong> Table package selection, number of guests, event dates, and special requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Feedback & Communications:</strong> Information you provide when contacting us or submitting feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Technical Data:</strong> IP address, browser type, device information, and usage data collected through cookies and similar technologies</span>
                  </li>
                </ul>
              </>
            }
          />

          <PolicySection
            icon={<Eye className="w-6 h-6" />}
            title="How We Use Your Information"
            content={
              <>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Process and manage your table bookings and reservations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Send booking confirmations, updates, and event reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Process payments and prevent fraudulent transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Respond to your inquiries and provide customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Send promotional communications about upcoming events (with your consent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Improve our website, services, and customer experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Comply with legal obligations and enforce our terms</span>
                  </li>
                </ul>
              </>
            }
          />

          <PolicySection
            icon={<Lock className="w-6 h-6" />}
            title="How We Protect Your Information"
            content={
              <>
                <p className="mb-4">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction. 
                  These measures include:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Secure Socket Layer (SSL) encryption for data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Encrypted storage of sensitive information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Restricted access to personal information by authorized personnel only</span>
                  </li>
                </ul>
                <p className="mt-4 text-yellow-400 text-xs">
                  However, no method of transmission over the internet is 100% secure. While we strive to 
                  protect your information, we cannot guarantee absolute security.
                </p>
              </>
            }
          />

          <PolicySection
            icon={<Shield className="w-6 h-6" />}
            title="Information Sharing & Disclosure"
            content={
              <>
                <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span><strong>Service Providers:</strong> We share information with trusted third-party service providers who assist us in operating our website and conducting our business (e.g., payment processors, email service providers)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</span>
                  </li>
                </ul>
              </>
            }
          />

          <div className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded">
            <h3 className="text-lg font-light text-emerald-400 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Cookies & Tracking Technologies
            </h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed mb-3">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze 
              site traffic, and understand user preferences. You can control cookie settings through your 
              browser, but disabling cookies may affect site functionality.
            </p>
            <p className="text-gray-400 text-xs font-light">
              Types of cookies we use: Essential cookies, Performance cookies, Functional cookies, and Marketing cookies (with consent).
            </p>
          </div>

          <div className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded">
            <h3 className="text-lg font-light text-yellow-500 mb-3">Your Rights & Choices</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2 ml-4 text-gray-300 text-sm font-light">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Access, update, or delete your personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Opt-out of marketing communications at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Request a copy of your data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Object to processing of your personal information</span>
              </li>
            </ul>
            <p className="text-gray-400 text-xs font-light mt-3">
              To exercise these rights, please contact us using the information below.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded">
            <h3 className="text-lg font-light text-white mb-3">Data Retention</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce 
              our agreements. Booking and payment information is retained for 7 years in accordance with 
              financial record-keeping requirements.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded">
            <h3 className="text-lg font-light text-white mb-3">Children&apos;s Privacy</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              Casa Privé is an adult venue. Our services are not directed to individuals under 21 years of 
              age. We do not knowingly collect personal information from anyone under 21. If you become aware 
              that a child has provided us with personal information, please contact us immediately.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded">
            <h3 className="text-lg font-light text-white mb-3">Changes to This Privacy Policy</h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-yellow-900/20 border border-yellow-500/30 rounded p-8">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-light text-yellow-500 mb-3">Contact Us About Privacy</h3>
              <p className="text-gray-300 text-sm font-light leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy or how we handle your information, 
                please contact us:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm font-light">
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:info@casaprivé.com" className="text-emerald-400 hover:text-emerald-300">
                    info@casaprivé.com
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+233244963777" className="text-emerald-400 hover:text-emerald-300">
                    +233 24 496 3777
                  </a>
                </li>
                <li>
                  <strong>Address:</strong> Accra, Ghana
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicySection({ 
  icon, 
  title, 
  content 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded">
      <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
        <span className="text-yellow-500">{icon}</span>
        {title}
      </h3>
      <div className="text-gray-300 text-sm font-light leading-relaxed">
        {content}
      </div>
    </div>
  );
}