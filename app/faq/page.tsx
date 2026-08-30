import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about working with Rise Financial Partners — fiduciary duty, credentials, fees, advisor compensation, and how to get started.',
}

const faqs: FaqItem[] = [
  {
    question: 'What is a Fiduciary?',
    answer: [
      'A fiduciary is held to the highest legal standard to act in their client’s best interests. All Registered Investment Advisors (RIAs) and their Investment Advisory Representatives (IARs) are held to this standard. CFP® professionals also uphold this standard by committing to the CFP Board’s Code of Ethics and Standards.',
    ],
  },
  {
    question: 'Can you work via Zoom/Virtually?',
    answer: [
      'Yes! We meet clients often via Zoom.',
      'Relationships are paramount at Rise Financial Partners, and our intention is to develop and maintain lasting relationships with our clients. While we love meeting clients in person, we embrace and appreciate that the technology of the age allows us to maintain a personal approach even when we are not in close proximity to clients.',
    ],
  },
  {
    question: 'What is a CFP® (CERTIFIED FINANCIAL PLANNER™)?',
    answer: [
      'We have a CFP® on staff and available to assist all our advisors and their clients when needed.',
      'The Certified Financial Planner (CFP) designation is a formal recognition of expertise in the areas of financial planning, taxes, insurance, estate planning, and retirement saving.',
      'Owned and awarded by the Certified Financial Planner Board of Standards, Inc., the designation is awarded to individuals who successfully complete the CFP Board’s initial exams, then continue ongoing annual education programs to sustain their skills and certification.',
    ],
  },
  {
    question: 'What is a CKA® (Certified Kingdom Advisor)?',
    answer: [
      'The CKA is a certification designed for professionals serving clients in the Christian faith and who take a values-based approach to financial matters. It involves a course of study that integrates biblical principles with core financial advisory training. Essentially, CKA holders frame their financial expertise within a worldview consistent with Christian teachings.',
      'The CKA certification requires professional bona fides not unlike many other financial certifications. Applicants must have certain approved degrees or certifications, such as JD, CPA, CFP, or ChFC, or 10 years of experience in their designated field.',
    ],
  },
  {
    question: 'Does Rise offer investor protection?',
    answer: [
      'Your money is held at a custodian brokerage firm and is not held by Rise. Each custodial brokerage firm is insured by the SIPC for up to $500,000 per account type and is protected against losses resulting from the failure of the broker-dealer. Please note that, unlike FDIC insurance for banks, SIPC does not protect against losses due to normal swings in the market. An explanatory brochure is available on the SIPC’s website.',
    ],
  },
  {
    question: 'How do your Advisors get compensated?',
    answer: [
      'Primarily, clients pay us directly in the form of financial planning fees and assets under management (AUM) fees.',
      'Financial planning fees may be billed for the time required to build a foundational financial plan, to develop plan recommendations, and to implement the plan.',
      'Assets Under Management (AUM) fees are charged to any account that Rise manages. Certain cash management accounts or other accounts of special circumstance may be charged a low fee or no fee at all. Rise is not affiliated with a broker/dealer and therefore takes no commissions from third-party mutual funds or brokerage products. Most often, Rise advisors are compensated directly by you, the client, for the services provided.',
      'On some occasions, we may receive insurance commissions from an insurance company if we are the writing agent on a life insurance contract. In that event, proper disclosure is made to each one of our clients.',
    ],
  },
  {
    question: 'What fees do you charge?',
    answer: [
      'At Rise, we are a collective of values-based advisors, each working with their own subset of clients. So each advisor, depending on how they do business, may maintain a different fee schedule.',
      'Planning fees start around $2,000 and may increase with complexity. Assets Under Management (AUM) fees generally range from 0.75% to 1.50%.*',
      '*Cash management and foundation/endowment accounts may be offered a lower fee rate. For more information on fees, view our firm’s Form ADV.',
    ],
  },
  {
    question: 'How do I get started?',
    answer: [
      'The very first step is letting us know you’re interested in working with Rise Financial Partners. We’re always curious how we can help new clients.',
      'A discovery phone call or Zoom call will help you evaluate us, and help us determine if we’re a good fit to help you.',
      'Fill out our request meeting form today.',
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="pt-20">

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-rise-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy"></div>
        <div className="absolute top-10 right-0 w-[700px] h-[700px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rise-gold/[0.06] rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-0 w-px h-40 bg-gradient-to-b from-transparent via-rise-gold/20 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-sm rounded-full mb-8 border border-white/10">
            <span className="w-2 h-2 bg-rise-gold rounded-full"></span>
            <span className="text-sm font-medium text-rise-sky">Common Questions</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.1] mb-6">
            Frequently Asked
            <br />
            <span className="text-rise-gold">Questions</span>
          </h1>

          <p className="text-lg md:text-xl text-rise-sky leading-relaxed max-w-2xl mx-auto">
            Straight answers about how we work, what we charge, and how our advisors are held accountable to you.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ACCORDION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-rise-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-5">
            Still have a question?
          </h2>
          <p className="text-lg text-rise-slate mb-10 max-w-xl mx-auto">
            If you didn&apos;t find what you were looking for, we&apos;d rather talk it through than leave you guessing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-rise-navy rounded-full hover:bg-rise-blue transition-all duration-300 shadow-lg shadow-rise-navy/20 hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              Schedule a Conversation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-rise-navy border-2 border-rise-navy/15 rounded-full hover:border-rise-navy/40 hover:bg-white transition-all duration-300"
            >
              Explore Our Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
