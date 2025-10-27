'use client'

import { useState } from 'react'
import { Play, BarChart3, Settings, TrendingUp, TrendingDown, Info } from 'lucide-react'
import { BacktestConfig, BacktestResult } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from 'recharts'

export default function BacktestPage() {
  const [config, setConfig] = useState<BacktestConfig>({
    strategy_type: 'momentum',
    assets: ['bitcoin'],
    start_date: '2024-01-01',
    end_date: '2024-10-27',
    initial_capital: 10000,
    position_size: 1,
    rebalance_frequency: 'monthly',
    transaction_cost: 0.001,
    slippage: 0.001,
    stop_loss: undefined,
    take_profit: undefined
  })

  const [result, setResult] = useState<BacktestResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runBacktest = async () => {
    setIsRunning(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResult: BacktestResult = {
      total_return: 45.2,
      annualized_return: 52.3,
      sharpe_ratio: 1.85,
      max_drawdown: 18.5,
      win_rate: 58.3,
      profit_factor: 1.92,
      num_trades: 24,
      equity_curve: [
        { date: '2024-01', value: 10000 },
        { date: '2024-02', value: 10500 },
        { date: '2024-03', value: 11200 },
        { date: '2024-04', value: 10800 },
        { date: '2024-05', value: 11500 },
        { date: '2024-06', value: 12300 },
        { date: '2024-07', value: 12100 },
        { date: '2024-08', value: 13000 },
        { date: '2024-09', value: 13800 },
        { date: '2024-10', value: 14520 }
      ],
      trades: [
        { date: '2024-01-15', asset: 'BTC', action: 'buy', price: 42000, quantity: 0.238, value: 10000 },
        { date: '2024-02-10', asset: 'BTC', action: 'sell', price: 44500, quantity: 0.238, value: 10591, pnl: 591 },
        { date: '2024-02-12', asset: 'BTC', action: 'buy', price: 44200, quantity: 0.240, value: 10591 }
      ]
    }
    
    setResult(mockResult)
    setIsRunning(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Strategy Backtester</h1>
        <p className="text-text-secondary">Test your trading strategies with historical data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Strategy Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Strategy Type</label>
                <select
                  value={config.strategy_type}
                  onChange={(e) => setConfig({...config, strategy_type: e.target.value as any})}
                  className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none"
                >
                  <option value="momentum">Momentum</option>
                  <option value="mean_reversion">Mean Reversion</option>
                  <option value="breakout">Breakout</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Assets</label>
                <select
                  value={config.assets[0]}
                  onChange={(e) => setConfig({...config, assets: [e.target.value]})}
                  className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none"
                >
                  <option value="bitcoin">Bitcoin</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="solana">Solana</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={config.start_date}
                    onChange={(e) => setConfig({...config, start_date: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={config.end_date}
                    onChange={(e) => setConfig({...config, end_date: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Initial Capital</label>
                <input
                  type="number"
                  value={config.initial_capital}
                  onChange={(e) => setConfig({...config, initial_capital: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Rebalance Frequency</label>
                <select
                  value={config.rebalance_frequency}
                  onChange={(e) => setConfig({...config, rebalance_frequency: e.target.value as any})}
                  className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">Transaction Cost</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={config.transaction_cost}
                    onChange={(e) => setConfig({...config, transaction_cost: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">Slippage</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={config.slippage}
                    onChange={(e) => setConfig({...config, slippage: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={runBacktest}
                disabled={isRunning}
                className="w-full py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Run Backtest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!result ? (
            <div className="glass rounded-xl p-12 text-center">
              <BarChart3 className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Results Yet</h3>
              <p className="text-text-secondary">Configure your strategy and run a backtest to see results</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card">
                  <p className="text-text-tertiary text-sm mb-1">Total Return</p>
                  <p className={`text-2xl font-mono font-bold ${result.total_return >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
                    {result.total_return >= 0 ? '+' : ''}{result.total_return.toFixed(2)}%
                  </p>
                </div>

                <div className="card">
                  <p className="text-text-tertiary text-sm mb-1">Sharpe Ratio</p>
                  <p className="text-2xl font-mono font-bold">{result.sharpe_ratio.toFixed(2)}</p>
                </div>

                <div className="card">
                  <p className="text-text-tertiary text-sm mb-1">Max Drawdown</p>
                  <p className="text-2xl font-mono font-bold text-semantic-error">-{result.max_drawdown.toFixed(2)}%</p>
                </div>

                <div className="card">
                  <p className="text-text-tertiary text-sm mb-1">Win Rate</p>
                  <p className="text-2xl font-mono font-bold">{result.win_rate.toFixed(1)}%</p>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Equity Curve</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={result.equity_curve}>
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
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 glass rounded-lg">
                    <span className="text-text-secondary">Annualized Return</span>
                    <span className="font-mono font-semibold text-semantic-success">
                      +{result.annualized_return.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass rounded-lg">
                    <span className="text-text-secondary">Profit Factor</span>
                    <span className="font-mono font-semibold">{result.profit_factor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass rounded-lg">
                    <span className="text-text-secondary">Number of Trades</span>
                    <span className="font-mono font-semibold">{result.num_trades}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass rounded-lg">
                    <span className="text-text-secondary">Final Portfolio Value</span>
                    <span className="font-mono font-semibold">
                      ${(config.initial_capital * (1 + result.total_return / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Recent Trades</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-subtle">
                        <th className="text-left py-2 px-3 text-text-secondary font-medium text-sm">Date</th>
                        <th className="text-left py-2 px-3 text-text-secondary font-medium text-sm">Action</th>
                        <th className="text-right py-2 px-3 text-text-secondary font-medium text-sm">Price</th>
                        <th className="text-right py-2 px-3 text-text-secondary font-medium text-sm">Quantity</th>
                        <th className="text-right py-2 px-3 text-text-secondary font-medium text-sm">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.trades.slice(0, 5).map((trade, index) => (
                        <tr key={index} className="border-b border-border-subtle">
                          <td className="py-3 px-3 text-sm">{trade.date}</td>
                          <td className="py-3 px-3">
                            <span className={`text-sm font-medium ${trade.action === 'buy' ? 'text-semantic-success' : 'text-semantic-error'}`}>
                              {trade.action.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-right py-3 px-3 font-mono text-sm">${trade.price.toFixed(2)}</td>
                          <td className="text-right py-3 px-3 font-mono text-sm">{trade.quantity.toFixed(4)}</td>
                          <td className={`text-right py-3 px-3 font-mono text-sm font-semibold ${trade.pnl && trade.pnl >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
                            {trade.pnl ? `$${trade.pnl.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 glass rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-accent-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-secondary">
            <strong>Important:</strong> Backtesting results are based on historical data and do not guarantee future performance. 
            Transaction costs, slippage, and market impact are estimated and may differ in live trading. 
            Always conduct thorough research and consider your risk tolerance before implementing any strategy.
          </p>
        </div>
      </div>
    </div>
  )
}
