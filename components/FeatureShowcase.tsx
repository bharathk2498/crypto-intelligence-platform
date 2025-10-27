'use client'

import { Calculator, LineChart, Brain, Bell, TrendingUp, Shield } from 'lucide-react'

const features = [
  {
    icon: Calculator,
    title: 'Advanced Risk Analytics',
    description: 'Comprehensive risk metrics including Alpha, Beta, Sharpe Ratio, Sortino Ratio, Max Drawdown, VaR, and ES with full formula transparency and confidence intervals.',
    tier: 'Premium',
  },
  {
    icon: LineChart,
    title: 'Portfolio Optimization',
    description: 'Mean-variance optimization, risk parity, and equal risk contribution strategies with customizable constraints and efficient frontier visualization.',
    tier: 'Premium',
  },
  {
    icon: Brain,
    title: 'AI Copilot',
    description: 'Natural language analytics queries, automated strategy generation, contextual explainers, and intelligent insights with guardrails against hallucinations.',
    tier: 'All Tiers',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Price, technical, on-chain, and factor-based alerts with multiple channels including email, SMS, Slack, Telegram, and webhooks.',
    tier: 'Free+',
  },
  {
    icon: TrendingUp,
    title: 'Strategy Backtesting',
    description: 'No-code strategy builder with realistic transaction costs, slippage models, position sizing, and Monte Carlo confidence intervals.',
    tier: 'Premium',
  },
  {
    icon: Shield,
    title: 'On-Chain Intelligence',
    description: 'Supply distribution analysis, exchange flows, whale tracking, validator data, and DeFi protocol risk scoring.',
    tier: 'Premium',
  },
]

export default function FeatureShowcase() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Institutional-Grade Features</h2>
        <p className="text-xl text-text-secondary">
          Everything you need for professional crypto analysis and decision-making
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="card group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary">
                {feature.tier}
              </span>
            </div>
            
            <p className="text-text-secondary">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
