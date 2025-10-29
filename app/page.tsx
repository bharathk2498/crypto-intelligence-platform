import Hero from '@/components/Hero'
import MarketOverview from '@/components/MarketOverview'
import FeatureShowcase from '@/components/FeatureShowcase'
import PricingSection from '@/components/PricingSection'

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
                <li><a href='/markets' className='hover:text-text-primary'>Markets</a></li>
                <li><a href='/screener' className='hover:text-text-primary'>Screener</a></li>
                <li><a href='/portfolio' className='hover:text-text-primary'>Portfolio</a></li>
                <li><a href='/backtest' className='hover:text-text-primary'>Backtest</a></li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Analytics</h3>
              <ul className='space-y-2 text-text-secondary'>
                <li><a href='/on-chain' className='hover:text-text-primary'>On-chain</a></li>
                <li><a href='/defi' className='hover:text-text-primary'>DeFi</a></li>
                <li><a href='/risk' className='hover:text-text-primary'>Risk</a></li>
                <li><a href='/alerts' className='hover:text-text-primary'>Alerts</a></li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Company</h3>
              <ul className='space-y-2 text-text-secondary'>
                <li><a href='/about' className='hover:text-text-primary'>About</a></li>
                <li><a href='/docs' className='hover:text-text-primary'>Docs</a></li>
                <li><a href='/pricing' className='hover:text-text-primary'>Pricing</a></li>
                <li><a href='/contact' className='hover:text-text-primary'>Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Legal</h3>
              <ul className='space-y-2 text-text-secondary'>
                <li><a href='/privacy' className='hover:text-text-primary'>Privacy</a></li>
                <li><a href='/terms' className='hover:text-text-primary'>Terms</a></li>
                <li><a href='/disclaimer' className='hover:text-text-primary'>Disclaimer</a></li>
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
