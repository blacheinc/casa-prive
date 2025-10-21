// app/rules/page.tsx - NIGHTCLUB VERSION
import { Shield, Users, Clock, Shirt, Wine, Camera, AlertCircle, Music } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <Music className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            House Rules
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Let&apos;s party responsibly and keep the vibes right
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Entry & Dress Code */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-emerald-400 mb-6 flex items-center gap-3">
            <Shirt className="w-6 h-6" />
            Entry & Dress Code
          </h2>

          <div className="space-y-6">
            <RuleCard
              icon={<Shirt className="w-5 h-5" />}
              title="Dress to Party"
              description="Look good, feel good! Smart casual or stylish attire recommended. No torn clothing or offensive graphics. Dress to impress and have a good time."
            />

            <RuleCard
              icon={<Clock className="w-5 h-5" />}
              title="Age Requirement"
              description="18+ only. Valid ID required at the door. No exceptions."
              critical
            />

            <RuleCard
              icon={<Shield className="w-5 h-5" />}
              title="Security Check"
              description="All guests are subject to security screening at entry. Prohibited items include weapons, drugs, and outside food/beverages. Management reserves the right to refuse entry."
              critical
            />
          </div>
        </div>

        {/* Table Rules */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-yellow-500 mb-6 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Table Bookings
          </h2>

          <div className="space-y-6">
            <RuleCard
              icon={<Users className="w-5 h-5" />}
              title="Maximum 6 Guests Per Table"
              description="Each table accommodates up to 6 guests. This ensures everyone has space to vibe and enjoy the night."
              critical
            />

            <RuleCard
              icon={<Clock className="w-5 h-5" />}
              title="Table Duration"
              description="Your table is reserved for the entire night. Arrive when you want, stay as long as you like until closing."
            />

            <RuleCard
              icon={<Wine className="w-5 h-5" />}
              title="Bottle Service"
              description="Table packages include premium bottles and mixers. Additional orders can be placed with your server throughout the night."
            />
          </div>
        </div>

        {/* Party Guidelines */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-emerald-400 mb-6 flex items-center gap-3">
            <Music className="w-6 h-6" />
            Party Guidelines
          </h2>

          <div className="space-y-6">
            <RuleCard
              icon={<Wine className="w-5 h-5" />}
              title="Drink Responsibly"
              description="Enjoy the premium drinks, but know your limits. We reserve the right to cut off service to overly intoxicated guests for everyone's safety."
            />

            <RuleCard
              icon={<Users className="w-5 h-5" />}
              title="Respect the Vibe"
              description="Dance, celebrate, and have fun! But respect other guests' space. No fighting, harassment, or aggressive behavior. Keep it classy."
            />

            <RuleCard
              icon={<Camera className="w-5 h-5" />}
              title="Photos & Videos"
              description="Capture the memories! Personal photos and videos are welcome. Just be respectful of others who may not want to be in your shots."
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
                <span><strong>No refunds</strong></span>
              </li>
              {/* <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>24-48 hours before event:</strong> 50% refund</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>Less than 24 hours:</strong> No refund</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>No-shows:</strong> No refund</span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* What Gets You Kicked Out */}
        <div className="mb-12">
          <div className="bg-slate-800/50 border border-red-500/30 p-8 rounded">
            <h3 className="text-xl font-light text-red-400 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              What Gets You Kicked Out
            </h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed font-light">
              We want everyone to have an amazing time, but certain behaviors won&apos;t be tolerated:
            </p>
            <ul className="space-y-2 text-gray-300 text-sm font-light">
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Fighting, violence, or aggressive behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Sexual harassment or inappropriate touching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Drug use or possession</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Damaging property or equipment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Refusing to follow staff instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>Being overly intoxicated or disruptive</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded">
              <p className="text-red-400 text-xs font-light">
                <strong>Note:</strong> Violation of these rules will result in immediate removal without refund. Serious violations may result in a permanent ban.
              </p>
            </div>
          </div>
        </div>

        {/* The Good Vibes Code */}
        <div className="mb-12">
          <div className="bg-slate-800/50 border border-emerald-700/30 p-8 rounded">
            <h3 className="text-xl font-light text-emerald-400 mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              The Good Vibes Code
            </h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed font-light">
              Casa Privé is all about creating unforgettable nights. Help us keep the energy right:
            </p>
            <ul className="space-y-2 text-gray-300 text-sm font-light">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Come ready to dance and have a great time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Treat staff, security, and other guests with respect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Keep the dance floor alive with your energy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Look out for your friends and party safely</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Tip your servers - they work hard to keep your night flowing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-slate-800/50 border border-yellow-700/30 p-8 rounded">
          <h3 className="text-xl font-light text-white mb-4">Questions?</h3>
          <p className="text-gray-300 mb-6 text-sm font-light">
            Hit us up if you need anything or have concerns
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
            {critical && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">REQUIRED</span>}
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm font-light">{description}</p>
        </div>
      </div>
    </div>
  );
}