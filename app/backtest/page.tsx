use client

import { useState } from 'react'
import { Play, TrendingUp, Clock, DollarSign, Target, AlertTriangle, Download, Save } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface BacktestResult {
  total_return: number
  annualized_return: number
  sharpe_ratio: number
  sortino_ratio: number
  max_drawdown: number
  win_rate: number
  profit_factor: number
  num_trades: number
  avg_win: number
  avg_loss: number
  largest_win: number
  largest_loss: number
}

export default function BacktestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [config, setConfig] = useState({
    strategy_type: 'momentum',
    assets: ['bitcoin', 'ethereum'],
    start_date: '2023-01-01',
    end_date: '2024-12-31',
    initial_capital: 100000,
    position_size: 0.1,
    rebalance_frequency: 'weekly',
    transaction_cost: 0.001,
    slippage: 0.002,
    stop_loss: 0.1,
    take_profit: 0.2
  })

  const [results, setResults] = useState<BacktestResult>({
    total_return: 45.3,
    annualized_return: 22.7,
    sharpe_ratio: 1.85,
    sortino_ratio: 2.34,
    max_drawdown: -18.2,
    win_rate: 62.5,
    profit_factor: 2.4,
    num_trades: 48,
    avg_win: 4.2,
    avg_loss: -2.1,
    largest_win: 12.5,
    largest_loss: -8.3
  })

  const equityCurve = Array.from({ length: 52 }, (_, i) => ({
    week: i + 1,
    value: 100000 * (1 + (results.total_return / 100) * (i / 52)),
    benchmark: 100000 * (1 + 0.30 * (i / 52))
  }))

  const monthlyReturns = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    return: (Math.random() - 0.4) * 10
  }))

  async function runBacktest() {
    setIsRunning(true)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setHasResults(true)
    setIsRunning(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Strategy Backtesting</h1>
          <p className="text-text-secondary mt-2">Test your trading strategies with historical data</p>
        </div>
        {hasResults && (
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Results
            </button>
            <button className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="glass rounded-xl p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Strategy Type</label>
                <select
                  value={config.strategy_type}
                  onChange={(e) => setConfig({ ...config, strategy_type: e.target.value })}
                  className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                >
                  <option value="momentum">Momentum</option>
                  <option value="mean_reversion">Mean Reversion</option>
                  <option value="breakout">Breakout</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Assets</label>
                <div className="space-y-2">
                  {['bitcoin', 'ethereum', 'solana', 'cardano'].map(asset => (
                    <label key={asset} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.assets.includes(asset)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({ ...config, assets: [...config.assets, asset] })
                          } else {
                            setConfig({ ...config, assets: config.assets.filter(a => a !== asset) })
                          }
                        }}
                        className="rounded border-border-default"
                      />
                      <span className="capitalize">{asset}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Start Date</label>
                  <input
                    type="date"
                    value={config.start_date}
                    onChange={(e) => setConfig({ ...config, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">End Date</label>
                  <input
                    type="date"
                    value={config.end_date}
                    onChange={(e) => setConfig({ ...config, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Initial Capital (USD)</label>
                <input
                  type="number"
                  value={config.initial_capital}
                  onChange={(e) => setConfig({ ...config, initial_capital: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Position Size (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.position_size * 100}
                  onChange={(e) => setConfig({ ...config, position_size: parseFloat(e.target.value) / 100 })}
                  className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Rebalance Frequency</label>
                <select
                  value={config.rebalance_frequency}
                  onChange={(e) => setConfig({ ...config, rebalance_frequency: e.target.value })}
                  className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Stop Loss (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.stop_loss * 100}
                    onChange={(e) => setConfig({ ...config, stop_loss: parseFloat(e.target.value) / 100 })}
                    className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Take Profit (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.take_profit * 100}
                    onChange={(e) => setConfig({ ...config, take_profit: parseFloat(e.target.value) / 100 })}
                    className="w-full px-3 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={runBacktest}
                disabled={isRunning}
                className="w-full py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Running Backtest...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Backtest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!hasResults ? (
            <div className="glass rounded-xl p-12 text-center">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-text-tertiary" />
              <h2 className="text-2xl font-semibold mb-2">Ready to Backtest</h2>
              <p className="text-text-secondary">Configure your strategy and run the backtest to see results</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">Total Return</span>
                  </div>
                  <div className="text-2xl font-bold text-semantic-success">
                    +{results.total_return.toFixed(1)}%
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">Sharpe Ratio</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {results.sharpe_ratio.toFixed(2)}
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">Max Drawdown</span>
                  </div>
                  <div className="text-2xl font-bold text-semantic-error">
                    {results.max_drawdown.toFixed(1)}%
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">Win Rate</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {results.win_rate.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={equityCurve}>
                    <defs>
                      <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#9ca3af' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStrategy)" />
                    <Area type="monotone" dataKey="benchmark" stroke="#6b7280" fillOpacity={1} fill="url(#colorBenchmark)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Total Return</span>
                      <span className="font-mono font-semibold text-semantic-success">+{results.total_return.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Annualized Return</span>
                      <span className="font-mono font-semibold">+{results.annualized_return.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Sharpe Ratio</span>
                      <span className="font-mono">{results.sharpe_ratio.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Sortino Ratio</span>
                      <span className="font-mono">{results.sortino_ratio.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Profit Factor</span>
                      <span className="font-mono">{results.profit_factor.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Number of Trades</span>
                      <span className="font-mono">{results.num_trades}</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Trade Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Win Rate</span>
                      <span className="font-mono">{results.win_rate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Average Win</span>
                      <span className="font-mono text-semantic-success">+{results.avg_win.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Average Loss</span>
                      <span className="font-mono text-semantic-error">{results.avg_loss.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Largest Win</span>
                      <span className="font-mono text-semantic-success">+{results.largest_win.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Largest Loss</span>
                      <span className="font-mono text-semantic-error">{results.largest_loss.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Max Drawdown</span>
                      <span className="font-mono text-semantic-error">{results.max_drawdown.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}