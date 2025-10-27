'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react'
import { ChartIndicator } from '@/lib/types'

interface AdvancedChartProps {
  data: { timestamp: number; price: number; volume: number }[]
  assetName: string
  showVolume?: boolean
}

// Technical Indicator Calculations
function calculateSMA(prices: number[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(period - 1).fill(null)
  
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    result.push(sum / period)
  }
  
  return result
}

function calculateEMA(prices: number[], period: number): (number | null)[] {
  const multiplier = 2 / (period + 1)
  const result: (number | null)[] = new Array(period - 1).fill(null)
  
  // Calculate first SMA as starting point
  const firstSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
  result.push(firstSMA)
  
  // Calculate EMA for remaining points
  for (let i = period; i < prices.length; i++) {
    const ema = (prices[i] - (result[i - 1] || firstSMA)) * multiplier + (result[i - 1] || firstSMA)
    result.push(ema)
  }
  
  return result
}

function calculateRSI(prices: number[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = new Array(period).fill(null)
  
  let gains = 0
  let losses = 0
  
  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) gains += change
    else losses += Math.abs(change)
  }
  
  let avgGain = gains / period
  let avgLoss = losses / period
  
  for (let i = period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? Math.abs(change) : 0
    
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))
    result.push(rsi)
  }
  
  return result
}

function calculateMACD(prices: number[]): { macd: (number | null)[], signal: (number | null)[], histogram: (number | null)[] } {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  
  const macd = ema12.map((val, i) => {
    if (val === null || ema26[i] === null) return null
    return val - ema26[i]!
  })
  
  const macdValues = macd.filter(v => v !== null) as number[]
  const signalEMA = calculateEMA(macdValues, 9)
  
  // Align signal line with MACD
  const signal = new Array(macd.length - macdValues.length).fill(null).concat(signalEMA)
  
  const histogram = macd.map((val, i) => {
    if (val === null || signal[i] === null) return null
    return val - signal[i]!
  })
  
  return { macd, signal, histogram }
}

function calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
  const sma = calculateSMA(prices, period)
  const upper: (number | null)[] = []
  const lower: (number | null)[] = []
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(null)
      lower.push(null)
      continue
    }
    
    const slice = prices.slice(i - period + 1, i + 1)
    const mean = sma[i]!
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period
    const std = Math.sqrt(variance)
    
    upper.push(mean + stdDev * std)
    lower.push(mean - stdDev * std)
  }
  
  return { upper, middle: sma, lower }
}

export default function AdvancedChart({ data, assetName, showVolume = true }: AdvancedChartProps) {
  const [activeIndicators, setActiveIndicators] = useState<Set<string>>(new Set(['price']))
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line')

  const prices = data.map(d => d.price)
  
  const indicators = useMemo(() => {
    return {
      sma20: calculateSMA(prices, 20),
      sma50: calculateSMA(prices, 50),
      ema12: calculateEMA(prices, 12),
      ema26: calculateEMA(prices, 26),
      rsi: calculateRSI(prices),
      macd: calculateMACD(prices),
      bollinger: calculateBollingerBands(prices)
    }
  }, [data])

  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      date: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: point.timestamp,
      price: point.price,
      volume: point.volume,
      sma20: indicators.sma20[index],
      sma50: indicators.sma50[index],
      ema12: indicators.ema12[index],
      ema26: indicators.ema26[index],
      rsi: indicators.rsi[index],
      macd: indicators.macd.macd[index],
      macdSignal: indicators.macd.signal[index],
      macdHistogram: indicators.macd.histogram[index],
      bollingerUpper: indicators.bollinger.upper[index],
      bollingerMiddle: indicators.bollinger.middle[index],
      bollingerLower: indicators.bollinger.lower[index]
    }))
  }, [data, indicators])

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => {
      const newSet = new Set(prev)
      if (newSet.has(indicator)) {
        newSet.delete(indicator)
      } else {
        newSet.add(indicator)
      }
      return newSet
    })
  }

  const indicatorButtons = [
    { id: 'sma20', label: 'SMA 20', color: '#F59E0B' },
    { id: 'sma50', label: 'SMA 50', color: '#EC4899' },
    { id: 'ema12', label: 'EMA 12', color: '#8B5CF6' },
    { id: 'ema26', label: 'EMA 26', color: '#06B6D4' },
    { id: 'bollinger', label: 'Bollinger', color: '#10B981' },
    { id: 'volume', label: 'Volume', color: '#6B7280' }
  ]

  const oscillatorButtons = [
    { id: 'rsi', label: 'RSI' },
    { id: 'macd', label: 'MACD' }
  ]

  return (
    <div className="space-y-4">
      {/* Indicator Controls */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <span className="text-sm text-text-secondary py-2">Overlays:</span>
          {indicatorButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => toggleIndicator(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeIndicators.has(btn.id)
                  ? 'bg-accent-primary text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 ml-4">
          <span className="text-sm text-text-secondary py-2">Oscillators:</span>
          {oscillatorButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => toggleIndicator(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeIndicators.has(btn.id)
                  ? 'bg-accent-primary text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Price Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">{assetName} Price Chart</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3142" />
            <XAxis dataKey="date" stroke="#6B7A90" />
            <YAxis stroke="#6B7A90" domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E2433', 
                border: '1px solid #3A4358', 
                borderRadius: '8px' 
              }}
              formatter={(value: any) => ['$' + value?.toFixed(2), '']}
            />
            <Legend />
            
            {/* Price Line */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#6366F1" 
              strokeWidth={2} 
              dot={false}
              name="Price"
            />

            {/* Moving Averages */}
            {activeIndicators.has('sma20') && (
              <Line 
                type="monotone" 
                dataKey="sma20" 
                stroke="#F59E0B" 
                strokeWidth={1.5} 
                dot={false}
                name="SMA 20"
              />
            )}
            {activeIndicators.has('sma50') && (
              <Line 
                type="monotone" 
                dataKey="sma50" 
                stroke="#EC4899" 
                strokeWidth={1.5} 
                dot={false}
                name="SMA 50"
              />
            )}
            {activeIndicators.has('ema12') && (
              <Line 
                type="monotone" 
                dataKey="ema12" 
                stroke="#8B5CF6" 
                strokeWidth={1.5} 
                dot={false}
                name="EMA 12"
              />
            )}
            {activeIndicators.has('ema26') && (
              <Line 
                type="monotone" 
                dataKey="ema26" 
                stroke="#06B6D4" 
                strokeWidth={1.5} 
                dot={false}
                name="EMA 26"
              />
            )}

            {/* Bollinger Bands */}
            {activeIndicators.has('bollinger') && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="bollingerUpper" 
                  stroke="#10B981" 
                  strokeWidth={1} 
                  strokeDasharray="5 5"
                  dot={false}
                  name="BB Upper"
                />
                <Line 
                  type="monotone" 
                  dataKey="bollingerMiddle" 
                  stroke="#10B981" 
                  strokeWidth={1} 
                  dot={false}
                  name="BB Middle"
                />
                <Line 
                  type="monotone" 
                  dataKey="bollingerLower" 
                  stroke="#10B981" 
                  strokeWidth={1} 
                  strokeDasharray="5 5"
                  dot={false}
                  name="BB Lower"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      {activeIndicators.has('volume') && showVolume && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Volume</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
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
              <Bar dataKey="volume" fill="#6B7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* RSI Oscillator */}
      {activeIndicators.has('rsi') && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">RSI (14)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3142" />
              <XAxis dataKey="date" stroke="#6B7A90" />
              <YAxis domain={[0, 100]} stroke="#6B7A90" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E2433', 
                  border: '1px solid #3A4358', 
                  borderRadius: '8px' 
                }}
              />
              <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="3 3" label="Overbought" />
              <ReferenceLine y={30} stroke="#10B981" strokeDasharray="3 3" label="Oversold" />
              <Line 
                type="monotone" 
                dataKey="rsi" 
                stroke="#F59E0B" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MACD Oscillator */}
      {activeIndicators.has('macd') && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">MACD (12, 26, 9)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
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
              <ReferenceLine y={0} stroke="#6B7A90" />
              <Line 
                type="monotone" 
                dataKey="macd" 
                stroke="#6366F1" 
                strokeWidth={2} 
                dot={false}
                name="MACD"
              />
              <Line 
                type="monotone" 
                dataKey="macdSignal" 
                stroke="#EC4899" 
                strokeWidth={2} 
                dot={false}
                name="Signal"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Indicator Legend */}
      <div className="glass rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <strong className="text-accent-primary">Moving Averages:</strong>
            <p className="text-text-secondary mt-1">SMA/EMA smooth out price action. Crossovers signal trend changes.</p>
          </div>
          <div>
            <strong className="text-accent-primary">Bollinger Bands:</strong>
            <p className="text-text-secondary mt-1">Price touching upper band = overbought, lower band = oversold.</p>
          </div>
          <div>
            <strong className="text-accent-primary">RSI:</strong>
            <p className="text-text-secondary mt-1">{'>'} 70 = overbought, {'<'} 30 = oversold. Divergence signals reversals.</p>
          </div>
          <div>
            <strong className="text-accent-primary">MACD:</strong>
            <p className="text-text-secondary mt-1">MACD crossing signal line = momentum shift. Histogram shows strength.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
