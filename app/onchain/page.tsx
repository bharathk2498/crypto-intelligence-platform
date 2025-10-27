'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, TrendingDown, Database, Users, ArrowUpDown, Layers } from 'lucide-react'
import { OnChainMetrics } from '@/lib/types'
import { fetchOnChainMetrics, formatNumber } from '@/lib/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface OnChainData {
  assetId: string
  assetName: string
  metrics: OnChainMetrics
}

export default function OnChainPage() {
  const [selectedAsset, setSelectedAsset] = useState('bitcoin')
  const [onChainData, setOnChainData] = useState<OnChainData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')

  const assets = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' }
  ]

  useEffect(() => {
    async function loadOnChainData() {
      setLoading(true)
      const metrics = await fetchOnChainMetrics(selectedAsset)
      
      if (metrics) {
        const asset = assets.find(a => a.id === selectedAsset)
        setOnChainData({
          assetId: selectedAsset,
          assetName: asset?.name || selectedAsset,
          metrics
        })
      }
      setLoading(false)
    }

    loadOnChainData()
  }, [selectedAsset])

  // Mock historical data for charts
  const exchangeFlowData = [
    { date: 'Mon', inflow: 12500, outflow: 11800 },
    { date: 'Tue', inflow: 13200, outflow: 12100 },
    { date: 'Wed', inflow: 11800, outflow: 13500 },
    { date: 'Thu', inflow: 14100, outflow: 12800 },
    { date: 'Fri', inflow: 12900, outflow: 14200 },
    { date: 'Sat', inflow: 13800, outflow: 13100 },
    { date: 'Sun', inflow: 12500, outflow: 11900 }
  ]

  const activeAddressesData = [
    { date: '1d', count: 920000 },
    { date: '2d', count: 935000 },
    { date: '3d', count: 950000 },
    { date: '4d', count: 945000 },
    { date: '5d', count: 960000 },
    { date: '6d', count: 955000 },
    { date: '7d', count: 950000 }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-xl p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-4"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">On-Chain Analytics</h1>
          <p className="text-text-secondary">Real-time blockchain metrics and network health indicators</p>
        </div>
        
        <div className="flex gap-3">
          {(['24h', '7d', '30d'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {assets.map(asset => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedAsset === asset.id
                  ? 'bg-accent-primary text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {asset.name} ({asset.symbol})
            </button>
          ))}
        </div>
      </div>

      {onChainData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-accent-primary" />
                <p className="text-text-tertiary text-sm">Active Addresses</p>
              </div>
              <p className="text-3xl font-mono font-bold">{formatNumber(onChainData.metrics.active_addresses, 0)}</p>
              <p className="text-sm text-semantic-success mt-1">+2.4% vs yesterday</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-accent-primary" />
                <p className="text-text-tertiary text-sm">Transactions (24h)</p>
              </div>
              <p className="text-3xl font-mono font-bold">{formatNumber(onChainData.metrics.transaction_count, 0)}</p>
              <p className="text-sm text-semantic-success mt-1">+1.8% vs yesterday</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpDown className="h-5 w-5 text-accent-primary" />
                <p className="text-text-tertiary text-sm">Net Exchange Flow</p>
              </div>
              <p className={`text-3xl font-mono font-bold ${onChainData.metrics.net_exchange_flow >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
                {onChainData.metrics.net_exchange_flow >= 0 ? '+' : ''}{formatNumber(Math.abs(onChainData.metrics.net_exchange_flow), 0)}
              </p>
              <p className="text-sm text-text-tertiary mt-1">BTC</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-accent-primary" />
                <p className="text-text-tertiary text-sm">Whale Transactions</p>
              </div>
              <p className="text-3xl font-mono font-bold">{onChainData.metrics.whale_transactions}</p>
              <p className="text-sm text-text-tertiary mt-1">{'>'}$100k transfers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Exchange Flow (7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={exchangeFlowData}>
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
                  <Legend />
                  <Bar dataKey="inflow" fill="#EF4444" name="Inflow" />
                  <Bar dataKey="outflow" fill="#10B981" name="Outflow" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 glass rounded-lg text-sm">
                <p className="text-text-secondary">
                  <strong>Net Flow:</strong> Negative flow (more outflow) typically indicates accumulation and is bullish. 
                  Positive flow (more inflow) suggests selling pressure.
                </p>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Active Addresses (7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activeAddressesData}>
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
                    dataKey="count" 
                    stroke="#6366F1" 
                    strokeWidth={3} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 glass rounded-lg text-sm">
                <p className="text-text-secondary">
                  <strong>Network Activity:</strong> Rising active addresses indicate growing network adoption and user engagement.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Supply Distribution</h3>
              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-text-secondary">Long-Term Holders (LTH)</span>
                    <span className="font-mono font-semibold">{(onChainData.metrics.supply_held_by_lth * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface-default rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-accent-primary to-accent-secondary h-3 rounded-full"
                      style={{ width: `${onChainData.metrics.supply_held_by_lth * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-text-secondary">Short-Term Holders (STH)</span>
                    <span className="font-mono font-semibold">{(onChainData.metrics.supply_held_by_sth * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface-default rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                      style={{ width: `${onChainData.metrics.supply_held_by_sth * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-3 glass rounded-lg text-sm">
                <p className="text-text-secondary">
                  <strong>Holder Behavior:</strong> Higher LTH ratio suggests strong conviction. 
                  STH activity often correlates with short-term volatility.
                </p>
              </div>
            </div>

            {onChainData.metrics.staking_ratio > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Staking Metrics</h3>
                <div className="space-y-4">
                  <div className="card">
                    <p className="text-text-tertiary text-sm mb-1">Staking Ratio</p>
                    <p className="text-3xl font-mono font-bold">{(onChainData.metrics.staking_ratio * 100).toFixed(1)}%</p>
                    <p className="text-sm text-semantic-success mt-1">of total supply staked</p>
                  </div>

                  <div className="card">
                    <p className="text-text-tertiary text-sm mb-1">Validator Count</p>
                    <p className="text-3xl font-mono font-bold">{formatNumber(onChainData.metrics.validator_count, 0)}</p>
                    <p className="text-sm text-text-tertiary mt-1">active validators</p>
                  </div>

                  <div className="p-3 glass rounded-lg text-sm">
                    <p className="text-text-secondary">
                      <strong>Network Security:</strong> High staking ratio reduces circulating supply and strengthens network security.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Key On-Chain Signals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 glass rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Exchange Flow</h4>
                  {onChainData.metrics.net_exchange_flow < 0 ? (
                    <TrendingUp className="h-5 w-5 text-semantic-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-semantic-error" />
                  )}
                </div>
                <p className="text-sm text-text-secondary">
                  {onChainData.metrics.net_exchange_flow < 0 
                    ? 'Bullish: More coins leaving exchanges (accumulation)'
                    : 'Bearish: More coins entering exchanges (distribution)'}
                </p>
              </div>

              <div className="p-4 glass rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Whale Activity</h4>
                  {onChainData.metrics.whale_transactions > 40 ? (
                    <Activity className="h-5 w-5 text-orange-400" />
                  ) : (
                    <Activity className="h-5 w-5 text-text-tertiary" />
                  )}
                </div>
                <p className="text-sm text-text-secondary">
                  {onChainData.metrics.whale_transactions > 40
                    ? 'High whale activity detected - increased volatility expected'
                    : 'Normal whale activity levels'}
                </p>
              </div>

              <div className="p-4 glass rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Network Health</h4>
                  <TrendingUp className="h-5 w-5 text-semantic-success" />
                </div>
                <p className="text-sm text-text-secondary">
                  Active addresses and transaction count showing healthy network activity
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 glass rounded-lg">
            <p className="text-sm text-text-secondary">
              <strong>Data Source:</strong> On-chain metrics are aggregated from blockchain explorers and node providers. 
              Data updates every 10 minutes. Some metrics may have a 1-2 block delay. 
              Use multiple indicators together for better analysis.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
