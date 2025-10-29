import Hero from '@/components/Hero'
import MarketOverview from '@/components/MarketOverview'
import FeatureShowcase from '@/components/FeatureShowcase'
import PricingSection from '@/components/PricingSection'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='relative'>
      <Hero />
      <MarketOverview />
      <FeatureShowcase />
      <PricingSection />
      <footer className='border-t border-border-subtle py-12 mt-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Products</h3>
              <ul className='space-y-2 text-text-secondary'>
                <li><Link href='/markets' className='hover:text-text-primary'>Markets</Link></li>
                <li><Link href='/screener' className='hover:text-text-primary'>Screener</Link></li>
                <li><Link href='/portfolio' className='hover:text-text-primary'>Portfolio</Link></li>
                <li><Link href='/backtest' className='hover:text-text-primary'>Backtest</Link></li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Analytics</h3>
              <ul className='space-y-2 text-text-secondary'>
                <li><Link href='/onchain' className='hover:text-text-primary'>On-chain</Link></li>
                <li><Link href='/defi' className='hover:text-text-primary'>DeFi</Link></li>
                <li><Link href='/risk' className='hover:text-text-primary'>Risk</Link></li>
                <li><Link href='/alerts' className='hover:text-text-primary'>Alerts</Link></li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Company</h3>
              <ul className='space-y-2 text-text-secondary'>
                <li><Link href='/about' className='hover:text-text-primary'>About</Link></li>
                <li><Link href='/docs' className='hover:text-text-primary'>Docs</Link></li>
                <li><Link href='/pricing' className='hover:text-text-primary'>Pricing</Link></li>
                <li><Link href='/contact' className='hover:text-text-primary'>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Legal</h3>
              <ul className='space-y-2 text-text-secondary'>
                <li><Link href='/privacy' className='hover:text-text-primary'>Privacy</Link></li>
                <li><Link href='/terms' className='hover:text-text-primary'>Terms</Link></li>
                <li><Link href='/disclaimer' className='hover:text-text-primary'>Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className='mt-12 pt-8 border-t border-border-subtle text-center text-text-tertiary'>
            © 2025 Crypto Intelligence Platform. Not financial advice. Data provided as-is.
          </div>
        </div>
      </footer>
    </div>
  )
}