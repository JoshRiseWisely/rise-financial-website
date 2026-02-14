import './globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Rise Financial Partners | Wealth Management Sarasota',
  description: 'Experience clarity and confidence in your financial life. Independent fiduciary advisors helping you live boldly and generously.',
  keywords: 'wealth management, financial advisor, Sarasota, fiduciary, investment management, financial planning',
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
