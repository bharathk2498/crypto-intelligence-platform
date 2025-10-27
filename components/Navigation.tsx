'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, TrendingUp } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-accent-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                CryptoIntel
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/markets" className="text-text-secondary hover:text-text-primary transition-colors">
              Markets
            </Link>
            <Link href="/screener" className="text-text-secondary hover:text-text-primary transition-colors">
              Screener
            </Link>
            <Link href="/portfolio" className="text-text-secondary hover:text-text-primary transition-colors">
              Portfolio
            </Link>
            <Link href="/backtest" className="text-text-secondary hover:text-text-primary transition-colors">
              Backtest
            </Link>
            <Link href="/on-chain" className="text-text-secondary hover:text-text-primary transition-colors">
              On-Chain
            </Link>
            <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </Link>
            
            <button className="px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors text-white font-medium">
              Sign In
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/markets" className="block px-3 py-2 text-text-secondary hover:text-text-primary">
              Markets
            </Link>
            <Link href="/screener" className="block px-3 py-2 text-text-secondary hover:text-text-primary">
              Screener
            </Link>
            <Link href="/portfolio" className="block px-3 py-2 text-text-secondary hover:text-text-primary">
              Portfolio
            </Link>
            <Link href="/backtest" className="block px-3 py-2 text-text-secondary hover:text-text-primary">
              Backtest
            </Link>
            <Link href="/on-chain" className="block px-3 py-2 text-text-secondary hover:text-text-primary">
              On-Chain
            </Link>
            <Link href="/pricing" className="block px-3 py-2 text-text-secondary hover:text-text-primary">
              Pricing
            </Link>
            <button className="w-full mt-2 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors text-white font-medium">
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
