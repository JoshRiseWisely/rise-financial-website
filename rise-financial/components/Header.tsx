'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Our Team', 
    href: '/team',
    children: [
      { name: 'Thomas Hlohinec', href: '/team/thomas-hlohinec' },
      { name: 'Josh Elmore', href: '/team/josh-elmore' },
      { name: 'Josiah Robison', href: '/team/josiah-robison' },
      { name: 'Jeff Speers', href: '/team/jeff-speers' },
    ]
  },
  { name: 'Services', href: '/services' },
  { 
    name: 'Community', 
    href: '/community',
    children: [
      { name: 'Foundations & Endowments', href: '/community/foundations' },
    ]
  },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-rise-cream/95 backdrop-blur-sm border-b border-rise-navy/10">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Top">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rise-navy to-rise-blue flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <span className="font-display text-white text-xl font-bold">R</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rise-gold rounded-full opacity-80"></div>
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-xl font-semibold text-rise-navy leading-tight">Rise Financial</p>
              <p className="text-xs text-rise-slate tracking-wider uppercase">Partners</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-rise-navy hover:text-rise-blue transition-colors duration-200"
                >
                  {item.name}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>
                
                {/* Dropdown */}
                {item.children && openDropdown === item.name && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-xl border border-rise-navy/10 py-2 animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-rise-slate hover:text-rise-navy hover:bg-rise-cream/50 transition-colors duration-200"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Link
              href="/client-login"
              className="text-sm font-medium text-rise-slate hover:text-rise-navy transition-colors"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-rise-navy rounded-full hover:bg-rise-blue transition-all duration-300 shadow-lg shadow-rise-navy/20 hover:shadow-rise-blue/30 hover:-translate-y-0.5"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-rise-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-rise-navy/10 animate-fade-in">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block py-3 text-base font-medium text-rise-navy hover:text-rise-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="pl-4 border-l-2 border-rise-gold/30 ml-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block py-2 text-sm text-rise-slate hover:text-rise-navy"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-rise-navy/10">
              <Link href="/client-login" className="text-sm font-medium text-rise-slate">
                Client Login
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-rise-navy rounded-full"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
