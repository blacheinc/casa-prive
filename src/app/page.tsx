// app/page.tsx - Casa Privé x Alora Beach Resort Partnership
import Link from 'next/link';
import { Calendar, Users, Sparkles, Shield, Ticket, ArrowRight, ChevronDown, MapPin, Music, PartyPopper } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-emerald-950">
      {/* 1. HERO SECTION - Video Background */}
      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/casa_hero.mp4" type="video/mp4" />
        </video>
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

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-4 tracking-widest text-white animate-fade-in-up">
            CASA PRIVÉ
          </h1>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4" />

          <p className="text-lg md:text-xl font-light text-yellow-400 mb-2 animate-fade-in-up animation-delay-200 tracking-wider">
            × ALORA BEACH RESORT
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
              href="/"
              className="group px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-light tracking-widest transition-all duration-300 flex items-center justify-center"
            >
              GET TICKETS
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

      {/* 2. PARTNERSHIP BANNER */}
      <section className="py-12 px-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-y border-yellow-700/20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-yellow-500 text-xs tracking-[0.3em] uppercase mb-3 font-light">Official Partnership</p>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
            Casa Privé <span className="text-yellow-500">×</span> Alora Beach Resort
          </h2>
          <p className="text-gray-300 font-light text-sm max-w-2xl mx-auto leading-relaxed">
            Two icons of luxury come together. Experience Casa Privé&apos;s signature drinks and entertainment
            at the stunning Alora Beach Resort — every month, a night to remember.
          </p>
        </div>
      </section>

      {/* 3. PHOTO GALLERY SHOWCASE */}
      <section className="py-20 px-4 bg-emerald-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              The <span className="text-yellow-500">Experience</span>
            </h2>
            <p className="text-gray-300 font-light text-sm max-w-2xl mx-auto">
              Premium drinks, stunning beachside vibes, and unforgettable nights at Alora Beach Resort
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
          </div>

          {/* Main Featured Image */}
          <div className="relative h-[500px] mb-8 group overflow-hidden">
            <Image
              src="/gallery/1.png"
              alt="Casa Privé x Alora Beach Resort"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-950/30" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="h-px w-20 bg-yellow-500 mb-4 mx-auto" />
                <h3 className="text-3xl md:text-4xl font-light mb-3 text-white">Beachside Luxury</h3>
                <p className="text-gray-200 font-light text-base">
                  Where the ocean breeze meets premium spirits and world-class entertainment
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative h-96 md:h-full group overflow-hidden">
              <Image
                src="/gallery/2.png"
                alt="Casa Privé Event"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="h-px w-16 bg-yellow-500 mb-4" />
                <h3 className="text-2xl md:text-3xl font-light text-white mb-2">The Vibes</h3>
                <p className="text-gray-200 font-light text-sm">Premium atmosphere at Alora Beach</p>
              </div>
            </div>

            <div className="md:col-span-2 relative h-60 group overflow-hidden">
              <Image
                src="/gallery/3.png"
                alt="Casa Privé Drinks"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Signature Cocktails</h4>
              </div>
            </div>

            <div className="relative h-60 group overflow-hidden">
              <Image
                src="/gallery/4.png"
                alt="Casa Privé Party"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Night Energy</h4>
              </div>
            </div>

            <div className="relative h-60 group overflow-hidden">
              <Image
                src="/gallery/5.png"
                alt="Alora Beach Resort"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Beach Setting</h4>
              </div>
            </div>
          </div>

          {/* Additional Gallery Row */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="relative h-72 group overflow-hidden">
              <Image
                src="/gallery/6.png"
                alt="Casa Privé Event Moments"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Unforgettable Moments</h4>
              </div>
            </div>

            <div className="relative h-72 group overflow-hidden">
              <Image
                src="/gallery/7.png"
                alt="Casa Privé Premium Service"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">Premium Service</h4>
              </div>
            </div>

            <div className="relative h-72 group overflow-hidden">
              <Image
                src="/gallery/8.png"
                alt="Casa Privé Crowd"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-light text-white">The Crowd</h4>
              </div>
            </div>
          </div>

          {/* Final Gallery Row */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="relative h-80 group overflow-hidden">
              <Image
                src="/gallery/9.png"
                alt="Casa Privé Ambiance"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="text-xl font-light text-white">The Ambiance</h4>
              </div>
            </div>

            <div className="relative h-80 group overflow-hidden">
              <Image
                src="/gallery/10.png"
                alt="Casa Privé Drinks Selection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="text-xl font-light text-white">Premium Drinks</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              description="Every month, experience Casa Privé at its finest — at the stunning Alora Beach Resort."
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
                — CASA PRIVÉ × ALORA BEACH RESORT
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
                href="/"
                className="px-8 py-3 bg-white text-emerald-900 hover:bg-gray-100 text-sm font-light tracking-widest transition-all duration-300"
              >
                GET TICKETS
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
