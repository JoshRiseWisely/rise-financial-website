import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  services: [
    { name: 'Financial Planning', href: '/services#planning' },
    { name: 'Investment Management', href: '/services#investments' },
    { name: 'Business Consulting', href: '/services#business' },
    { name: 'Foundations & Endowments', href: '/community/foundations' },
  ],
  resources: [
    { name: 'Client Portal', href: '/client-login' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Disclosures', href: '/disclosures' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-rise-navy text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rise-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rise-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="font-display text-white text-xl font-bold">R</span>
              </div>
              <div>
                <p className="font-display text-xl font-semibold leading-tight">Rise Financial</p>
                <p className="text-xs text-rise-sky tracking-wider uppercase">Partners</p>
              </div>
            </Link>
            <p className="text-rise-sky/80 mb-6 max-w-sm leading-relaxed">
              Empowering clients to live boldly and generously through exceptional and relational wealth management.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@RiseWisely.com" className="flex items-center gap-3 text-rise-sky/80 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@RiseWisely.com</span>
              </a>
              <div className="flex items-center gap-3 text-rise-sky/80">
                <MapPin className="w-4 h-4" />
                <span>Sarasota, Florida</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-rise-sky/70 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-rise-sky/70 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-rise-sky/70 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-rise-sky/60">
              © {new Date().getFullYear()} Rise Financial Partners LLC. All rights reserved.
            </p>
            <p className="text-xs text-rise-sky/40 max-w-2xl text-center md:text-right">
              Rise Financial Partners LLC is a registered investment adviser in Florida. Registration does not imply a certain level of skill or training.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
