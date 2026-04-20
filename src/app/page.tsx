// app/page.tsx - Casa Privé x Alora Beach Resort Partnership
import Link from 'next/link';
import { Calendar, Users, Shield, Ticket, ArrowRight, ChevronDown, MapPin, Music, PartyPopper } from 'lucide-react';
import Image from 'next/image';
import ExperienceSection from '@/components/ExperienceSection';

export default function HomePage() {
  return (
    <div className="bg-emerald-950">
      {/* 1. HERO SECTION - Image Background */}
      <section className="relative h-screen overflow-hidden">
        <Image
          src="/hero-bg.webp"
          alt="Casa Privé"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-emerald-950/50 to-emerald-950/80" />

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

          <div className="mb-4 animate-fade-in-up">
            <Image
              src="/logo-text.png"
              alt="Casa Privé"
              width={500}
              height={100}
              className="mx-auto"
              style={{ background: 'transparent' }}
              priority
            />
          </div>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4" />

          <p className="text-lg md:text-xl font-light text-yellow-400 mb-2 animate-fade-in-up animation-delay-200 tracking-wider">
            CASA PRIVÉ <span className="text-white">×</span> ALORA BEACH RESORT
          </p>

          <p className="text-base md:text-lg text-gray-200 mb-4 max-w-2xl leading-relaxed font-light animate-fade-in-up animation-delay-400">
            An exclusive monthly experience of premium drinks, music, and luxury
            at Alora Beach Resort.
          </p>

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-8 animate-fade-in-up animation-delay-400">
            <MapPin size={16} className="text-yellow-500" />
            <span className="font-light">Alora Beach Resort &bull; Monthly Events</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
            <Link
              href="/tickets"
              className="group px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-light tracking-widest transition-all duration-300 flex items-center justify-center"
            >
              GET TICKETS
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link
              href="/booking"
              className="px-8 py-3 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-emerald-900 text-sm font-light tracking-widest transition-all duration-300"
            >
              BOOK A TABLE
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-yellow-500" size={24} />
        </div>
      </section>

      {/* 2. PARTNERSHIP BANNER */}
      <section className="py-12 px-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-y border-yellow-700/20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-3 font-light">Official Partnership</p>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
            Casa Privé <span className="text-yellow-500">×</span> Alora Beach Resort
          </h2>
          <p className="text-gray-300 font-light text-sm max-w-2xl mx-auto leading-relaxed">
            Two icons of luxury come together. Experience Casa Privé&apos;s signature drinks and entertainment
            at the stunning Alora Beach Resort. Every month, a night to remember.
          </p>
        </div>
      </section>

      {/* 3. EXPERIENCE SECTION */}
      <ExperienceSection />

      {/* 4. BENEFITS SECTION */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Why <span className="text-yellow-500">Casa Privé × Alora Beach</span>
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <BenefitCard
              icon={<Ticket className="w-10 h-10" />}
              title="Premium Tickets"
              description="Secure your spot at the most exclusive monthly beach event in Accra. Limited tickets available."
            />
            <BenefitCard
              icon={<Users className="w-10 h-10" />}
              title="Elite Community"
              description="Connect with discerning individuals in an intimate, sophisticated beachside setting."
            />
            <BenefitCard
              icon={<Shield className="w-10 h-10" />}
              title="Exclusive Access"
              description="Members-only perks with priority ticket access and VIP experiences every month."
            />
            <BenefitCard
              icon={<Calendar className="w-10 h-10" />}
              title="Monthly Events"
              description="Every month, experience Casa Privé at its finest at the stunning Alora Beach Resort."
            />
            <BenefitCard
              icon={<Music className="w-10 h-10" />}
              title="Beachside Vibes"
              description="World-class DJs, ocean breezes, and the perfect ambiance for an unforgettable night."
            />
            <BenefitCard
              icon={<PartyPopper className="w-10 h-10" />}
              title="VIP Service"
              description="Dedicated table service, premium bottle packages, and personalized attention all night."
            />
          </div>

          {/* Vision Quote */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-emerald-950/50 border border-yellow-700/20 p-8 md:p-12 text-center">
              <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-4 text-white">
                &quot;Where the ocean meets opulence. Casa Privé and Alora Beach Resort unite to create{' '}
                <span className="text-yellow-500 italic">the ultimate monthly experience</span>&quot;
              </blockquote>
              <cite className="text-gray-400 not-italic text-sm font-light tracking-wider">
                CASA PRIVÉ × ALORA BEACH RESORT
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <Image
          src="/gallery/6.png"
          alt="Casa Privé x Alora Beach Resort Event"
          fill
          className="object-cover"
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
            <h2 className="text-3xl md:text-4xl font-light mb-2 text-white">
              Get Your Tickets
            </h2>
            <p className="text-yellow-400 text-sm font-light tracking-wider mb-4">
              Casa Privé × Alora Beach Resort
            </p>
            <p className="text-base md:text-lg text-gray-200 mb-8 font-light leading-relaxed">
              Join us for an unforgettable monthly experience of premium drinks,
              music, and luxury at Alora Beach Resort
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/tickets"
                className="px-8 py-3 bg-white text-emerald-900 hover:bg-gray-100 text-sm font-light tracking-widest transition-all duration-300"
              >
                GET TICKETS
              </Link>
              <Link
                href="/booking"
                className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-emerald-900 text-sm font-light tracking-widest transition-all duration-300"
              >
                BOOK A TABLE
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
