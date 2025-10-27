/**
 * API Cache and Rate Limiter
 * Optimizes external API calls with intelligent caching and rate limiting
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  private requestCounts = new Map<string, { count: number; resetTime: number }>()
  private readonly DEFAULT_TTL = 60000 // 1 minute
  private readonly RATE_LIMIT_WINDOW = 60000 // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 50

  /**
   * Get cached data or execute fetch function
   */
  async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`[Cache HIT] ${key}`)
      return cached.data
    }

    // Check rate limit
    if (!this.checkRateLimit(key)) {
      console.warn(`[Rate Limit] ${key} - Using stale cache if available`)
      if (cached) return cached.data
      throw new Error('Rate limit exceeded and no cached data available')
    }

    // Fetch fresh data
    console.log(`[Cache MISS] ${key}`)
    try {
      const data = await fetchFn()
      this.set(key, data, ttl)
      this.incrementRequestCount(key)
      return data
    } catch (error) {
      // If fetch fails and we have stale cache, use it
      if (cached) {
        console.warn(`[Fetch Failed] Using stale cache for ${key}`)
        return cached.data
      }
      throw error
    }
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Check if request is within rate limit
   */
  private checkRateLimit(key: string): boolean {
    const now = Date.now()
    const limiter = this.requestCounts.get(key)

    if (!limiter || now > limiter.resetTime) {
      // Reset window
      this.requestCounts.set(key, {
        count: 0,
        resetTime: now + this.RATE_LIMIT_WINDOW
      })
      return true
    }

    return limiter.count < this.MAX_REQUESTS_PER_WINDOW
  }

  /**
   * Increment request count
   */
  private incrementRequestCount(key: string): void {
    const limiter = this.requestCounts.get(key)
    if (limiter) {
      limiter.count++
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    entries: { key: string; age: number; ttl: number }[]
  } {
    const now = Date.now()
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      ttl: entry.ttl
    }))

    return {
      size: this.cache.size,
      entries
    }
  }

  /**
   * Clean expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const apiCache = new APICache()

// Run cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => apiCache.cleanup(), 300000)
}

/**
 * Cache TTL configurations for different endpoints
 */
export const CACHE_TTL = {
  ASSET_DETAILS: 300000,      // 5 minutes
  MARKET_DATA: 60000,          // 1 minute
  HISTORICAL_PRICES: 3600000,  // 1 hour
  ON_CHAIN: 600000,            // 10 minutes
  SEARCH: 300000,              // 5 minutes
  TOP_ASSETS: 120000           // 2 minutes
}

/**
 * Batch request handler to optimize multiple API calls
 */
class BatchRequestHandler {
  private pendingRequests = new Map<string, Promise<any>>()
  private batchQueue: Array<{
    key: string
    resolve: (value: any) => void
    reject: (error: any) => void
  }> = []
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly BATCH_DELAY = 100 // ms

  /**
   * Add request to batch queue
   */
  async request<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    // Check if request is already pending
    const pending = this.pendingRequests.get(key)
    if (pending) {
      console.log(`[Batch] Deduplicating request for ${key}`)
      return pending
    }

    // Create new promise for this request
    const promise = new Promise<T>((resolve, reject) => {
      this.batchQueue.push({ key, resolve, reject })

      // Schedule batch execution
      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => this.executeBatch(), this.BATCH_DELAY)
      }
    })

    this.pendingRequests.set(key, promise)
    return promise
  }

  /**
   * Execute batched requests
   */
  private async executeBatch(): Promise<void> {
    const batch = [...this.batchQueue]
    this.batchQueue = []
    this.batchTimeout = null

    console.log(`[Batch] Executing ${batch.length} requests`)

    // Group by endpoint type for optimal batching
    const grouped = batch.reduce((acc, req) => {
      const endpoint = req.key.split(':')[0]
      if (!acc[endpoint]) acc[endpoint] = []
      acc[endpoint].push(req)
      return acc
    }, {} as Record<string, typeof batch>)

    // Execute grouped requests
    for (const [endpoint, requests] of Object.entries(grouped)) {
      // Here you would implement endpoint-specific batch logic
      // For now, execute individually
      for (const req of requests) {
        try {
          // Actual fetch would happen here
          // This is a placeholder - actual implementation would extract fetchFn
          req.resolve(null)
        } catch (error) {
          req.reject(error)
        } finally {
          this.pendingRequests.delete(req.key)
        }
      }
    }
  }
}

export const batchHandler = new BatchRequestHandler()

/**
 * Retry logic for failed requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  backoff: number = 2
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error

    console.log(`[Retry] Retrying request, ${retries} attempts remaining`)
    await new Promise(resolve => setTimeout(resolve, delay))
    
    return retryRequest(fn, retries - 1, delay * backoff, backoff)
  }
}

/**
 * Request deduplication to prevent duplicate simultaneous requests
 */
class RequestDeduplicator {
  private inFlight = new Map<string, Promise<any>>()

  async dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key)
    if (existing) {
      console.log(`[Dedupe] Reusing in-flight request for ${key}`)
      return existing
    }

    const promise = fn().finally(() => {
      this.inFlight.delete(key)
    })

    this.inFlight.set(key, promise)
    return promise
  }
}

export const deduplicator = new RequestDeduplicator()
