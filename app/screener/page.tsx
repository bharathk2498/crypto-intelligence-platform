'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react'
import { Asset } from '@/lib/types'
import { fetchTopAssets, formatPrice, formatPercentage, formatNumber } from '@/lib/api'
import Link from 'next/link'

export default function ScreenerPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'volume' | 'change'>('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minMarketCap: '',
    maxMarketCap: '',
    minVolume: '',
    maxVolume: '',
    minChange: '',
    maxChange: ''
  })

  useEffect(() => {
    async function loadAssets() {
      setLoading(true)
      const data = await fetchTopAssets(100)
      setAssets(data)
      setFilteredAssets(data)
      setLoading(false)
    }
    loadAssets()
  }, [])

  useEffect(() => {
    let filtered = [...assets]

    if (searchQuery) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filters.minPrice) {
      filtered = filtered.filter(asset => asset.current_price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(asset => asset.current_price <= parseFloat(filters.maxPrice))
    }
    if (filters.minMarketCap) {
      filtered = filtered.filter(asset => asset.market_cap >= parseFloat(filters.minMarketCap))
    }
    if (filters.maxMarketCap) {
      filtered = filtered.filter(asset => asset.market_cap <= parseFloat(filters.maxMarketCap))
    }
    if (filters.minVolume) {
      filtered = filtered.filter(asset => asset.total_volume >= parseFloat(filters.minVolume))
    }
    if (filters.maxVolume) {
      filtered = filtered.filter(asset => asset.total_volume <= parseFloat(filters.maxVolume))
    }
    if (filters.minChange) {
      filtered = filtered.filter(asset => asset.price_change_percentage_24h >= parseFloat(filters.minChange))
    }
    if (filters.maxChange) {
      filtered = filtered.filter(asset => asset.price_change_percentage_24h <= parseFloat(filters.maxChange))
    }

    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'market_cap':
          aValue = a.market_cap
          bValue = b.market_cap
          break
        case 'price':
          aValue = a.current_price
          bValue = b.current_price
          break
        case 'volume':
          aValue = a.total_volume
          bValue = b.total_volume
          break
        case 'change':
          aValue = a.price_change_percentage_24h
          bValue = b.price_change_percentage_24h
          break
        default:
          return 0
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    setFilteredAssets(filtered)
  }, [assets, searchQuery, filters, sortBy, sortOrder])

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Crypto Screener</h1>
        <p className="text-text-secondary">Filter and discover cryptocurrencies based on your criteria</p>
      </div>

      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none"
            />
          </div>
          <button className="px-4 py-3 rounded-lg glass hover:bg-white/10 transition-colors flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Max Price</label>
            <input
              type="number"
              placeholder="Unlimited"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Min 24h Change</label>
            <input
              type="number"
              placeholder="-100"
              value={filters.minChange}
              onChange={(e) => setFilters({...filters, minChange: e.target.value})}
              className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Max 24h Change</label>
            <input
              type="number"
              placeholder="100"
              value={filters.maxChange}
              onChange={(e) => setFilters({...filters, maxChange: e.target.value})}
              className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-text-secondary">
            Showing {filteredAssets.length} of {assets.length} assets
          </p>
          <button 
            onClick={() => {
              setFilters({
                minPrice: '', maxPrice: '', minMarketCap: '', maxMarketCap: '',
                minVolume: '', maxVolume: '', minChange: '', maxChange: ''
              })
              setSearchQuery('')
            }}
            className="text-sm text-accent-primary hover:text-accent-primary-hover"
          >
            Clear Filters
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg glass">
                <div className="h-10 w-10 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-16"></div>
                </div>
                <div className="h-6 bg-white/10 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Rank</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Asset</th>
                  <th 
                    className="text-right py-3 px-4 text-text-secondary font-medium cursor-pointer hover:text-text-primary"
                    onClick={() => toggleSort('price')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Price
                      {sortBy === 'price' && <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />}
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-text-secondary font-medium cursor-pointer hover:text-text-primary"
                    onClick={() => toggleSort('change')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      24h Change
                      {sortBy === 'change' && <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />}
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-text-secondary font-medium cursor-pointer hover:text-text-primary"
                    onClick={() => toggleSort('market_cap')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Market Cap
                      {sortBy === 'market_cap' && <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />}
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-text-secondary font-medium cursor-pointer hover:text-text-primary"
                    onClick={() => toggleSort('volume')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      24h Volume
                      {sortBy === 'volume' && <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset, index) => (
                  <tr key={asset.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-text-tertiary">{index + 1}</td>
                    <td className="py-4 px-4">
                      <Link href={`/asset/${asset.id}`} className="flex items-center gap-3 hover:text-accent-primary transition-colors">
                        <img src={asset.image} alt={asset.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-semibold">{asset.name}</p>
                          <p className="text-sm text-text-tertiary">{asset.symbol}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="text-right py-4 px-4 font-mono">${formatPrice(asset.current_price)}</td>
                    <td className={`text-right py-4 px-4 font-mono font-semibold ${asset.price_change_percentage_24h >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {asset.price_change_percentage_24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {formatPercentage(asset.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-mono">${formatNumber(asset.market_cap)}</td>
                    <td className="text-right py-4 px-4 font-mono">${formatNumber(asset.total_volume)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
