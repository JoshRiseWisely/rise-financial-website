import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'

const portals = [
  {
    name: 'Charles Schwab',
    description: 'Access your Schwab investment accounts',
    logo: '/images/logos/schwab.png',
    url: 'https://client.schwab.com/Areas/Access/Login',
    logoWidth: 200,
    logoHeight: 60,
  },
  {
    name: 'Altruist',
    description: 'Access your Altruist investment accounts',
    logo: '/images/logos/altruist.png',
    url: 'https://www.altruist.com',
    logoWidth: 180,
    logoHeight: 50,
  },
]

export default function ClientLoginPage() {
  return (
    <div className="min-h-screen bg-rise-cream pt-20">
      {/* Back Navigation */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-rise-slate hover:text-rise-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
            Client Login
          </h1>
          <p className="text-rise-slate text-lg">
            Select your custodial partner to access your accounts
          </p>
        </div>

        {/* Portal Cards */}
        <div className="space-y-6">
          {portals.map((portal, i) => (
            <a
              key={i}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-2xl p-8 shadow-lg shadow-rise-navy/5 hover:shadow-xl hover:shadow-rise-navy/10 transition-all duration-300 border border-rise-navy/5 hover:border-rise-navy/10"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Logo */}
                <div className="flex-shrink-0 h-16 flex items-center justify-center">
                  <Image
                    src={portal.logo}
                    alt={portal.name}
                    width={portal.logoWidth}
                    height={portal.logoHeight}
                    className="h-12 w-auto object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow text-center sm:text-left">
                  <h2 className="font-display text-xl font-semibold text-rise-navy mb-1 group-hover:text-rise-blue transition-colors">
                    {portal.name}
                  </h2>
                  <p className="text-rise-slate text-sm">
                    {portal.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rise-navy/5 flex items-center justify-center group-hover:bg-rise-navy transition-colors">
                    <ExternalLink className="w-5 h-5 text-rise-navy group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-rise-slate text-sm mb-4">
            Need help accessing your accounts?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-rise-navy font-medium hover:text-rise-blue transition-colors"
          >
            Contact Us
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}
