'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Info } from 'lucide-react'
import { Asset, RiskMetrics } from '@/lib/types'
import { fetchAssetById, fetchHistoricalPrices, formatPrice, formatPercentage, formatNumber } from '@/lib/api'
import { calculateRiskMetrics, calculateReturns } from '@/lib/risk-calculations'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AssetDetailPage() {
  const params = useParams()
  const id = params?.id as string
  
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [priceHistory, setPriceHistory] = useState<any[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '365d'>('30d')

  useEffect(() => {
    if (!id) return

    async function loadData() {
      setLoading(true)
      
      const assetData = await fetchAssetById(id)
      setAsset(assetData)
      
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
      const history = await fetchHistoricalPrices(id, days)
      
      if (history.length > 0) {
        const chartData = history.map(item => ({
          date: new Date(item.timestamp).toLocaleDateString(),
          price: item.price
        }))
        setPriceHistory(chartData)
        
        const prices = history.map(item => item.price)
        const returns = calculateReturns(prices)
        const metrics = calculateRiskMetrics({ returns })
        setRiskMetrics(metrics)
      }
      
      setLoading(false)
    }

    loadData()
  }, [id, timeframe])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-xl p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-4"></div>
          <div className="h-12 bg-white/10 rounded w-48 mb-8"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Asset Not Found</h2>
          <p className="text-text-secondary">The requested cryptocurrency could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src={asset.image} alt={asset.name} className="w-12 h-12 rounded-full" />
              <div>
                <h1 className="text-3xl font-bold">{asset.name}</h1>
                <p className="text-text-tertiary">{asset.symbol}</p>
              </div>
            </div>
          </div>
          
          <button className="px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors">
            Add to Watchlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-text-tertiary text-sm mb-1">Price</p>
            <p className="text-3xl font-mono font-bold">${formatPrice(asset.current_price)}</p>
            <p className={`text-sm font-medium flex items-center gap-1 ${asset.price_change_percentage_24h >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
              {asset.price_change_percentage_24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatPercentage(asset.price_change_percentage_24h)}
            </p>
          </div>

          <div>
            <p className="text-text-tertiary text-sm mb-1">Market Cap</p>
            <p className="text-2xl font-mono font-semibold">${formatNumber(asset.market_cap)}</p>
          </div>

          <div>
            <p className="text-text-tertiary text-sm mb-1">24h Volume</p>
            <p className="text-2xl font-mono font-semibold">${formatNumber(asset.total_volume)}</p>
          </div>

          <div>
            <p className="text-text-tertiary text-sm mb-1">Circulating Supply</p>
            <p className="text-2xl font-mono font-semibold">{formatNumber(asset.circulating_supply, 0)}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Price Chart</h2>
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '365d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === tf 
                    ? 'bg-accent-primary text-white' 
                    : 'glass hover:bg-white/10'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3142" />
            <XAxis dataKey="date" stroke="#6B7A90" />
            <YAxis stroke="#6B7A90" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E2433', 
                border: '1px solid #3A4358', 
                borderRadius: '8px' 
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#6366F1" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {riskMetrics && (
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-accent-primary" />
            <h2 className="text-xl font-bold">Risk Metrics</h2>
            <div className="group relative">
              <Info className="h-4 w-4 text-text-tertiary cursor-help" />
              <div className="hidden group-hover:block absolute left-0 top-6 w-64 p-3 glass rounded-lg text-sm text-text-secondary z-10">
                Calculated over the selected timeframe using log returns and 252 trading days annualization
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="card">
              <p className="text-text-tertiary text-sm mb-1">Volatility</p>
              <p className="text-2xl font-mono font-semibold">{(riskMetrics.volatility * 100).toFixed(2)}%</p>
            </div>

            <div className="card">
              <p className="text-text-tertiary text-sm mb-1">Sharpe Ratio</p>
              <p className="text-2xl font-mono font-semibold">{riskMetrics.sharpe_ratio.toFixed(2)}</p>
            </div>

            <div className="card">
              <p className="text-text-tertiary text-sm mb-1">Sortino Ratio</p>
              <p className="text-2xl font-mono font-semibold">{riskMetrics.sortino_ratio.toFixed(2)}</p>
            </div>

            <div className="card">
              <p className="text-text-tertiary text-sm mb-1">Max Drawdown</p>
              <p className="text-2xl font-mono font-semibold text-semantic-error">
                {(riskMetrics.max_drawdown * 100).toFixed(2)}%
              </p>
            </div>

            <div className="card">
              <p className="text-text-tertiary text-sm mb-1">Skewness</p>
              <p className="text-2xl font-mono font-semibold">{riskMetrics.skewness.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4 p-4 glass rounded-lg">
            <p className="text-sm text-text-secondary">
              <strong>Note:</strong> Risk metrics are calculated using historical price data and do not predict future performance. 
              Higher volatility indicates higher risk. Sharpe and Sortino ratios above 1.0 are considered good, above 2.0 are very good. 
              Negative skewness indicates more extreme negative returns. These metrics should be used as part of a comprehensive analysis.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Market Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">All-Time High</span>
              <span className="font-mono">${formatPrice(asset.ath)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">All-Time Low</span>
              <span className="font-mono">${formatPrice(asset.atl)}</span>
            </div>
            {asset.max_supply && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Max Supply</span>
                <span className="font-mono">{formatNumber(asset.max_supply, 0)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full py-2 rounded-lg glass hover:bg-white/10 transition-colors text-left px-4">
              Set Price Alert
            </button>
            <button className="w-full py-2 rounded-lg glass hover:bg-white/10 transition-colors text-left px-4">
              Add to Portfolio
            </button>
            <button className="w-full py-2 rounded-lg glass hover:bg-white/10 transition-colors text-left px-4">
              View On-Chain Data
            </button>
            <button className="w-full py-2 rounded-lg glass hover:bg-white/10 transition-colors text-left px-4">
              Compare with Other Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
