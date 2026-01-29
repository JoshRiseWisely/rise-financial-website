import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, Linkedin, Phone, MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'

const teamData: Record<string, {
  name: string
  credentials?: string
  role: string
  secondaryRole?: string
  image: string
  email: string
  phone: string
  location: string
  linkedin?: string
  bio: string[]
  highlights: string[]
  expertise: string[]
  interests: string[]
}> = {
  'josh-elmore': {
    name: 'Josh Elmore',
    credentials: 'CFP® | CKA®',
    role: 'Director of Wealth Management',
    secondaryRole: 'Wealth Advisor',
    image: '/images/team/josh-elmore.jpg',
    email: 'josh@risewisely.com',
    phone: '941-841-4420',
    location: 'Sarasota, FL',
    linkedin: 'https://www.linkedin.com/in/joshelmore24/',
    bio: [
      'As a CERTIFIED FINANCIAL PLANNER™ and CERTIFIED KINGDOM ADVISOR®, Josh brings a values-driven approach to wealth management. He covers all core areas of financial planning—cash flow, insurance, retirement, tax, investments, and estate planning—with a simple, client-centered process.',
      'Josh\'s approach starts with three foundational questions: Where are you now? Where are you going? How can we help you get there? His goal is to help clients gain clarity and confidence over their financial picture, empowering them to focus on what matters most—their business, family, and community.',
      'After six years at a Fortune 500 financial firm, Josh broke away to pursue independence, ultimately joining Rise Financial Partners where he found partners who share his values and client-first philosophy. A Chicagoland native now calling Sarasota home, Josh is active at 360 Church where he participates in discipleship programs and men\'s small groups.',
    ],
    highlights: [
      'CERTIFIED FINANCIAL PLANNER™',
      'CERTIFIED KINGDOM ADVISOR®',
      'Portfolio Manager',
    ],
    expertise: [
      'Business Succession',
      'Retirement Income Planning',
      'Tax Reduction Strategies',
      'Investment Management',
    ],
    interests: [
      'Cooking healthy food',
      'Christian Theology',
      'Golf & Pickleball',
      'Date nights with wife, Mary',
    ],
  },
  'thomas-hlohinec': {
    name: 'Thomas M. Hlohinec',
    role: 'Chief Executive Officer',
    secondaryRole: 'Wealth Advisor',
    image: '/images/team/thomas-hlohinec.png',
    email: 'thomas@risewisely.com',
    phone: '941-961-8555',
    location: 'Sarasota, FL',
    linkedin: 'https://www.linkedin.com/in/thomas-hlohinec',
    bio: [
      'Thomas founded Rise Financial Partners to fill a void he saw in the industry—a need for trusted, values-aligned financial advice. Born and raised in Sarasota, he was shaped by mentors who invested in him, instilling a passion for helping others that drives his work today.',
      'His practice focuses on helping Christian business owners transition from growing their business to selling it, with expertise in retirement planning, asset protection, faith-based investing, and maximizing charitable giving. Thomas has helped raise over $400M in investment for private strategies and is frequently quoted by industry publications including InvestmentNews and MarketWatch.',
      'Thomas is deeply committed to his community, serving as Treasurer of Avenue941, Board Member of Gatekeepers Christian Networking, and Chairman of the Community Advisory Board for ManaSota Christian Community Foundation. He has served on four mission trips to the Dominican Republic, Honduras, and Peru.',
    ],
    highlights: [
      'Founder & CEO of Rise Financial Partners',
      'CAIA Level II Candidate',
      'Community Leader & Board Member',
    ],
    expertise: [
      'Business Succession',
      'Faith-Based Investing',
      'Charitable Giving',
      'Retirement Planning',
    ],
    interests: [
      'Golf & Pickleball',
      'El Toro Bravo restaurant',
      'Traveling with wife, Natalie',
      'Community volunteering',
    ],
  },
  'josiah-robison': {
    name: 'Josiah Robison',
    role: 'CCO | CTO',
    secondaryRole: 'Wealth Advisor',
    image: '/images/team/josiah-robison.jpg',
    email: 'josiah@risewisely.com',
    phone: '719-393-2250',
    location: 'Colorado Springs, CO',
    bio: [
      'Josiah brings analytical rigor and strategic thinking to Rise Financial Partners, supporting the firm with technology initiatives, compliance oversight, and operational excellence. His day-to-day work spans financial planning analysis, investment research, process optimization, and maximizing organizational efficiencies.',
      'A graduate of the Wharton School at the University of Pennsylvania with a Bachelor of Science in Economics (Finance concentration), Josiah combines elite academic training with practical financial expertise. He serves on the firm\'s Investment Committee and is currently pursuing his CERTIFIED FINANCIAL PLANNER™ designation.',
    ],
    highlights: [
      'Wharton School Graduate',
      'Investment Committee Member',
      'CFP® Candidate',
    ],
    expertise: [
      'Financial Planning Analysis',
      'Investment Research',
      'Technology Strategy',
      'Process Optimization',
    ],
    interests: [
      'Podcasts & Books',
      'Playing Guitar',
      'Working Out',
    ],
  },
  'jeff-speers': {
    name: 'Jeff Speers',
    credentials: 'RICP® | ASBC®',
    role: 'Business Consultant',
    secondaryRole: 'Wealth Advisor',
    image: '/images/team/jeff-speers.png',
    email: 'jeff@risewisely.com',
    phone: '941-628-5492',
    location: 'Sarasota, FL',
    linkedin: 'https://www.linkedin.com/in/jeff-speers-ricp®asbc®-7a71108',
    bio: [
      'Jeff brings 20 years of experience serving families and small businesses as a trusted financial advisor. As a Retirement Income Certified Professional® and Accredited Small Business Consultant®, he specializes in helping clients navigate the transition to retirement and build sustainable income strategies.',
      'His approach centers on helping clients gain clarity and confidence over their financial future. Jeff covers all core areas of financial planning with a focus on business succession, retirement income planning, risk reduction, and tax strategies.',
      'A 40+ year Florida resident, Jeff is defined first by being "Dad" to Sommer, Waylan, and Ramsey, and husband to Megan. He has a heart for serving others, from coordinating Financial Peace University workshops to advising a Christian high school on discipleship programs to coaching competitive baseball and softball. Jeff is active at 360 Church and serves on the committee of Safe Children\'s Coalition, a nonprofit providing family resources and foster/adoption assistance.',
    ],
    highlights: [
      'Retirement Income Specialist',
      'Small Business Consultant',
      '20+ Years Experience',
    ],
    expertise: [
      'Retirement Income Planning',
      'Small Business Consulting',
      'Succession Planning',
      'Risk Management',
    ],
    interests: [
      'Coaching',
      'DIY Home Projects',
      'Charcoal Grilling',
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(teamData).map((slug) => ({ slug }))
}

export default function AdvisorPage({ params }: { params: { slug: string } }) {
  const advisor = teamData[params.slug]

  if (!advisor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-rise-cream pt-20">
      {/* Back Navigation */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <Link 
          href="/team" 
          className="inline-flex items-center gap-2 text-rise-slate hover:text-rise-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Team</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          
          {/* Left Column - Photo & Contact */}
          <div className="lg:col-span-2">
            <div className="sticky top-28">
              {/* Photo */}
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-rise-navy/5 mb-8">
                <Image
                  src={advisor.image}
                  alt={advisor.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <a 
                  href={`mailto:${advisor.email}`}
                  className="flex items-center gap-3 text-rise-slate hover:text-rise-navy transition-colors"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{advisor.email}</span>
                </a>
                
                <a 
                  href={`tel:${advisor.phone}`}
                  className="flex items-center gap-3 text-rise-slate hover:text-rise-navy transition-colors"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{advisor.phone}</span>
                </a>

                <div className="flex items-center gap-3 text-rise-slate">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{advisor.location}</span>
                </div>

                {advisor.linkedin && (
                  <a 
                    href={advisor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-rise-slate hover:text-rise-navy transition-colors"
                  >
                    <Linkedin className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 bg-rise-navy text-white rounded-full hover:bg-rise-blue transition-colors text-sm font-medium"
                >
                  Schedule a Conversation
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Bio */}
          <div className="lg:col-span-3">
            {/* Name & Title */}
            <div className="mb-10">
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-2">
                {advisor.name}{advisor.credentials && <span className="text-rise-blue">, {advisor.credentials}</span>}
              </h1>
              <p className="text-rise-gold text-lg font-medium">
                {advisor.role}
              </p>
              {advisor.secondaryRole && (
                <p className="text-rise-slate">
                  {advisor.secondaryRole}
                </p>
              )}
            </div>

            {/* Highlights */}
            <div className="mb-10">
              <div className="flex flex-wrap gap-3">
                {advisor.highlights.map((item, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-rise-navy/5 rounded-full text-sm text-rise-navy"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-5 mb-12">
              {advisor.bio.map((paragraph, i) => (
                <p key={i} className="text-rise-slate leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Expertise */}
            <div className="mb-10">
              <h2 className="text-sm uppercase tracking-wider text-rise-navy/50 mb-4">
                Areas of Focus
              </h2>
              <div className="flex flex-wrap gap-3">
                {advisor.expertise.map((item, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-white rounded-full text-sm text-rise-navy border border-rise-navy/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h2 className="text-sm uppercase tracking-wider text-rise-navy/50 mb-4">
                Outside the Office
              </h2>
              <div className="flex flex-wrap gap-3">
                {advisor.interests.map((item, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-white rounded-full text-sm text-rise-slate border border-rise-navy/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
