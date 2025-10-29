'use client'

// On-chain analytics page for Crypto Intelligence Platform.
// This page aggregates key blockchain metrics for a handful of popular
// cryptocurrencies. It fetches mock on-chain data using the API helper
// and displays metrics like active addresses, transaction counts, net
// exchange flow, whale transactions and supply distribution. Feel free
// to extend the asset list or tailor the visuals to fit your needs.

import { useState, useEffect } from 'react'
import { fetchOnChainMetrics } from '@/lib/api'
import { OnChainMetrics } from '@/lib/types'

const ASSETS = ['bitcoin', 'ethereum', 'solana', 'cardano']

export default function OnChainPage() {
  const [data, setData] = useState<Record<string, OnChainMetrics | null>>({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      setLoading(true)
      const result: Record<string, OnChainMetrics | null> = {}
      await Promise.all(
        ASSETS.map(async (asset) => {
          try {
            const metrics = await fetchOnChainMetrics(asset)
            result[asset] = metrics
          } catch {
            result[asset] = null
          }
        }),
      )
      setData(result)
      setLoading(false)
    }
    load()
  }, [])
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
      <h1 className="text-4xl font-bold mb-2">On‑Chain Analytics</h1>
      <p className="text-text-secondary mb-8">
        Inspect core blockchain metrics to gauge network health and investor behaviour for top assets.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ASSETS.map((asset) => {
          const metrics = data[asset]
          const name = asset.charAt(0).toUpperCase() + asset.slice(1)
          if (!metrics) {
            return (
              <div key={asset} className="glass rounded-xl p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">{name}</h2>
                <p className="text-text-tertiary">Failed to load on‑chain metrics.</p>
              </div>
            )
          }
          return (
            <div key={asset} className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{name}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-secondary">
                  <div>
                    <div className="text-text-secondary text-sm mb-1">Active Addresses</div>
                    <div className="text-xs text-text-tertiary">Daily active users</div>
                  </div>
                  <div className="text-xl font-bold font-mono">{(metrics.active_addresses / 1e3).toFixed(0)}K</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-secondary">
                  <div>
                    <div className="text-text-secondary text-sm mb-1">Transaction Count</div>
                    <div className="text-xs text-text-tertiary">Daily transactions</div>
                  </div>
                  <div className="text-xl font-bold font-mono">{(metrics.transaction_count / 1e3).toFixed(0)}K</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-secondary">
                  <div>
                    <div className="text-text-secondary text-sm mb-1">Net Exchange Flow</div>
                    <div className="text-xs text-text-tertiary">
                      {metrics.net_exchange_flow < 0 ? 'Bullish signal' : 'Bearish signal'}
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold font-mono ${
                      metrics.net_exchange_flow < 0 ? 'text-semantic-success' : 'text-semantic-error'
                    }`}
                  >
                    {metrics.net_exchange_flow >= 0 ? '+' : ''}
                    {metrics.net_exchange_flow}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-secondary">
                  <div>
                    <div className="text-text-secondary text-sm mb-1">Whale Transactions</div>
                    <div className="text-xs text-text-tertiary">Large transfers (24h)</div>
                  </div>
                  <div className="text-xl font-bold font-mono">{metrics.whale_transactions}</div>
                </div>
                <div className="p-3 rounded-lg bg-background-secondary">
                  <div className="text-text-secondary text-sm mb-2">Supply Distribution</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Long‑term Holders</span>
                        <span className="font-mono">{(metrics.supply_held_by_lth * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-background-primary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-semantic-success"
                          style={{ width: `${metrics.supply_held_by_lth * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Short‑term Holders</span>
                        <span className="font-mono">{(metrics.supply_held_by_sth * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-background-primary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-semantic-error"
                          style={{ width: `${metrics.supply_held_by_sth * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <footer className="mt-12 text-center text-sm text-text-tertiary">
        © 2025 CryptoIntel. All rights reserved.
      </footer>
    </div>
  )
}