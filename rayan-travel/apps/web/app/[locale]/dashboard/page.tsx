import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Link } from '@/i18n/navigation'
import { formatPrice, formatDate } from '@/lib/utils'
import { Hotel, Plane, Map, Car, CalendarDays, ChevronRight } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard')
  return { title: t('title') }
}

const typeIcons = { HOTEL: Hotel, FLIGHT: Plane, TOUR: Map, CAR: Car }
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const t = await getTranslations('dashboard')

  const userId = session.user?.id
  if (!userId) redirect('/auth/login')

  const bookings = await db.booking.findMany({
    where: { userId },
    include: { listing: { select: { name: true, type: true, images: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-dark">
          {t('welcome')}, <span className="brand-gradient-text">{session.user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-muted mt-1">{session.user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: CalendarDays },
          { label: 'Confirmed', value: bookings.filter((b: { status: string }) => b.status === 'CONFIRMED').length, icon: Hotel },
          { label: 'Pending', value: bookings.filter((b: { status: string }) => b.status === 'PENDING').length, icon: Plane },
          { label: 'Countries', value: 0, icon: Map },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-border rounded-2xl p-5 card-shadow">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center mb-3">
              <Icon size={18} className="text-white" />
            </div>
            <div className="text-2xl font-black text-dark">{value}</div>
            <div className="text-xs text-muted mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden card-shadow">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-black text-dark">{t('recentBookings')}</h2>
          <Link href="/account/bookings" className="flex items-center gap-1 text-brand-pink text-sm font-semibold hover:underline">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-white" />
            </div>
            <p className="text-muted mb-4">{t('noBookings')}</p>
            <Link href="/" className="inline-flex items-center gap-1 text-brand-pink font-semibold text-sm hover:underline">
              {t('explore')} <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings.map((booking) => {
              const type = booking.listing.type as keyof typeof typeIcons
              const status = booking.status as keyof typeof statusColors
              const Icon = typeIcons[type] ?? Hotel
              return (
                <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface transition-colors">
                  <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark truncate">{booking.listing.name}</p>
                    <p className="text-xs text-muted mt-0.5">{formatDate(booking.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-dark">{formatPrice(Number(booking.totalPrice))}</p>
                    <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold mt-1 ${statusColors[status]}`}>
                      {t(`status.${status}`)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
