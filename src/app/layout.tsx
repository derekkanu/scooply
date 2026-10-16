import type { Metadata, Viewport } from 'next'
import { Inter_Tight } from 'next/font/google'
import './globals.css'

// One grotesk for everything: regular for reading, medium and tight for headlines.
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight' })

export const metadata: Metadata = {
  title: 'Scooply – AI News for Enthusiasts',
  description: 'Stay up to date with the AI world, curated for you.',
  openGraph: {
    images: '/og-image.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-clip">{children}</body>
    </html>
  )
}
