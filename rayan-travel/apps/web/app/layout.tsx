import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Rayan Travel Services', template: '%s | Rayan Travel' },
  description: 'Book hotels, flights, tours and car rentals worldwide at the best prices.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
