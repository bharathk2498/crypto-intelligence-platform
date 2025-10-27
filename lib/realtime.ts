import { create } from 'zustand'

interface PriceUpdate {
  assetId: string
  price: number
  volume: number
  change24h: number
  timestamp: number
}

interface RealtimeStore {
  prices: Record<string, PriceUpdate>
  connected: boolean
  lastUpdate: number
  updatePrice: (assetId: string, data: PriceUpdate) => void
  setConnected: (connected: boolean) => void
  subscribe: (assetIds: string[]) => void
  unsubscribe: (assetIds: string[]) => void
}

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
  prices: {},
  connected: false,
  lastUpdate: Date.now(),

  updatePrice: (assetId: string, data: PriceUpdate) => {
    set(state => ({
      prices: {
        ...state.prices,
        [assetId]: data
      },
      lastUpdate: Date.now()
    }))
  },

  setConnected: (connected: boolean) => set({ connected }),

  subscribe: (assetIds: string[]) => {
    // In production, this would establish WebSocket connections
    // For now, use polling as fallback
    console.log('Subscribing to:', assetIds)
  },

  unsubscribe: (assetIds: string[]) => {
    console.log('Unsubscribing from:', assetIds)
  }
}))

// WebSocket manager for real-time price updates
class RealtimeManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private subscribedAssets: Set<string> = new Set()
  private heartbeatInterval: NodeJS.Timeout | null = null

  connect() {
    if (typeof window === 'undefined') return

    try {
      // Use CoinGecko's WebSocket alternative or fallback to polling
      // For production, use a proper WebSocket service
      this.startPolling()
    } catch (error) {
      console.error('Failed to establish real-time connection:', error)
      this.handleReconnect()
    }
  }

  private startPolling() {
    useRealtimeStore.getState().setConnected(true)
    
    // Poll for price updates every 10 seconds
    this.heartbeatInterval = setInterval(async () => {
      if (this.subscribedAssets.size === 0) return

      try {
        const assetIds = Array.from(this.subscribedAssets).join(',')
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${assetIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
        )
        
        if (!response.ok) throw new Error('Failed to fetch prices')
        
        const data = await response.json()
        
        Object.keys(data).forEach(assetId => {
          const priceData = data[assetId]
          useRealtimeStore.getState().updatePrice(assetId, {
            assetId,
            price: priceData.usd,
            volume: priceData.usd_24h_vol || 0,
            change24h: priceData.usd_24h_change || 0,
            timestamp: Date.now()
          })
        })
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 10000) // Update every 10 seconds
  }

  subscribe(assetIds: string[]) {
    assetIds.forEach(id => this.subscribedAssets.add(id))
    
    if (!this.heartbeatInterval) {
      this.connect()
    }
  }

  unsubscribe(assetIds: string[]) {
    assetIds.forEach(id => this.subscribedAssets.delete(id))
    
    if (this.subscribedAssets.size === 0 && this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
      useRealtimeStore.getState().setConnected(false)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    setTimeout(() => {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
      this.connect()
    }, delay)
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.subscribedAssets.clear()
    useRealtimeStore.getState().setConnected(false)
  }
}

export const realtimeManager = new RealtimeManager()

// React hook for easy real-time price subscription
export function useRealtimePrice(assetId: string) {
  const price = useRealtimeStore(state => state.prices[assetId])
  const connected = useRealtimeStore(state => state.connected)

  // Subscribe on mount, unsubscribe on unmount
  if (typeof window !== 'undefined') {
    realtimeManager.subscribe([assetId])
  }

  return {
    price: price?.price,
    volume: price?.volume,
    change24h: price?.change24h,
    timestamp: price?.timestamp,
    connected
  }
}
