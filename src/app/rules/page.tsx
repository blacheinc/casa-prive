// app/rules/page.tsx - Casa Privé x Alora Beach Resort
import { Shield, Users, Clock, Shirt, Wine, Camera, AlertCircle, Music } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <Music className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Event Guidelines
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Casa Privé × Alora Beach Resort — Let&apos;s party responsibly and keep the vibes right
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Dress Code - Featured */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-slate-800/80 to-emerald-900/30 border-2 border-yellow-500/50 p-8 rounded">
            <div className="flex items-center gap-3 mb-6">
              <Shirt className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-light text-yellow-500">
                Dress Code: Refined Luxury Attire
              </h2>
            </div>

            <p className="text-gray-200 mb-6 text-sm leading-relaxed font-light">
              To preserve the prestige and exclusivity of Casa Privé at Alora Beach Resort, every guest is expected to embody
              sophistication, confidence, and effortless elegance. Our environment reflects refined luxury —
              your style should too.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Gentlemen */}
              <div className="bg-slate-900/50 p-6 rounded border border-emerald-700/30">
                <h3 className="text-xl font-light text-emerald-400 mb-4">Gentlemen</h3>
                <ul className="space-y-3 text-gray-300 text-sm font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">✓</span>
                    <span>Tailored or well-fitted shirts, linen or silk tops, elegant trousers, or dress jeans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">✓</span>
                    <span>Designer polos or turtlenecks when styled with refinement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">✓</span>
                    <span>Loafers, Chelsea boots, or luxury sneakers in immaculate condition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span><strong>Strictly no</strong> flip-flops, shorts, athletic wear, or distressed clothing</span>
                  </li>
                </ul>
              </div>

              {/* Ladies */}
              <div className="bg-slate-900/50 p-6 rounded border border-emerald-700/30">
                <h3 className="text-xl font-light text-emerald-400 mb-4">Ladies</h3>
                <ul className="space-y-3 text-gray-300 text-sm font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">✓</span>
                    <span>Elegant evening wear, cocktail dresses, or chic tailored sets with glamour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">✓</span>
                    <span><strong>Heels are mandatory.</strong> No flats, slippers, or casual sandals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">✓</span>
                    <span>Tasteful accessories, polished hair, and refined makeup encouraged</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/40 rounded p-4">
              <p className="text-red-300 text-sm font-light text-center">
                <strong>Casa Privé represents modern opulence and timeless class.</strong> Guests not meeting
                the required dress code will be respectfully denied entry to maintain the ambiance of exclusivity.
              </p>
            </div>
          </div>
        </div>

        {/* Entry Requirements */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-emerald-400 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6" />
            Entry Requirements
          </h2>

          <div className="space-y-6">
            <RuleCard
              icon={<Clock className="w-5 h-5" />}
              title="Age Requirement"
              description="21+ only. Valid ID required at the door. No exceptions."
              critical
            />

            <RuleCard
              icon={<Shield className="w-5 h-5" />}
              title="Security Check"
              description="All guests are subject to security screening at entry to Alora Beach Resort. Prohibited items include weapons, drugs, and outside food/beverages. Management reserves the right to refuse entry."
              critical
            />
          </div>
        </div>

        {/* Table Rules */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-yellow-500 mb-6 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Table Tickets
          </h2>

          <div className="space-y-6">
            <RuleCard
              icon={<Users className="w-5 h-5" />}
              title="Maximum 6 Guests Per Table"
              description="Each table ticket accommodates up to 6 guests. This ensures everyone has space to vibe and enjoy the night."
              critical
            />

            <RuleCard
              icon={<Clock className="w-5 h-5" />}
              title="Table Duration"
              description="Your table is reserved for the entire night at Alora Beach Resort. Arrive when you want, stay as long as you like until closing."
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
                <span><strong>No-shows:</strong> No refund</span>
              </li>
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
              We want everyone to have an amazing time at Alora Beach Resort, but certain behaviors won&apos;t be tolerated:
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
                <strong>Note:</strong> Violation of these rules will result in immediate removal without refund. Serious violations may result in a permanent ban from future Casa Privé × Alora Beach Resort events.
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
              Casa Privé × Alora Beach Resort is all about creating unforgettable nights. Help us keep the energy right:
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
            Hit us up if you need anything or have concerns about the event
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
