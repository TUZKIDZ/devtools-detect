import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Hotel, Plane, Map, Car, Search, CheckCircle2, CreditCard, Globe2, Star, ChevronRight } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Rayan Travel Services — Book Hotels, Flights, Tours & Cars',
    description: 'Book hotels, flights, tours and car rentals worldwide at the best prices with Rayan Travel.',
  }
}

const CATEGORIES = [
  { key: 'hotels' as const, descKey: 'hotelsDesc' as const, icon: Hotel, type: 'hotel', gradient: 'from-pink-500 to-rose-400', bg: 'bg-pink-50' },
  { key: 'flights' as const, descKey: 'flightsDesc' as const, icon: Plane, type: 'flight', gradient: 'from-purple-500 to-violet-400', bg: 'bg-purple-50' },
  { key: 'tours' as const, descKey: 'toursDesc' as const, icon: Map, type: 'tour', gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50' },
  { key: 'cars' as const, descKey: 'carsDesc' as const, icon: Car, type: 'car', gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50' },
] as const

const HOW_IT_WORKS = [
  { icon: Search, color: 'brand-pink', step: '01' },
  { icon: Star, color: 'brand-purple', step: '02' },
  { icon: CreditCard, color: 'brand-blue', step: '03' },
  { icon: Globe2, color: 'brand-pink', step: '04' },
] as const

const FEATURED_DESTINATIONS = [
  { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', from: 580, listings: 142 },
  { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1499856374459-af2af6a8e7e8?w=600&q=80', from: 220, listings: 218 },
  { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', from: 640, listings: 97 },
  { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', from: 310, listings: 74 },
  { city: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', from: 420, listings: 186 },
  { city: 'Maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80', from: 1200, listings: 38 },
]

function HeroSection() {
  const t = useTranslations('hero')
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark/80" />
      <div className="absolute inset-0 brand-gradient opacity-25" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {t('badge')}
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
          {t('title')}<br />
          <span className="brand-gradient-text">{t('titleHighlight')}</span>
        </h1>

        <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        {/* Search Tabs */}
        <div className="glass rounded-2xl p-2 max-w-3xl mx-auto">
          <div className="flex gap-1 mb-3">
            {([
              { key: 'searchHotels', type: 'hotel', Icon: Hotel },
              { key: 'searchFlights', type: 'flight', Icon: Plane },
              { key: 'searchTours', type: 'tour', Icon: Map },
              { key: 'searchCars', type: 'car', Icon: Car },
            ] as const).map(({ key, type, Icon }) => (
                <Link
                  key={key}
                  href={{ pathname: '/search', query: { type } }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-all"
                >
                  <Icon size={16} />
                  <span className="hidden sm:block">{t(key)}</span>
                </Link>
            ))}
          </div>

          {/* Quick search bar */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white rounded-xl flex items-center gap-3 px-4 py-3">
              <Search size={18} className="text-muted shrink-0" />
              <span className="text-muted text-sm">{t('destination')}</span>
            </div>
            <Link
              href={{ pathname: '/search', query: { type: 'hotel' } }}
              className="brand-gradient text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all whitespace-nowrap text-sm"
            >
              {t('search')}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-12 text-white">
          {[
            { value: '20K+', label: 'Hotels' },
            { value: '500+', label: 'Airlines' },
            { value: '150+', label: 'Countries' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black">{value}</div>
              <div className="text-white/60 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <div className="w-0.5 h-10 bg-gradient-to-b from-white/0 to-white/40 rounded-full animate-pulse" />
      </div>
    </section>
  )
}

function CategoryCards() {
  const t = useTranslations('categories')
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-black text-dark mb-3">{t('title')}</h2>
        <p className="text-muted text-lg max-w-xl mx-auto">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(({ key, descKey, icon: Icon, type, gradient, bg }) => (
          <Link
            key={key}
            href={{ pathname: '/search', query: { type } }}
            className={`group relative ${bg} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-white`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl shadow-md mb-4 group-hover:scale-110 transition-transform`}>
              <Icon size={22} className="text-white" />
            </div>
            <h3 className="font-black text-dark text-base mb-1">{t(key)}</h3>
            <p className="text-muted text-sm">{t(descKey)}</p>
            <ChevronRight size={16} className="absolute bottom-4 right-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const t = useTranslations('howItWorks')
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-dark mb-3">{t('title')}</h2>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue" />

          {HOW_IT_WORKS.map(({ icon: Icon, step }, i) => {
            const titles = [t('step1Title'), t('step2Title'), t('step3Title'), t('step4Title')]
            const descs = [t('step1Desc'), t('step2Desc'), t('step3Desc'), t('step4Desc')]
            return (
              <div key={step} className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 brand-gradient rounded-2xl shadow-lg mb-6 relative z-10">
                  <Icon size={28} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-dark rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-black">{i + 1}</span>
                  </div>
                </div>
                <h3 className="font-black text-dark text-lg mb-2">{titles[i]}</h3>
                <p className="text-muted text-sm leading-relaxed">{descs[i]}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeaturedDestinations() {
  const t = useTranslations('featured')
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-14">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-dark mb-2">{t('title')}</h2>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </div>
        <Link href={{ pathname: '/search', query: { type: 'hotel' } }}
          className="hidden sm:flex items-center gap-1 text-brand-pink font-bold text-sm hover:underline">
          {t('viewAll')} <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_DESTINATIONS.map(({ city, country, image, from, listings }) => (
          <Link
            key={city}
            href={{ pathname: '/search', query: { type: 'hotel', destination: city } }}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer card-shadow hover:card-shadow-hover transition-all duration-300"
          >
            <img
              src={image}
              alt={`${city}, ${country}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-white font-black text-xl">{city}</h3>
                  <p className="text-white/70 text-sm">{country} · {listings} listings</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">from</p>
                  <p className="text-white font-black text-lg">${from}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function TrustBanner() {
  return (
    <section className="py-16 brand-gradient">
      <div className="max-w-7xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-black mb-3">Ready for Your Next Adventure?</h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Join 50,000+ travelers who trust Rayan Travel for their bookings worldwide.
        </p>
        <Link href="/auth/register"
          className="inline-flex items-center gap-2 bg-white text-brand-pink font-black px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
          Get Started Free
          <ChevronRight size={18} />
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryCards />
      <HowItWorks />
      <FeaturedDestinations />
      <TrustBanner />
    </>
  )
}
