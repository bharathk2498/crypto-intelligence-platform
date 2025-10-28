'use client'

// Improved asset detail page for Crypto Intelligence Platform.
// The original file declared `use client` without quotes and destructured
// `params` through `use()`, which is not supported in Next.js. This
// version fixes those issues by adding the proper directive and using
// direct prop destructuring for the `params` object. It retains the
// advanced chart and metric displays. Replace your existing
// `app/asset/[id]/page.tsx` with this file.

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, Star, Bell, ExternalLink, Activity } from 'lucide-react'
import {
  fetchAssetById,
  fetchHistoricalPrices,
  fetchOnChainMetrics,
  formatPrice,
  formatPercentage,
} from '@/lib/api'
import { Asset, PriceData, OnChainMetrics } from '@/lib/types'
import AdvancedChart from '@/components/AdvancedChart'
import Link from 'next/link'

interface AssetDetailProps {
  params: {
    id: string
  }
}

export default function AssetDetailPage({ params }: AssetDetailProps) {
  const { id } = params
  const [asset, setAsset] = useState<Asset | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [onChainData, setOnChainData] = useState<OnChainMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30')
  useEffect(() => {
    loadAssetData()
  }, [id, timeframe])
  async function loadAssetData() {
    setLoading(true)
    const [assetData, historyData, onChain] = await Promise.all([
      fetchAssetById(id),
      fetchHistoricalPrices(id, parseInt(timeframe)),
      fetchOnChainMetrics(id),
    ])
    setAsset(assetData)
    setPriceHistory(historyData)
    setOnChainData(onChain)
    setLoading(false)
  }
  if (loading || !asset) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
        </div>
      </div>
    )
  }
  const riskMetrics = {
    sharpe_ratio: 1.45,
    sortino_ratio: 1.82,
    volatility: 0.65,
    max_drawdown: -0.32,
    beta: 1.15,
    alpha: 0.08,
    r_squared: 0.78,
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/markets" className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Markets
      </Link>
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset.image} alt={asset.name} className="w-16 h-16 rounded-full" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold">{asset.name}</h1>
              <span className="px-3 py-1 rounded-lg bg-background-secondary text-lg font-mono">
                {asset.symbol}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>Rank #1</span>
              <a href={asset.id} className="hover:text-accent-primary transition-colors flex items-center gap-1">
                Website <ExternalLink className="h-3 w-3" />
              </a>
              <a href={asset.id} className="hover:text-accent-primary transition-colors flex items-center gap-1">
                Whitepaper <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
            <Star className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-xl p-6">
          <div className="text-sm text-text-secondary mb-2">Price</div>
          <div className="text-3xl font-bold font-mono mb-1">${formatPrice(asset.current_price)}</div>
          <div
            className={`flex items-center gap-1 text-sm ${
              asset.price_change_percentage_24h >= 0 ? 'text-semantic-success' : 'text-semantic-error'
            }`}
          >
            {asset.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {formatPercentage(asset.price_change_percentage_24h)} (24h)
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="text-sm text-text-secondary mb-2">Market Cap</div>
          <div className="text-2xl font-bold font-mono">${(asset.market_cap / 1e9).toFixed(2)}B</div>
          <div className="text-sm text-text-tertiary">Volume: ${(asset.total_volume / 1e9).toFixed(2)}B</div>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="text-sm text-text-secondary mb-2">Circulating Supply</div>
          <div className="text-2xl font-bold font-mono">{(asset.circulating_supply / 1e6).toFixed(2)}M</div>
          <div className="text-sm text-text-tertiary">
            {asset.max_supply ? `Max: ${(asset.max_supply / 1e6).toFixed(2)}M` : 'No max supply'}
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="text-sm text-text-secondary mb-2">All Time High</div>
          <div className="text-2xl font-bold font-mono">${formatPrice(asset.ath)}</div>
          <div className="text-sm text-semantic-error">
            {((asset.current_price - asset.ath) / asset.ath * 100).toFixed(1)}% from ATH
          </div>
        </div>
      </div>
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Price Chart</h2>
          <div className="flex items-center gap-2">
            {['7', '30', '90', '365'].map((days) => (
              <button
                key={days}
                onClick={() => setTimeframe(days)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeframe === days ? 'bg-accent-primary text-white' : 'glass hover:bg-white/10'
                }`}
              >
                {days === '7' ? '1W' : days === '30' ? '1M' : days === '90' ? '3M' : '1Y'}
              </button>
            ))}
          </div>
        </div>
        <AdvancedChart data={priceHistory} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Risk Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
              <div>
                <div className="text-text-secondary text-sm mb-1">Sharpe Ratio</div>
                <div className="text-sm text-text-tertiary">Risk-adjusted return</div>
              </div>
              <div className="text-2xl font-bold font-mono">{riskMetrics.sharpe_ratio.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
              <div>
                <div className="text-text-secondary text-sm mb-1">Sortino Ratio</div>
                <div className="text-sm text-text-tertiary">Downside risk-adjusted</div>
              </div>
              <div className="text-2xl font-bold font-mono">{riskMetrics.sortino_ratio.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
              <div>
                <div className="text-text-secondary text-sm mb-1">Volatility (Annual)</div>
                <div className="text-sm text-text-tertiary">Price fluctuation</div>
              </div>
              <div className="text-2xl font-bold font-mono">{(riskMetrics.volatility * 100).toFixed(1)}%</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
              <div>
                <div className="text-text-secondary text-sm mb-1">Maximum Drawdown</div>
                <div className="text-sm text-text-tertiary">Peak to trough decline</div>
              </div>
              <div className="text-2xl font-bold font-mono text-semantic-error">
                {(riskMetrics.max_drawdown * 100).toFixed(1)}%
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-background-secondary text-center">
                <div className="text-text-secondary text-xs mb-1">Beta</div>
                <div className="text-lg font-bold font-mono">{riskMetrics.beta.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-background-secondary text-center">
                <div className="text-text-secondary text-xs mb-1">Alpha</div>
                <div className="text-lg font-bold font-mono">{(riskMetrics.alpha * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-background-secondary text-center">
                <div className="text-text-secondary text-xs mb-1">R-Squared</div>
                <div className="text-lg font-bold font-mono">{riskMetrics.r_squared.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        {onChainData && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">On-Chain Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
                <div>
                  <div className="text-text-secondary text-sm mb-1">Active Addresses</div>
                  <div className="text-sm text-text-tertiary">Daily active users</div>
                </div>
                <div className="text-2xl font-bold font-mono">{(onChainData.active_addresses / 1000).toFixed(0)}K</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
                <div>
                  <div className="text-text-secondary text-sm mb-1">Transaction Count</div>
                  <div className="text-sm text-text-tertiary">Daily transactions</div>
                </div>
                <div className="text-2xl font-bold font-mono">{(onChainData.transaction_count / 1000).toFixed(0)}K</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
                <div>
                  <div className="text-text-secondary text-sm mb-1">Net Exchange Flow</div>
                  <div className="text-sm text-text-tertiary">
                    {onChainData.net_exchange_flow < 0 ? 'Bullish signal' : 'Bearish signal'}
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold font-mono ${
                    onChainData.net_exchange_flow < 0 ? 'text-semantic-success' : 'text-semantic-error'
                  }`}
                >
                  {onChainData.net_exchange_flow >= 0 ? '+' : ''}
                  {onChainData.net_exchange_flow}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary">
                <div>
                  <div className="text-text-secondary text-sm mb-1">Whale Transactions</div>
                  <div className="text-sm text-text-tertiary">Large transfers (24h)</div>
                </div>
                <div className="text-2xl font-bold font-mono">{onChainData.whale_transactions}</div>
              </div>
              <div className="p-4 rounded-lg bg-background-secondary">
                <div className="text-text-secondary text-sm mb-3">Supply Distribution</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Long-term Holders</span>
                      <span className="font-mono">{(onChainData.supply_held_by_lth * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-background-primary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-semantic-success"
                        style={{ width: `${onChainData.supply_held_by_lth * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Short-term Holders</span>
                      <span className="font-mono">{(onChainData.supply_held_by_sth * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-background-primary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-semantic-error"
                        style={{ width: `${onChainData.supply_held_by_sth * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">About {asset.name}</h2>
        <p className="text-text-secondary leading-relaxed">
          {asset.name} ({asset.symbol}) is a leading cryptocurrency with a market capitalization of $
          {(asset.market_cap / 1e9).toFixed(2)} billion. The asset has shown significant growth and maintains strong
          fundamentals across multiple metrics including network activity, development, and community engagement. With
          a current price of ${formatPrice(asset.current_price)}, it represents a {Math.abs(
            ((asset.current_price - asset.ath) / asset.ath) * 100,
          ).toFixed(1)}% discount from its all-time high of ${formatPrice(asset.ath)}.
        </p>
      </div>
    </div>
  )
}