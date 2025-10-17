// app/rules/page.tsx - PRODUCTION
import { Shield, Users, Clock, Shirt, Wine, Camera, Phone, AlertCircle } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Event Guidelines
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Ensuring an exceptional experience for all members
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Event Rules */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-emerald-400 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6" />
            Event Rules
          </h2>

          <div className="space-y-6">
            <RuleCard
              icon={<Shirt className="w-5 h-5" />}
              title="Dress to Impress"
              description="Elegant attire is required for all events. Business formal, cocktail attire, or evening wear is expected. No casual wear, sportswear, or sneakers."
              critical
            />

            <RuleCard
              icon={<Clock className="w-5 h-5" />}
              title="Punctuality"
              description="Please arrive 15 minutes before the event starts. Late arrivals may not be accommodated depending on the event type."
            />

            <RuleCard
              icon={<Camera className="w-5 h-5" />}
              title="Photography & Privacy"
              description="Photography is permitted for personal use only. However, respect other guests' privacy. No unauthorized commercial photography or videography."
            />

            <RuleCard
              icon={<Phone className="w-5 h-5" />}
              title="Mobile Devices"
              description="Please keep mobile devices on silent during performances and presentations. Business calls should be taken outside the main event areas."
            />

            <RuleCard
              icon={<Wine className="w-5 h-5" />}
              title="Alcohol Consumption"
              description="Drink responsibly. Casa Privé reserves the right to refuse service to intoxicated guests. Valid ID required for alcohol service."
            />

            <RuleCard
              icon={<Shield className="w-5 h-5" />}
              title="Security & Safety"
              description="All guests may be subject to security screening. Prohibited items include weapons, illegal substances, and outside food/beverages."
            />
          </div>
        </div>

        {/* Table Rules */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-yellow-500 mb-6 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Table Booking Rules
          </h2>

          <div className="space-y-6">
            <RuleCard
              icon={<Users className="w-5 h-5" />}
              title="Maximum 6 Guests Per Table"
              description="Each table accommodates a maximum of 6 guests. This limit is strictly enforced to ensure comfort and maintain the intimate atmosphere."
              critical
            />

            <RuleCard
              icon={<AlertCircle className="w-5 h-5" />}
              title="Minimum Spend Requirements"
              description="Some packages may have minimum spend requirements. Please review package details before booking."
            />

            <RuleCard
              icon={<Clock className="w-5 h-5" />}
              title="Reservation Duration"
              description="Table reservations are for the entire event duration. Early departures do not qualify for refunds."
            />
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mb-12">
          <div className="bg-red-900/20 border border-red-500/30 rounded p-6">
            <h3 className="text-xl font-light text-red-400 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Cancellation & Refund Policy
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm font-light">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>48+ hours before event:</strong> Full refund minus 10% processing fee</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>24-48 hours before event:</strong> 50% refund</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>Less than 24 hours:</strong> No refund</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>No-shows:</strong> No refund and may affect future booking privileges</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Code of Conduct */}
        <div className="mb-12">
          <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
            <h3 className="text-xl font-light text-emerald-400 mb-4">Code of Conduct</h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed font-light">
              Casa Privé is committed to providing a safe, respectful, and enjoyable environment for all members and guests. We expect all attendees to:
            </p>
            <ul className="space-y-2 text-gray-300 text-sm font-light">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Treat all staff, members, and guests with respect and courtesy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Respect the privacy and personal space of others</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Refrain from disruptive, offensive, or inappropriate behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Follow instructions from Casa Privé staff and security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Report any concerns or incidents to staff immediately</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-yellow-400 text-xs font-light">
                <strong>Note:</strong> Violation of these rules may result in removal from the event without refund and potential suspension or termination of membership privileges.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-slate-800/50 border border-yellow-700/30 p-8 rounded">
          <h3 className="text-xl font-light text-white mb-4">Questions About Our Guidelines?</h3>
          <p className="text-gray-300 mb-6 text-sm font-light">
            Our team is here to help ensure you have the best experience at Casa Privé
          </p>
          <a
            href="/feedback"
            className="inline-block px-6 py-3 bg-emerald-600 text-white text-sm font-light tracking-wider rounded hover:bg-emerald-500 transition"
          >
            CONTACT US
          </a>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ 
  icon, 
  title, 
  description, 
  critical 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  critical?: boolean;
}) {
  return (
    <div className={`bg-slate-800/50 p-6 rounded border transition-all hover:scale-105 ${
      critical 
        ? 'border-red-500/50 bg-red-900/10' 
        : 'border-emerald-700/30'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`${critical ? 'text-red-400' : 'text-yellow-500'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-light mb-2 ${critical ? 'text-red-400' : 'text-white'}`}>
            {title}
            {critical && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">MANDATORY</span>}
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm font-light">{description}</p>
        </div>
      </div>
    </div>
  );
}