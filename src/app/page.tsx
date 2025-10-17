// app/page.tsx
import Link from 'next/link';
import { Crown, Calendar, Users, Sparkles, Shield, Wine } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Casa Privé Logo"
                width={64}
                height={64}
                className="mx-auto animate-pulse"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-yellow-500 to-emerald-400 bg-clip-text text-transparent">
              CASA PRIVÉ
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              An Ode to Exclusive Living
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Welcome to the epitome of luxury and bespoke entertainment.
              A sanctuary where the art of living is celebrated through exclusive,
              imaginative, and flawlessly executed members-only events.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Reserve Your Table
              </Link>
              <Link
                href="/membership"
                className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Join Casa Privé
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-400">
            The Casa Privé Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Sparkles className="w-12 h-12" />}
              title="Curated Excellence"
              description="Meticulously crafted events from grand galas to intimate gourmet dinners that transform the ordinary into the extraordinary."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12" />}
              title="Discerning Community"
              description="Connect with like-minded individuals who appreciate the finer things and the value of intimate, high-quality social experiences."
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12" />}
              title="Privacy & Prestige"
              description="Absolute discretion and privacy guaranteed at all events, ensuring a comfortable and exclusive sanctuary."
            />
            <FeatureCard
              icon={<Calendar className="w-12 h-12" />}
              title="Bespoke Events"
              description="Innovative, themed, and personalized events including annual galas, themed parties, and private concerts."
            />
            <FeatureCard
              icon={<Wine className="w-12 h-12" />}
              title="World-Class Venues"
              description="Exclusive entry to events hosted in the most sought-after and often private locations globally."
            />
            <FeatureCard
              icon={<Crown className="w-12 h-12" />}
              title="Concierge Service"
              description="Access to a dedicated membership liaison for customized event experiences and bespoke arrangements."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-emerald-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-yellow-500">
              Our Vision
            </h2>
            <p className="text-lg text-gray-300 text-center mb-12 leading-relaxed">
              To be the premier, most sought-after private members&apos; club globally,
              redefining the benchmark for luxury entertainment experiences. We envision
              a future where membership at Casa Privé is synonymous with access to the
              world&apos;s most refined and imaginative social calendar.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="bg-slate-800/50 p-8 rounded-lg border border-emerald-700/30">
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">Our Essence</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Commitment to elevated luxury and exclusivity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Every detail meticulously crafted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Curated membership of discerning individuals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Unwavering pursuit of perfection</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-8 rounded-lg border border-yellow-700/30">
                <h3 className="text-2xl font-bold text-yellow-500 mb-4">Our Mission</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Deliver luxurious, immersive experiences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Create bespoke, themed events</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Maintain unwavering quality standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Foster an exclusive sanctuary</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-yellow-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Experience Casa Privé?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our exclusive community and elevate your social calendar to new heights
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="px-8 py-4 bg-white text-emerald-900 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Book a Table
            </Link>
            <Link
              href="/menu"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-900 transition-all transform hover:scale-105"
            >
              View Menu
            </Link>
            <Link
              href="/rules"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-900 transition-all transform hover:scale-105"
            >
              Event Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-emerald-700/30 hover:border-yellow-500/50 transition-all transform hover:scale-105">
      <div className="text-yellow-500 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-emerald-400 mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}