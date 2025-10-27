import { Asset, PriceData, OnChainMetrics } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.coingecko.com/api/v3'

export async function fetchTopAssets(limit: number = 100): Promise<Asset[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    )
    
    if (!response.ok) throw new Error('Failed to fetch assets')
    
    const data = await response.json()
    
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      circulating_supply: coin.circulating_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      ath_date: coin.ath_date,
      atl: coin.atl,
      atl_date: coin.atl_date,
      image: coin.image
    }))
  } catch (error) {
    console.error('Error fetching top assets:', error)
    return []
  }
}

export async function fetchAssetById(id: string): Promise<Asset | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/coins/${id}`)
    
    if (!response.ok) throw new Error('Failed to fetch asset')
    
    const coin = await response.json()
    
    return {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.market_data.current_price.usd,
      price_change_24h: coin.market_data.price_change_24h,
      price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
      market_cap: coin.market_data.market_cap.usd,
      total_volume: coin.market_data.total_volume.usd,
      circulating_supply: coin.market_data.circulating_supply,
      max_supply: coin.market_data.max_supply,
      ath: coin.market_data.ath.usd,
      ath_date: coin.market_data.ath_date.usd,
      atl: coin.market_data.atl.usd,
      atl_date: coin.market_data.atl_date.usd,
      image: coin.image.large
    }
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error)
    return null
  }
}

export async function fetchHistoricalPrices(
  id: string, 
  days: number = 365
): Promise<PriceData[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    )
    
    if (!response.ok) throw new Error('Failed to fetch historical prices')
    
    const data = await response.json()
    
    return data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1],
      volume: 0
    }))
  } catch (error) {
    console.error(`Error fetching historical prices for ${id}:`, error)
    return []
  }
}

export async function searchAssets(query: string): Promise<Asset[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`)
    
    if (!response.ok) throw new Error('Failed to search assets')
    
    const data = await response.json()
    
    const coinIds = data.coins.slice(0, 10).map((coin: any) => coin.id).join(',')
    
    if (!coinIds) return []
    
    const detailsResponse = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}`
    )
    
    if (!detailsResponse.ok) return []
    
    const coins = await detailsResponse.json()
    
    return coins.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      circulating_supply: coin.circulating_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      ath_date: coin.ath_date,
      atl: coin.atl,
      atl_date: coin.atl_date,
      image: coin.image
    }))
  } catch (error) {
    console.error('Error searching assets:', error)
    return []
  }
}

export async function fetchOnChainMetrics(id: string): Promise<OnChainMetrics | null> {
  try {
    const mockData: Record<string, OnChainMetrics> = {
      bitcoin: {
        active_addresses: 950000,
        transaction_count: 320000,
        exchange_inflow: 12500,
        exchange_outflow: 11800,
        net_exchange_flow: -700,
        whale_transactions: 45,
        supply_held_by_lth: 0.67,
        supply_held_by_sth: 0.33,
        staking_ratio: 0,
        validator_count: 0
      },
      ethereum: {
        active_addresses: 520000,
        transaction_count: 1200000,
        exchange_inflow: 8500,
        exchange_outflow: 9200,
        net_exchange_flow: 700,
        whale_transactions: 32,
        supply_held_by_lth: 0.58,
        supply_held_by_sth: 0.42,
        staking_ratio: 0.23,
        validator_count: 825000
      }
    }
    
    return mockData[id] || null
  } catch (error) {
    console.error(`Error fetching on-chain metrics for ${id}:`, error)
    return null
  }
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1e12) return (num / 1e12).toFixed(decimals) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K'
  return num.toFixed(decimals)
}

export function formatPrice(price: number): string {
  if (price < 1) return price.toFixed(6)
  if (price < 100) return price.toFixed(2)
  return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatPercentage(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : ''
  return sign + value.toFixed(decimals) + '%'
}
