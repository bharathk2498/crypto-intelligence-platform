'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, PieChart, Download, Settings } from 'lucide-react'
import { Portfolio, PortfolioPosition } from '@/lib/types'
import { formatPrice, formatPercentage, formatNumber } from '@/lib/api'

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const mockPortfolio: Portfolio = {
      id: '1',
      name: 'Main Portfolio',
      description: 'Primary investment portfolio',
      created_at: '2024-01-01',
      updated_at: new Date().toISOString(),
      positions: [
        {
          asset_id: 'bitcoin',
          symbol: 'BTC',
          quantity: 0.5,
          avg_buy_price: 38000,
          current_price: 43250,
          value: 21625,
          weight: 0.45,
          pnl: 2625,
          pnl_percentage: 13.8
        },
        {
          asset_id: 'ethereum',
          symbol: 'ETH',
          quantity: 8,
          avg_buy_price: 2100,
          current_price: 2280,
          value: 18240,
          weight: 0.38,
          pnl: 1440,
          pnl_percentage: 8.57
        },
        {
          asset_id: 'solana',
          symbol: 'SOL',
          quantity: 85,
          avg_buy_price: 92,
          current_price: 98.45,
          value: 8368.25,
          weight: 0.17,
          pnl: 549.25,
          pnl_percentage: 7.01
        }
      ],
      total_value: 48233.25,
      total_cost_basis: 44019,
      total_pnl: 4214.25,
      total_pnl_percentage: 9.57
    }

    setPortfolios([mockPortfolio])
    setActivePortfolio(mockPortfolio)
  }, [])

  if (!activePortfolio) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <PieChart className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Portfolio Yet</h2>
          <p className="text-text-secondary mb-6">Create your first portfolio to start tracking your crypto investments</p>
          <button className="px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors text-white font-semibold flex items-center gap-2 mx-auto">
            <Plus className="h-5 w-5" />
            Create Portfolio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-text-secondary">Track and analyze your crypto holdings</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export
          </button>
          <button className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Position
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <p className="text-text-tertiary text-sm mb-1">Total Value</p>
          <p className="text-3xl font-mono font-bold">${formatNumber(activePortfolio.total_value)}</p>
        </div>

        <div className="card">
          <p className="text-text-tertiary text-sm mb-1">Total Cost Basis</p>
          <p className="text-2xl font-mono font-semibold">${formatNumber(activePortfolio.total_cost_basis)}</p>
        </div>

        <div className="card">
          <p className="text-text-tertiary text-sm mb-1">Total P&L</p>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-mono font-semibold ${activePortfolio.total_pnl >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
              ${formatNumber(Math.abs(activePortfolio.total_pnl))}
            </p>
            {activePortfolio.total_pnl >= 0 ? <TrendingUp className="h-5 w-5 text-semantic-success" /> : <TrendingDown className="h-5 w-5 text-semantic-error" />}
          </div>
        </div>

        <div className="card">
          <p className="text-text-tertiary text-sm mb-1">Return</p>
          <p className={`text-2xl font-mono font-semibold ${activePortfolio.total_pnl_percentage >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
            {formatPercentage(activePortfolio.total_pnl_percentage)}
          </p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Asset</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Quantity</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Avg Buy Price</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Current Price</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Value</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">P&L</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Weight</th>
              </tr>
            </thead>
            <tbody>
              {activePortfolio.positions.map((position, index) => (
                <tr key={index} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{position.symbol}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 font-mono">{position.quantity}</td>
                  <td className="text-right py-4 px-4 font-mono">${formatPrice(position.avg_buy_price)}</td>
                  <td className="text-right py-4 px-4 font-mono">${formatPrice(position.current_price)}</td>
                  <td className="text-right py-4 px-4 font-mono font-semibold">${formatNumber(position.value)}</td>
                  <td className={`text-right py-4 px-4 font-mono font-semibold ${position.pnl >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
                    {formatPercentage(position.pnl_percentage)}
                  </td>
                  <td className="text-right py-4 px-4 font-mono">{(position.weight * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Allocation</h3>
          <div className="space-y-3">
            {activePortfolio.positions.map((position, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-text-secondary">{position.symbol}</span>
                  <span className="font-mono">{(position.weight * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-surface-default rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2 rounded-full"
                    style={{ width: `${position.weight * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Best Performer</span>
              <span className="font-semibold text-semantic-success">BTC +13.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Worst Performer</span>
              <span className="font-semibold text-semantic-success">SOL +7.01%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Number of Assets</span>
              <span className="font-mono">{activePortfolio.positions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Portfolio Age</span>
              <span className="font-mono">10 months</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 glass rounded-lg">
        <p className="text-sm text-text-secondary">
          <strong>Disclaimer:</strong> This portfolio tracker is for informational purposes only. 
          Price data may be delayed. Past performance does not guarantee future results. 
          Always conduct your own research before making investment decisions.
        </p>
      </div>
    </div>
  )
}
