'use clien't

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, PieChart, BarChart3, Settings, Download, RefreshCw } from 'lucide-react'
import { Portfolio, PortfolioPosition } from '@/lib/types'
import { fetchAssetById, formatPrice, formatPercentage } from '@/lib/api'
import { calculateRiskMetrics } from '@/lib/risk-calculations'

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolios()
  }, [])

  async function loadPortfolios() {
    setLoading(true)
    
    const mockPortfolios: Portfolio[] = [
      {
        id: '1',
        name: 'Main Portfolio',
        description: 'Long term holdings',
        created_at: '2024-01-01',
        updated_at: '2025-01-25',
        positions: [
          {
            asset_id: 'bitcoin',
            symbol: 'BTC',
            quantity: 0.5,
            avg_buy_price: 40000,
            current_price: 43250,
            value: 21625,
            weight: 0.54,
            pnl: 1625,
            pnl_percentage: 8.13
          },
          {
            asset_id: 'ethereum',
            symbol: 'ETH',
            quantity: 10,
            avg_buy_price: 2000,
            current_price: 2280,
            value: 22800,
            weight: 0.57,
            pnl: 2800,
            pnl_percentage: 14.0
          }
        ],
        total_value: 44425,
        total_cost_basis: 40000,
        total_pnl: 4425,
        total_pnl_percentage: 11.06
      }
    ]

    setPortfolios(mockPortfolios)
    if (mockPortfolios.length > 0) {
      setSelectedPortfolio(mockPortfolios[0].id)
    }
    setLoading(false)
  }

  const currentPortfolio = portfolios.find(p => p.id === selectedPortfolio)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Portfolio Management</h1>
          <p className="text-text-secondary mt-2">Track and optimize your crypto holdings</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Portfolio
        </button>
      </div>

      {portfolios.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <PieChart className="h-16 w-16 mx-auto mb-4 text-text-tertiary" />
          <h2 className="text-2xl font-semibold mb-2">No Portfolios Yet</h2>
          <p className="text-text-secondary mb-6">Create your first portfolio to start tracking your investments</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors"
          >
            Create Portfolio
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            {portfolios.map(portfolio => (
              <button
                key={portfolio.id}
                onClick={() => setSelectedPortfolio(portfolio.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPortfolio === portfolio.id
                    ? 'bg-accent-primary text-white'
                    : 'glass hover:bg-white/10'
                }`}
              >
                {portfolio.name}
              </button>
            ))}
          </div>

          {currentPortfolio && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-sm">Total Value</span>
                    <BarChart3 className="h-4 w-4 text-text-tertiary" />
                  </div>
                  <div className="text-2xl font-bold font-mono">
                    ${currentPortfolio.total_value.toLocaleString()}
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-sm">Total P&L</span>
                    {currentPortfolio.total_pnl >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-semantic-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-semantic-error" />
                    )}
                  </div>
                  <div className={`text-2xl font-bold font-mono ${
                    currentPortfolio.total_pnl >= 0 ? 'text-semantic-success' : 'text-semantic-error'
                  }`}>
                    {currentPortfolio.total_pnl >= 0 ? '+' : ''}${currentPortfolio.total_pnl.toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    currentPortfolio.total_pnl >= 0 ? 'text-semantic-success' : 'text-semantic-error'
                  }`}>
                    {formatPercentage(currentPortfolio.total_pnl_percentage)}
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-sm">Cost Basis</span>
                  </div>
                  <div className="text-2xl font-bold font-mono">
                    ${currentPortfolio.total_cost_basis.toLocaleString()}
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-sm">Assets</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {currentPortfolio.positions.length}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Holdings</h2>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentPortfolio.positions.map(position => (
                      <div key={position.asset_id} className="flex items-center justify-between p-4 rounded-lg glass hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div>
                            <div className="font-semibold">{position.symbol}</div>
                            <div className="text-sm text-text-tertiary">{position.quantity} units</div>
                          </div>
                        </div>

                        <div className="text-right mr-8">
                          <div className="font-mono">${formatPrice(position.current_price)}</div>
                          <div className="text-sm text-text-tertiary">Current Price</div>
                        </div>

                        <div className="text-right mr-8">
                          <div className="font-mono font-semibold">${position.value.toLocaleString()}</div>
                          <div className="text-sm text-text-tertiary">{(position.weight * 100).toFixed(1)}% of portfolio</div>
                        </div>

                        <div className="text-right">
                          <div className={`font-mono font-semibold ${
                            position.pnl >= 0 ? 'text-semantic-success' : 'text-semantic-error'
                          }`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                          </div>
                          <div className={`text-sm ${
                            position.pnl >= 0 ? 'text-semantic-success' : 'text-semantic-error'
                          }`}>
                            {formatPercentage(position.pnl_percentage)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 py-3 rounded-lg border border-border-default hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Position
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Allocation</h3>
                    <div className="space-y-3">
                      {currentPortfolio.positions.map(position => (
                        <div key={position.asset_id}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>{position.symbol}</span>
                            <span className="font-mono">{(position.weight * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                              style={{ width: `${position.weight * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Risk Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">Sharpe Ratio</span>
                        <span className="font-mono">1.45</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">Volatility</span>
                        <span className="font-mono">42.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">Max Drawdown</span>
                        <span className="font-mono text-semantic-error">-18.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">Beta</span>
                        <span className="font-mono">0.89</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
