import './globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rise-financial-website-production-bfa8.up.railway.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rise Financial Partners | Wealth Management Sarasota',
    template: '%s | Rise Financial Partners',
  },
  description: 'Experience clarity and confidence in your financial life. Independent fiduciary advisors helping you live boldly and generously.',
  keywords: 'wealth management, financial advisor, Sarasota, fiduciary, investment management, financial planning',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Rise Financial Partners',
    title: 'Rise Financial Partners | Wealth Management Sarasota',
    description: 'Experience clarity and confidence in your financial life. Independent fiduciary advisors helping you live boldly and generously.',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rise Financial Partners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rise Financial Partners | Wealth Management Sarasota',
    description: 'Experience clarity and confidence in your financial life. Independent fiduciary advisors helping you live boldly and generously.',
    images: ['/images/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
