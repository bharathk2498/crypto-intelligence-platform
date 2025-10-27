'use client'

import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started with crypto analytics',
    features: [
      'Top 100 coins real-time prices',
      'Basic charts with 24h/7d/30d views',
      'Basic news feed',
      'Coin profiles and watchlist up to 10',
      '3 price alerts',
      '3 saved screens',
      'Limited backtests 14-day window',
      'AI explainer 5 queries per day',
      '1 manual portfolio tracker',
      'Basic volatility risk panel',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '49',
    description: 'For serious traders and analysts',
    features: [
      'All Free features included',
      'Full coverage of 5000 plus coins',
      'Advanced charts with 50 plus indicators',
      'Alpha Beta Sharpe Sortino metrics',
      'Correlation heatmaps and factor screens',
      '50 multi-condition alerts',
      'Unlimited watchlists and backtests 3yr window',
      'Trend regime and breakout signals',
      'On-chain metrics whale tracker DeFi yields',
      'AI Insights 20 queries per day',
      'CSV import portfolio optimization',
      'Strategy builder and PDF reports',
      'Slack and Telegram integration',
    ],
    cta: 'Start Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams and institutions',
    features: [
      'All Premium features included',
      'Team seats with RBAC and workspaces',
      'SSO SAML SCIM integration',
      'Enterprise API with higher limits',
      'Real-time WebSocket feeds',
      'Historical tick data access',
      'Data catalog and lineage',
      'White-label options',
      'VaR ES Monte Carlo risk engine',
      'Compliance dashboard with KYT KYB',
      'Premium research notes',
      'Dedicated customer success manager',
      'Custom Snowflake BigQuery S3 connectors',
      'Legal archiving and audit logs',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function PricingSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Simple Transparent Pricing</h2>
        <p className="text-xl text-text-secondary">
          Choose the plan that fits your needs. Upgrade anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div 
            key={index} 
            className={`card relative ${tier.highlight ? 'ring-2 ring-accent-primary' : ''}`}
          >
            {tier.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">${tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-text-tertiary ml-2">/month</span>}
              </div>
              <p className="text-text-secondary text-sm">{tier.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <Check className="h-5 w-5 text-semantic-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                tier.highlight 
                  ? 'bg-accent-primary hover:bg-accent-primary-hover text-white' 
                  : 'glass hover:bg-white/10 text-white'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-text-tertiary text-sm">
          All plans include email support. Premium and Enterprise get priority support.
          <br />
          Enterprise plans include SLA guarantees and dedicated account management.
        </p>
      </div>
    </div>
  )
}
