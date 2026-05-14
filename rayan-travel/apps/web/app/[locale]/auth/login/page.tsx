import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { LoginForm } from '@/components/auth/LoginForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('loginTitle') }
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <LoginForm />
      </div>

      {/* Right panel — visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 brand-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-white font-black text-4xl">R</span>
          </div>
          <h2 className="text-3xl font-black mb-3">Rayan Travel</h2>
          <p className="text-white/80 text-lg max-w-xs leading-relaxed">
            Your trusted partner for unforgettable journeys around the world.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[
              { value: '50K+', label: 'Happy Travelers' },
              { value: '120+', label: 'Destinations' },
              { value: '24/7', label: 'Support' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-black">{value}</div>
                <div className="text-white/70 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
