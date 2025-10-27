import { RiskMetrics, RiskCalculationParams } from './types'

export function calculateReturns(prices: number[], type: 'simple' | 'log' = 'log'): number[] {
  if (prices.length < 2) return []
  
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    if (type === 'log') {
      returns.push(Math.log(prices[i] / prices[i - 1]))
    } else {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
    }
  }
  return returns
}

export function calculateVolatility(returns: number[], annualizationFactor: number = 252): number {
  if (returns.length === 0) return 0
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  const volatility = Math.sqrt(variance) * Math.sqrt(annualizationFactor)
  
  return volatility
}

export function calculateSharpeRatio(
  returns: number[], 
  riskFreeRate: number = 0, 
  annualizationFactor: number = 252
): number {
  if (returns.length === 0) return 0
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const annualizedReturn = mean * annualizationFactor
  const volatility = calculateVolatility(returns, annualizationFactor)
  
  if (volatility === 0) return 0
  
  return (annualizedReturn - riskFreeRate) / volatility
}

export function calculateSortinoRatio(
  returns: number[], 
  riskFreeRate: number = 0, 
  annualizationFactor: number = 252
): number {
  if (returns.length === 0) return 0
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const annualizedReturn = mean * annualizationFactor
  
  const negativeReturns = returns.filter(r => r < 0)
  if (negativeReturns.length === 0) return Infinity
  
  const downsideVariance = negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length
  const downsideDeviation = Math.sqrt(downsideVariance) * Math.sqrt(annualizationFactor)
  
  if (downsideDeviation === 0) return 0
  
  return (annualizedReturn - riskFreeRate) / downsideDeviation
}

export function calculateMaxDrawdown(prices: number[]): { maxDrawdown: number; peak: number; trough: number; duration: number } {
  if (prices.length === 0) return { maxDrawdown: 0, peak: 0, trough: 0, duration: 0 }
  
  let maxDrawdown = 0
  let peakIndex = 0
  let troughIndex = 0
  let currentPeak = prices[0]
  let currentPeakIndex = 0
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > currentPeak) {
      currentPeak = prices[i]
      currentPeakIndex = i
    }
    
    const drawdown = (currentPeak - prices[i]) / currentPeak
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
      peakIndex = currentPeakIndex
      troughIndex = i
    }
  }
  
  return {
    maxDrawdown,
    peak: peakIndex,
    trough: troughIndex,
    duration: troughIndex - peakIndex
  }
}

export function calculateCalmarRatio(
  returns: number[], 
  prices: number[], 
  annualizationFactor: number = 252
): number {
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const annualizedReturn = mean * annualizationFactor
  
  const { maxDrawdown } = calculateMaxDrawdown(prices)
  
  if (maxDrawdown === 0) return 0
  
  return annualizedReturn / maxDrawdown
}

export function calculateAlphaBeta(
  assetReturns: number[], 
  benchmarkReturns: number[], 
  riskFreeRate: number = 0
): { alpha: number; beta: number; rSquared: number } {
  if (assetReturns.length !== benchmarkReturns.length || assetReturns.length === 0) {
    return { alpha: 0, beta: 0, rSquared: 0 }
  }
  
  const assetExcessReturns = assetReturns.map(r => r - riskFreeRate / 252)
  const benchmarkExcessReturns = benchmarkReturns.map(r => r - riskFreeRate / 252)
  
  const benchmarkMean = benchmarkExcessReturns.reduce((sum, r) => sum + r, 0) / benchmarkExcessReturns.length
  const assetMean = assetExcessReturns.reduce((sum, r) => sum + r, 0) / assetExcessReturns.length
  
  let covariance = 0
  let benchmarkVariance = 0
  
  for (let i = 0; i < assetReturns.length; i++) {
    const assetDiff = assetExcessReturns[i] - assetMean
    const benchmarkDiff = benchmarkExcessReturns[i] - benchmarkMean
    covariance += assetDiff * benchmarkDiff
    benchmarkVariance += benchmarkDiff * benchmarkDiff
  }
  
  covariance /= assetReturns.length
  benchmarkVariance /= benchmarkReturns.length
  
  if (benchmarkVariance === 0) return { alpha: 0, beta: 0, rSquared: 0 }
  
  const beta = covariance / benchmarkVariance
  const alpha = (assetMean - beta * benchmarkMean) * 252
  
  const predicted = assetExcessReturns.map((_, i) => beta * benchmarkExcessReturns[i])
  const totalSS = assetExcessReturns.reduce((sum, r) => sum + Math.pow(r - assetMean, 2), 0)
  const residualSS = assetExcessReturns.reduce((sum, r, i) => sum + Math.pow(r - predicted[i], 2), 0)
  
  const rSquared = totalSS === 0 ? 0 : 1 - (residualSS / totalSS)
  
  return { alpha, beta, rSquared }
}

export function calculateSkewness(returns: number[]): number {
  if (returns.length === 0) return 0
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  
  if (stdDev === 0) return 0
  
  const skewness = returns.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 3), 0) / returns.length
  
  return skewness
}

export function calculateKurtosis(returns: number[]): number {
  if (returns.length === 0) return 0
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  
  if (stdDev === 0) return 0
  
  const kurtosis = returns.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 4), 0) / returns.length
  
  return kurtosis - 3
}

export function calculateVaR(
  returns: number[], 
  confidenceLevel: number = 0.95, 
  method: 'historical' | 'parametric' = 'historical'
): number {
  if (returns.length === 0) return 0
  
  if (method === 'historical') {
    const sorted = [...returns].sort((a, b) => a - b)
    const index = Math.floor((1 - confidenceLevel) * sorted.length)
    return -sorted[index]
  } else {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
    )
    
    const zScore = confidenceLevel === 0.95 ? 1.645 : 2.326
    return -(mean - zScore * stdDev)
  }
}

export function calculateES(
  returns: number[], 
  confidenceLevel: number = 0.95
): number {
  if (returns.length === 0) return 0
  
  const var95 = calculateVaR(returns, confidenceLevel, 'historical')
  const sorted = [...returns].sort((a, b) => a - b)
  const cutoff = -var95
  
  const tailReturns = sorted.filter(r => r <= cutoff)
  if (tailReturns.length === 0) return var95
  
  const es = -tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length
  
  return es
}

export function calculateRiskMetrics(params: RiskCalculationParams): RiskMetrics {
  const { returns, benchmark_returns, risk_free_rate = 0, window_size = 252 } = params
  
  const volatility = calculateVolatility(returns, window_size)
  const sharpe_ratio = calculateSharpeRatio(returns, risk_free_rate, window_size)
  const sortino_ratio = calculateSortinoRatio(returns, risk_free_rate, window_size)
  
  const prices = returns.reduce((acc, r, i) => {
    acc.push(i === 0 ? 100 : acc[i - 1] * (1 + r))
    return acc
  }, [100])
  
  const { maxDrawdown } = calculateMaxDrawdown(prices)
  const calmar_ratio = calculateCalmarRatio(returns, prices, window_size)
  
  let alpha = 0
  let beta = 0
  let r_squared = 0
  
  if (benchmark_returns && benchmark_returns.length === returns.length) {
    const result = calculateAlphaBeta(returns, benchmark_returns, risk_free_rate)
    alpha = result.alpha
    beta = result.beta
    r_squared = result.rSquared
  }
  
  const skewness = calculateSkewness(returns)
  const kurtosis = calculateKurtosis(returns)
  
  return {
    volatility,
    sharpe_ratio,
    sortino_ratio,
    max_drawdown: maxDrawdown,
    calmar_ratio,
    alpha,
    beta,
    r_squared,
    skewness,
    kurtosis
  }
}

export function rollingWindow<T>(
  data: T[], 
  windowSize: number, 
  fn: (window: T[]) => number
): number[] {
  const result: number[] = []
  
  for (let i = windowSize - 1; i < data.length; i++) {
    const window = data.slice(i - windowSize + 1, i + 1)
    result.push(fn(window))
  }
  
  return result
}
