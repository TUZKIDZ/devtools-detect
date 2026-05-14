import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/search': { en: '/search', fr: '/recherche' },
    '/auth/login': { en: '/auth/login', fr: '/auth/connexion' },
    '/auth/register': { en: '/auth/register', fr: '/auth/inscription' },
    '/dashboard': { en: '/dashboard', fr: '/tableau-de-bord' },
    '/account/bookings': { en: '/account/bookings', fr: '/compte/reservations' },
    '/cart': { en: '/cart', fr: '/panier' },
    '/checkout': { en: '/checkout', fr: '/paiement' },
  },
})

export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]
