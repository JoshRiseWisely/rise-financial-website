import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'

type Portal = {
  name: string
  description: string
  url: string
  logo?: string
  logoWidth?: number
  logoHeight?: number
}

const portalGroups: { heading: string; blurb: string; portals: Portal[] }[] = [
  {
    heading: 'Custodial Partners',
    blurb: 'Where your accounts are held. Use these to view balances, statements, and tax documents.',
    portals: [
      {
        name: 'Charles Schwab',
        description: 'Access your Schwab investment accounts',
        url: 'https://client.schwab.com/Login/SignOn/CustomerCenterLogin.aspx',
      },
      {
        name: 'Altruist',
        description: 'Access your Altruist investment accounts',
        url: 'https://app.altruist.com/login',
      },
    ],
  },
  {
    heading: 'Planning & Reporting',
    blurb: 'Your financial plan, performance reporting, and shared documents.',
    portals: [
      {
        name: 'Rise Portal',
        description: 'Your financial planning portal, powered by RightCapital',
        url: 'https://app.rightcapital.com/account/login',
      },
      {
        name: 'Advyzon',
        description: 'Performance reporting and your secure document vault',
        url: 'https://client.myadvisorlink.com/auth/users/webportal/risefinancialpartners',
      },
    ],
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
        <div className="text-center mb-14">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
            Client Login
          </h1>
          <p className="text-rise-slate text-lg">
            Select the portal you&apos;d like to access
          </p>
        </div>

        {portalGroups.map((group, g) => (
          <div key={g} className={g > 0 ? 'mt-14' : ''}>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-rise-navy">{group.heading}</h2>
              <p className="text-rise-slate text-sm mt-1">{group.blurb}</p>
            </div>

            <div className="space-y-6">
              {group.portals.map((portal, i) => (
                <a
                  key={i}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl p-8 shadow-lg shadow-rise-navy/5 hover:shadow-xl hover:shadow-rise-navy/10 transition-all duration-300 border border-rise-navy/5 hover:border-rise-navy/10"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Only render a logo column where we actually have a usable asset;
                        otherwise the card name below carries the branding. */}
                    {portal.logo && (
                      <div className="flex-shrink-0 h-16 w-[180px] flex items-center justify-center sm:justify-start">
                        <Image
                          src={portal.logo}
                          alt={portal.name}
                          width={portal.logoWidth ?? 180}
                          height={portal.logoHeight ?? 50}
                          sizes="180px"
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                    )}

                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-display text-xl font-semibold text-rise-navy mb-1 group-hover:text-rise-blue transition-colors">
                        {portal.name}
                      </h3>
                      <p className="text-rise-slate text-sm">{portal.description}</p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-rise-navy/5 flex items-center justify-center group-hover:bg-rise-navy transition-colors">
                        <ExternalLink className="w-5 h-5 text-rise-navy group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Help Section */}
        <div className="mt-14 text-center">
          <p className="text-rise-slate text-sm mb-4">Need help accessing your accounts?</p>
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
