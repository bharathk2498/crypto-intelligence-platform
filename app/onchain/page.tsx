use client

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Users, Layers, Database } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { fetchOnChainMetrics } from '@/lib/api'

export default function OnChainPage() {
  const [selectedAsset, setSelectedAsset] = useState('bitcoin')
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOnChainData()
  }, [selectedAsset])

  async function loadOnChainData() {
    setLoading(true)
    const data = await fetchOnChainMetrics(selectedAsset)
    setMetrics(data)
    setLoading(false)
  }

  const whaleTransactions = [
    {
      time: '2 hours ago',
      amount: 1250.5,
      type: 'transfer',
      from: '0x742d...3f91',
      to: '0x8a3c...2e5b',
      value: 54250000
    },
    {
      time: '4 hours ago',
      amount: 850.2,
      type: 'exchange_deposit',
      from: '0x1f3a...9c2d',
      to: 'Binance Hot Wallet',
      value: 36840000
    },
    {
      time: '6 hours ago',
      amount: 2100.8,
      type: 'exchange_withdrawal',
      from: 'Coinbase',
      to: '0x4e7b...1a9f',
      value: 91035000
    },
    {
      time: '8 hours ago',
      amount: 675.3,
      type: 'transfer',
      from: '0x9d2c...6e4a',
      to: '0x3b8f...7d1c',
      value: 29257500
    }
  ]

  const exchangeFlowData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    inflow: Math.random() * 15000 + 5000,
    outflow: Math.random() * 15000 + 5000
  }))

  const activeAddressData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    count: Math.floor(Math.random() * 200000 + 750000)
  }))

  const supplyDistribution = [
    { range: '0-0.01 BTC', holders: 23450000, supply: 2.3 },
    { range: '0.01-0.1 BTC', holders: 8950000, supply: 4.1 },
    { range: '0.1-1 BTC', holders: 3200000, supply: 8.7 },
    { range: '1-10 BTC', holders: 850000, supply: 15.2 },
    { range: '10-100 BTC', holders: 145000, supply: 22.8 },
    { range: '100-1000 BTC', holders: 18000, supply: 28.5 },
    { range: '1000+ BTC', holders: 2100, supply: 18.4 }
  ]

  if (loading || !metrics) {
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
          <h1 className="text-4xl font-bold">On-Chain Analytics</h1>
          <p className="text-text-secondary mt-2">Real-time blockchain intelligence and whale tracking</p>
        </div>
        <div className="flex items-center gap-3">
          {['bitcoin', 'ethereum', 'solana'].map(asset => (
            <button
              key={asset}
              onClick={() => setSelectedAsset(asset)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                selectedAsset === asset
                  ? 'bg-accent-primary text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {asset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Active Addresses</span>
            <Activity className="h-4 w-4 text-text-tertiary" />
          </div>
          <div className="text-2xl font-bold font-mono">
            {metrics.active_addresses.toLocaleString()}
          </div>
          <div className="text-sm text-semantic-success mt-1">+5.2% from yesterday</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Transactions (24h)</span>
            <Database className="h-4 w-4 text-text-tertiary" />
          </div>
          <div className="text-2xl font-bold font-mono">
            {metrics.transaction_count.toLocaleString()}
          </div>
          <div className="text-sm text-semantic-error mt-1">-2.1% from yesterday</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Net Exchange Flow</span>
            {metrics.net_exchange_flow >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-semantic-error" />
            ) : (
              <ArrowDownLeft className="h-4 w-4 text-semantic-success" />
            )}
          </div>
          <div className={`text-2xl font-bold font-mono ${
            metrics.net_exchange_flow >= 0 ? 'text-semantic-error' : 'text-semantic-success'
          }`}>
            {metrics.net_exchange_flow >= 0 ? '+' : ''}{metrics.net_exchange_flow.toLocaleString()}
          </div>
          <div className="text-sm text-text-tertiary mt-1">
            {metrics.net_exchange_flow >= 0 ? 'Inflow (Bearish)' : 'Outflow (Bullish)'}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Whale Transactions</span>
            <Users className="h-4 w-4 text-text-tertiary" />
          </div>
          <div className="text-2xl font-bold font-mono">
            {metrics.whale_transactions}
          </div>
          <div className="text-sm text-semantic-success mt-1">+12.5% from yesterday</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Active Addresses (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activeAddressData}>
              <defs>
                <linearGradient id="colorAddresses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAddresses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Supply Distribution</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Long-term Holders</span>
              <span className="font-mono font-semibold">{(metrics.supply_held_by_lth * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-semantic-success"
                style={{ width: `${metrics.supply_held_by_lth * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-text-secondary text-sm">Short-term Holders</span>
              <span className="font-mono font-semibold">{(metrics.supply_held_by_sth * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-semantic-error"
                style={{ width: `${metrics.supply_held_by_sth * 100}%` }}
              />
            </div>

            {selectedAsset === 'ethereum' && (
              <>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-text-secondary text-sm">Staking Ratio</span>
                  <span className="font-mono font-semibold">{(metrics.staking_ratio * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-primary"
                    style={{ width: `${metrics.staking_ratio * 100}%` }}
                  />
                </div>

                <div className="pt-3 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Validators</span>
                    <span className="font-mono font-semibold">{metrics.validator_count.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Exchange Flows (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exchangeFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar dataKey="inflow" fill="#ef4444" name="Inflow" />
              <Bar dataKey="outflow" fill="#10b981" name="Outflow" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Whale Transactions</h2>
          <div className="space-y-3">
            {whaleTransactions.map((tx, index) => (
              <div key={index} className="p-4 rounded-lg glass hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {tx.type === 'exchange_deposit' ? (
                      <ArrowUpRight className="h-4 w-4 text-semantic-error" />
                    ) : tx.type === 'exchange_withdrawal' ? (
                      <ArrowDownLeft className="h-4 w-4 text-semantic-success" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-text-tertiary" />
                    )}
                    <span className="text-sm text-text-tertiary capitalize">
                      {tx.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm text-text-tertiary">{tx.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-text-secondary">From:</span>
                    <span className="font-mono ml-2">{tx.from}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-text-secondary">To:</span>
                    <span className="font-mono ml-2">{tx.to}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle">
                  <span className="font-mono font-semibold">{tx.amount.toFixed(2)} BTC</span>
                  <span className="text-text-secondary">${tx.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Address Distribution by Balance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border-subtle">
              <tr>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Balance Range</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Addresses</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Supply %</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {supplyDistribution.map((dist, index) => (
                <tr key={index} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-mono">{dist.range}</td>
                  <td className="text-right py-4 px-4 font-mono">{dist.holders.toLocaleString()}</td>
                  <td className="text-right py-4 px-4 font-mono font-semibold">{dist.supply.toFixed(1)}%</td>
                  <td className="py-4 px-4">
                    <div className="h-2 bg-background-secondary rounded-full overflow-hidden max-w-xs">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                        style={{ width: `${(dist.supply / 30) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}