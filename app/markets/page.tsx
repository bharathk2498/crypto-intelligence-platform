'use client'

// Markets page for Crypto Intelligence Platform.
// This page provides a comprehensive overview of the top cryptocurrencies
// by market capitalization. It fetches live data via the existing API
// utilities and displays key metrics in a responsive table. Users can
// click on an asset name to navigate to its detail page. A simple
// loading indicator is provided while data is being fetched.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { fetchTopAssets, formatPrice, formatPercentage } from '@/lib/api'
import { Asset } from '@/lib/types'

export default function MarketsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchTopAssets()
        setAssets(data)
      } finally {
        setLoading(false)
      }
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
      <h1 className="text-4xl font-bold mb-2">Market Overview</h1>
      <p className="text-text-secondary mb-8">
        Explore current prices, market caps and 24h changes for the leading cryptocurrencies.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-text-secondary uppercase text-xs">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">24h%</th>
              <th className="px-4 py-2 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => (
              <tr key={asset.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-center">{idx + 1}</td>
                <td className="px-4 py-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.image} alt={asset.name} className="w-6 h-6 rounded-full" />
                  <Link href={`/asset/${asset.id}`} className="hover:text-accent-primary font-medium">
                    {asset.name}
                  </Link>
                  <span className="text-text-tertiary text-xs uppercase">{asset.symbol}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono">${formatPrice(asset.current_price)}</td>
                <td className="px-4 py-3 text-right font-mono">
                  <span
                    className={`flex items-center justify-end gap-1 ${
                      asset.price_change_percentage_24h >= 0 ? 'text-semantic-success' : 'text-semantic-error'
                    }`}
                  >
                    {asset.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {formatPercentage(asset.price_change_percentage_24h)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">${(asset.market_cap / 1e9).toFixed(2)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="mt-12 text-center text-sm text-text-tertiary">
        © 2025 CryptoIntel. All rights reserved.
      </footer>
    </div>
  )
}
