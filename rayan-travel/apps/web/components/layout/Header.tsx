'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Menu, X, Globe, ChevronDown, User, LogOut, LayoutDashboard, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { key: 'hotels' as const, pathname: '/search' as const, query: { type: 'hotel' } },
  { key: 'flights' as const, pathname: '/search' as const, query: { type: 'flight' } },
  { key: 'tours' as const, pathname: '/search' as const, query: { type: 'tour' } },
  { key: 'cars' as const, pathname: '/search' as const, query: { type: 'car' } },
]

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const otherLocale = locale === 'en' ? 'fr' : 'en'

  function switchLocale() {
    router.push(pathname, { locale: otherLocale })
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 brand-gradient rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg leading-none">R</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-dark text-base tracking-tight">RAYAN</span>
              <span className="brand-gradient-text font-black text-base tracking-tight ml-1">TRAVEL</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, pathname, query }) => (
              <Link
                key={key}
                href={{ pathname, query }}
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-dark hover:bg-surface rounded-lg transition-all"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-muted hover:text-dark hover:bg-surface rounded-lg transition-all"
              aria-label={`Switch to ${otherLocale.toUpperCase()}`}
            >
              <Globe size={15} />
              <span className="uppercase">{otherLocale}</span>
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-all"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 brand-gradient rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                      </span>
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-semibold text-dark max-w-[100px] truncate">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={cn('text-muted transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-border z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-dark truncate">{session.user?.name}</p>
                        <p className="text-xs text-muted truncate">{session.user?.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-surface transition-colors">
                        <LayoutDashboard size={15} className="text-muted" /> {t('dashboard')}
                      </Link>
                      <Link href="/account/bookings" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-surface transition-colors">
                        <CalendarDays size={15} className="text-muted" /> {t('myBookings')}
                      </Link>
                      <div className="border-t border-border mt-1" />
                      <button onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors">
                        <LogOut size={15} /> {t('logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-dark hover:bg-surface rounded-lg transition-all">
                  {t('login')}
                </Link>
                <Link href="/auth/register"
                  className="px-4 py-2 text-sm font-semibold text-white brand-gradient rounded-btn shadow-md hover:opacity-90 transition-all">
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ key, pathname, query }) => (
              <Link key={key} href={{ pathname, query }}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-dark hover:bg-surface rounded-lg transition-all">
                {t(key)}
              </Link>
            ))}
            {!session && (
              <div className="flex gap-2 pt-2 border-t border-border mt-1">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold border border-border rounded-btn hover:bg-surface transition-all">
                  {t('login')}
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white brand-gradient rounded-btn shadow-md">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
