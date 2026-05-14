import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 brand-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">R</span>
              </div>
              <div>
                <span className="font-black text-white text-base">RAYAN</span>
                <span className="brand-gradient-text font-black text-base ml-1">TRAVEL</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6">{t('tagline')}</p>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'Instagram', path: 'M16 2H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6zm-4 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm5.5-10.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' },
                { label: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
              ].map(({ label, path }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-pink/30 flex items-center justify-center transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/70">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-4">{t('company')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('about'), href: '/about' },
                { label: t('careers'), href: '/careers' },
                { label: t('press'), href: '/press' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/'}
                    className="text-sm text-white/70 hover:text-white hover:brand-gradient-text transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-4">{t('support')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('help'), href: '/help' },
                { label: t('contact'), href: '/contact' },
                { label: t('faq'), href: '/faq' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/'}
                    className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-4">{t('legal')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('terms'), href: '/terms' },
                { label: t('privacy'), href: '/privacy' },
                { label: t('cookies'), href: '/cookies' },
                { label: t('refund'), href: '/refund' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/'}
                    className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {year} Rayan Travel Services LTD. {t('rights')}
          </p>
          <div className="flex items-center gap-3">
            {/* Payment icons */}
            {['VISA', 'MC', 'AMEX', 'STR'].map((brand) => (
              <div key={brand} className="px-2 py-1 bg-white/10 rounded text-xs font-bold text-white/60">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
