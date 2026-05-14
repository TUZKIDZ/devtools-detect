import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { RegisterForm } from '@/components/auth/RegisterForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('registerTitle') }
}

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 brand-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white text-center">
          <h2 className="text-3xl font-black mb-3">Join Rayan Travel</h2>
          <p className="text-white/80 text-lg max-w-xs leading-relaxed">
            Create your free account and start exploring the world today.
          </p>
          <div className="mt-10 space-y-4 text-left w-full max-w-xs">
            {[
              'Access exclusive deals and offers',
              'Manage all your bookings in one place',
              'Get 24/7 customer support',
              'Earn rewards on every booking',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-white/90 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <RegisterForm />
      </div>
    </div>
  )
}
