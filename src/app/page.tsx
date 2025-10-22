// app/page.tsx - UPDATED WITHOUT WINE
import Link from 'next/link';
import { Calendar, Users, Sparkles, Shield, Wine, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-emerald-950">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(6, 78, 59, 0.75)), url('https://images.unsplash.com/photo-1656150008539-5f12b51dbfd3?q=80&w=2074&auto=format&fit=crop')`,
          }}
        />

        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/grid.svg')` }} />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="mb-6 animate-fade-in">
            <Image
              src="/logo.png"
              alt="Casa Privé Logo"
              width={80}
              height={80}
              className="mx-auto opacity-90"
              style={{ background: 'transparent' }}
            />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-widest text-white animate-fade-in-up">
            CASA PRIVÉ
          </h1>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6" />

          <p className="text-xl md:text-2xl font-light text-gray-100 mb-4 animate-fade-in-up animation-delay-200">
            An Exclusive Drinks Experience
          </p>

          <p className="text-base md:text-lg text-gray-200 mb-12 max-w-2xl leading-relaxed font-light animate-fade-in-up animation-delay-400">
            Immerse yourself in an evening of premium cocktails, rare spirits, and luxury champagne.
            A sophisticated sanctuary for discerning palates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
            <Link
              href="/booking"
              className="group px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-light tracking-widest transition-all duration-300 flex items-center justify-center"
            >
              RESERVE TABLE
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link
              href="/menu"
              className="px-8 py-3 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-emerald-900 text-sm font-light tracking-widest transition-all duration-300"
            >
              VIEW DRINKS MENU
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-yellow-500" size={24} />
        </div>
      </section>

      {/* 2. DRINKS SHOWCASE */}
      <section className="py-20 px-4 bg-emerald-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Wine className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Premium <span className="text-yellow-500">Spirits</span>
            </h2>
            <p className="text-gray-300 font-light text-sm max-w-2xl mx-auto">
              Master mixologists craft extraordinary cocktails using rare spirits and the finest ingredients
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
          </div>

          {/* Main Featured Drinks Image */}
          <div className="relative h-[500px] mb-8 group overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-950/30" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="h-px w-20 bg-yellow-500 mb-4 mx-auto" />
                <h3 className="text-3xl md:text-4xl font-light mb-3 text-white">Premium Spirits & Cocktails</h3>
                <p className="text-gray-200 font-light text-base">
                  From signature cocktails to rare tequilas and cognacs, every pour is an experience crafted to perfection
                </p>
              </div>
            </div>
          </div>

          {/* Drinks Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative h-96 md:h-full group overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2187&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="h-px w-16 bg-yellow-500 mb-4" />
                <h3 className="text-2xl md:text-3xl font-light text-white mb-2">Fine Spirits</h3>
                <p className="text-gray-200 font-light text-sm">Premium tequilas, cognacs, and rare spirits</p>
              </div>
            </div>

            <div className="md:col-span-2 relative h-60 group overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=2070&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Signature Cocktails</h4>
              </div>
            </div>

            <div className="relative h-60 group overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1635547018520-043b6f0e1a36?q=80&w=2670&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Premium Tequila</h4>
              </div>
            </div>

            <div className="relative h-60 group overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Champagne Bar</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS SECTION */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Why <span className="text-yellow-500">Casa Privé</span>
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <BenefitCard
              icon={<Wine className="w-10 h-10" />}
              title="Premium Selection"
              description="Curated collection of rare spirits, craft cocktails, and luxury champagne."
            />
            <BenefitCard
              icon={<Users className="w-10 h-10" />}
              title="Elite Community"
              description="Connect with discerning individuals in an intimate, sophisticated setting."
            />
            <BenefitCard
              icon={<Shield className="w-10 h-10" />}
              title="Exclusive Access"
              description="Members-only events with priority reservations and special experiences."
            />
            <BenefitCard
              icon={<Calendar className="w-10 h-10" />}
              title="Saturday Nights"
              description="Every Saturday evening, experience Casa Privé at its finest."
            />
            <BenefitCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Sophisticated Ambiance"
              description="Elegant venue with premium furnishings and intimate lighting."
            />
            <BenefitCard
              icon={<Image src="/logo.png" alt="VIP" width={40} height={40}
                style={{ background: 'transparent' }} />}
              title="VIP Service"
              description="Dedicated table service and personalized attention throughout the evening."
            />
          </div>

          {/* Vision Quote */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-emerald-950/50 border border-yellow-700/20 p-8 md:p-12 text-center">
              <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-4 text-white">
                &quot;Where exceptional drinks meet extraordinary company. An exclusive sanctuary for those
                who appreciate{' '}
                <span className="text-yellow-500 italic">the art of refined living</span>&quot;
              </blockquote>
              <cite className="text-gray-400 not-italic text-sm font-light tracking-wider">
                — CASA PRIVÉ
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-950/90 to-emerald-950/95" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-emerald-950/60 backdrop-blur-sm border border-emerald-700/30 p-8 md:p-12 text-center">
            <Image
              src="/logo.png"
              alt="Casa Privé"
              width={64}
              height={64}
              className="mx-auto mb-6 opacity-90"
              style={{ background: 'transparent' }}
            />
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-white">
              Reserve Your Experience
            </h2>
            <p className="text-base md:text-lg text-gray-200 mb-8 font-light leading-relaxed">
              Join us for an unforgettable evening of premium drinks and refined company
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/booking"
                className="px-8 py-3 bg-white text-emerald-900 hover:bg-gray-100 text-sm font-light tracking-widest transition-all duration-300"
              >
                BOOK A TABLE
              </Link>
              <Link
                href="/menu"
                className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-emerald-900 text-sm font-light tracking-widest transition-all duration-300"
              >
                VIEW DRINKS MENU
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-emerald-950/50 p-6 border border-emerald-700/30 hover:border-yellow-500/50 transition-all duration-500 h-full group">
      <div className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-light text-emerald-400 mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed font-light text-sm">{description}</p>
    </div>
  );
}