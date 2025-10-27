export interface Asset {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  circulating_supply: number
  max_supply: number | null
  ath: number
  ath_date: string
  atl: number
  atl_date: string
  image: string
}

export interface PriceData {
  timestamp: number
  price: number
  volume: number
}

export interface RiskMetrics {
  volatility: number
  sharpe_ratio: number
  sortino_ratio: number
  max_drawdown: number
  calmar_ratio: number
  alpha: number
  beta: number
  r_squared: number
  skewness: number
  kurtosis: number
}

export interface RiskCalculationParams {
  returns: number[]
  benchmark_returns?: number[]
  risk_free_rate?: number
  window_size?: number
  confidence_level?: number
}

export interface PortfolioPosition {
  asset_id: string
  symbol: string
  quantity: number
  avg_buy_price: number
  current_price: number
  value: number
  weight: number
  pnl: number
  pnl_percentage: number
}

export interface Portfolio {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  positions: PortfolioPosition[]
  total_value: number
  total_cost_basis: number
  total_pnl: number
  total_pnl_percentage: number
}

export interface BacktestConfig {
  strategy_type: 'momentum' | 'mean_reversion' | 'breakout' | 'custom'
  assets: string[]
  start_date: string
  end_date: string
  initial_capital: number
  position_size: number
  rebalance_frequency: 'daily' | 'weekly' | 'monthly'
  transaction_cost: number
  slippage: number
  stop_loss?: number
  take_profit?: number
}

export interface BacktestResult {
  total_return: number
  annualized_return: number
  sharpe_ratio: number
  max_drawdown: number
  win_rate: number
  profit_factor: number
  num_trades: number
  equity_curve: { date: string; value: number }[]
  trades: BacktestTrade[]
}

export interface BacktestTrade {
  date: string
  asset: string
  action: 'buy' | 'sell'
  price: number
  quantity: number
  value: number
  pnl?: number
}

export interface OnChainMetrics {
  active_addresses: number
  transaction_count: number
  exchange_inflow: number
  exchange_outflow: number
  net_exchange_flow: number
  whale_transactions: number
  supply_held_by_lth: number
  supply_held_by_sth: number
  staking_ratio: number
  validator_count: number
}

export interface Alert {
  id: string
  user_id: string
  name: string
  asset_id: string
  condition_type: 'price_above' | 'price_below' | 'volume_spike' | 'technical' | 'onchain'
  condition_value: number
  channels: ('email' | 'sms' | 'slack' | 'telegram' | 'webhook')[]
  is_active: boolean
  created_at: string
  triggered_at?: string
}

export interface UserTier {
  tier: 'free' | 'premium' | 'enterprise'
  features: {
    max_watchlist_assets: number
    max_alerts: number
    max_portfolios: number
    ai_queries_per_day: number
    historical_data_years: number
    api_rate_limit: number
    has_advanced_charts: boolean
    has_risk_metrics: boolean
    has_onchain_data: boolean
    has_backtesting: boolean
    has_portfolio_optimization: boolean
  }
}

export interface Screener {
  filters: ScreenerFilter[]
  sort_by: string
  sort_order: 'asc' | 'desc'
  page: number
  per_page: number
}

export interface ScreenerFilter {
  field: string
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between'
  value: number | number[]
}

export interface ChartIndicator {
  type: 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger' | 'volume' | 'atr'
  params: Record<string, number>
  visible: boolean
}
