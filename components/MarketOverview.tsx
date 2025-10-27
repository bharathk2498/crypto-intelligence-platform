'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  sparkline: number[]
}

export default function MarketOverview() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockData: CoinData[] = [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        current_price: 43250.50,
        price_change_percentage_24h: 2.34,
        market_cap: 845000000000,
        total_volume: 28000000000,
        sparkline: [42000, 42500, 42800, 43000, 43200, 43250]
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 2280.75,
        price_change_percentage_24h: -1.23,
        market_cap: 274000000000,
        total_volume: 15000000000,
        sparkline: [2300, 2290, 2285, 2275, 2280, 2280]
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        current_price: 98.45,
        price_change_percentage_24h: 5.67,
        market_cap: 42000000000,
        total_volume: 2500000000,
        sparkline: [93, 94, 96, 97, 98, 98.5]
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        current_price: 0.58,
        price_change_percentage_24h: -0.89,
        market_cap: 20000000000,
        total_volume: 450000000,
        sparkline: [0.59, 0.585, 0.583, 0.580, 0.58, 0.58]
      },
    ]
    
    setTimeout(() => {
      setCoins(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return (cap / 1e12).toFixed(2) + 'T'
    if (cap >= 1e9) return (cap / 1e9).toFixed(2) + 'B'
    if (cap >= 1e6) return (cap / 1e6).toFixed(2) + 'M'
    return cap.toString()
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Live Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-16 mb-2"></div>
              <div className="h-8 bg-white/10 rounded w-32 mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Live Market Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coins.map(coin => (
          <div key={coin.id} className="card group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-text-secondary text-sm">{coin.symbol}</p>
                <p className="text-text-tertiary text-xs">{coin.name}</p>
              </div>
              {coin.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="h-5 w-5 text-semantic-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-semantic-error" />
              )}
            </div>
            
            <div className="mb-3">
              <p className="text-2xl font-mono font-semibold">
                ${formatPrice(coin.current_price)}
              </p>
              <p className={`text-sm font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
            
            <div className="flex justify-between text-xs text-text-tertiary">
              <span>MCap: ${formatMarketCap(coin.market_cap)}</span>
              <span>Vol: ${formatMarketCap(coin.total_volume)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
