'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().min(1).email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [authError, setAuthError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setAuthError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setAuthError(body.error ?? t('registerError'))
      return
    }
    await signIn('credentials', { email: data.email, password: data.password, callbackUrl: '/dashboard' })
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 brand-gradient rounded-2xl shadow-lg mb-4">
          <span className="text-white font-black text-2xl">R</span>
        </div>
        <h1 className="text-2xl font-black text-dark">{t('registerTitle')}</h1>
        <p className="text-muted text-sm mt-1">{t('registerSubtitle')}</p>
      </div>

      {authError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-error text-sm">
          <AlertCircle size={16} />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name"
          type="text"
          label={t('fullName')}
          placeholder="John Doe"
          icon={<User size={16} />}
          error={errors.name?.message}
          autoComplete="name"
          {...register('name')}
        />
        <Input
          id="email"
          type="email"
          label={t('email')}
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />
        <Input
          id="password"
          type="password"
          label={t('password')}
          placeholder="••••••••"
          icon={<Lock size={16} />}
          error={errors.password?.message}
          autoComplete="new-password"
          {...register('password')}
        />
        <Input
          id="confirmPassword"
          type="password"
          label={t('confirmPassword')}
          placeholder="••••••••"
          icon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        <p className="text-xs text-muted">{t('termsNotice')}</p>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          {t('registerBtn')}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted font-medium">{t('orContinueWith')}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-btn text-sm font-semibold text-dark hover:bg-surface transition-all">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
          <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
        </svg>
        {t('google')}
      </button>

      <p className="text-center text-sm text-muted mt-6">
        {t('hasAccount')}{' '}
        <Link href="/auth/login" className="text-brand-pink font-semibold hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </div>
  )
}
