'use client'

import { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, Edit, Check, X, Mail, Smartphone, MessageSquare } from 'lucide-react'
import { Alert } from '@/lib/types'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)

  useEffect(() => {
    // Load mock alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        user_id: 'user1',
        name: 'BTC Price Alert',
        asset_id: 'bitcoin',
        condition_type: 'price_above',
        condition_value: 45000,
        channels: ['email', 'sms'],
        is_active: true,
        created_at: '2024-10-20T10:00:00Z'
      },
      {
        id: '2',
        user_id: 'user1',
        name: 'ETH Volume Spike',
        asset_id: 'ethereum',
        condition_type: 'volume_spike',
        condition_value: 150,
        channels: ['email'],
        is_active: true,
        created_at: '2024-10-22T14:30:00Z'
      }
    ]
    setAlerts(mockAlerts)
  }, [])

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, is_active: !a.is_active } : a
    ))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
          <p className="text-text-secondary">Get notified when market conditions match your criteria</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Alert
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-accent-primary" />
            <p className="text-text-tertiary text-sm">Active Alerts</p>
          </div>
          <p className="text-3xl font-mono font-bold">
            {alerts.filter(a => a.is_active).length}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-5 w-5 text-semantic-success" />
            <p className="text-text-tertiary text-sm">Triggered (24h)</p>
          </div>
          <p className="text-3xl font-mono font-bold">3</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-accent-primary" />
            <p className="text-text-tertiary text-sm">Notifications Sent</p>
          </div>
          <p className="text-3xl font-mono font-bold">127</p>
        </div>
      </div>

      {/* Alert List */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Your Alerts</h2>
        
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Alerts Yet</h3>
            <p className="text-text-secondary mb-6">Create your first alert to start monitoring the market</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors"
            >
              Create Your First Alert
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className="p-4 glass rounded-lg flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${alert.is_active ? 'bg-accent-primary/20' : 'bg-surface-default'}`}>
                    <Bell className={`h-5 w-5 ${alert.is_active ? 'text-accent-primary' : 'text-text-tertiary'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{alert.name}</h3>
                    <p className="text-sm text-text-secondary">
                      {alert.asset_id.toUpperCase()} • {' '}
                      {alert.condition_type === 'price_above' && `Price above $${alert.condition_value.toLocaleString()}`}
                      {alert.condition_type === 'price_below' && `Price below $${alert.condition_value.toLocaleString()}`}
                      {alert.condition_type === 'volume_spike' && `Volume spike ${alert.condition_value}% above average`}
                      {alert.condition_type === 'technical' && `Technical indicator signal`}
                      {alert.condition_type === 'onchain' && `On-chain metric threshold`}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {alert.channels.includes('email') && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </span>
                      )}
                      {alert.channels.includes('sms') && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary flex items-center gap-1">
                          <Smartphone className="h-3 w-3" />
                          SMS
                        </span>
                      )}
                      {alert.channels.includes('telegram') && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Telegram
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      alert.is_active
                        ? 'bg-semantic-success/20 text-semantic-success'
                        : 'glass hover:bg-white/10'
                    }`}
                  >
                    {alert.is_active ? 'Active' : 'Paused'}
                  </button>
                  
                  <button
                    onClick={() => setEditingAlert(alert)}
                    className="p-2 glass hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 glass hover:bg-semantic-error/20 rounded-lg transition-colors text-semantic-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Alert Modal */}
      {(showCreateModal || editingAlert) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingAlert ? 'Edit Alert' : 'Create New Alert'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingAlert(null)
                }}
                className="p-2 glass hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Alert Name</label>
                <input
                  type="text"
                  placeholder="e.g., BTC Price Alert"
                  className="w-full px-4 py-3 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Asset</label>
                  <select className="w-full px-4 py-3 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none">
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                    <option>Solana (SOL)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Condition Type</label>
                  <select className="w-full px-4 py-3 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none">
                    <option value="price_above">Price Above</option>
                    <option value="price_below">Price Below</option>
                    <option value="volume_spike">Volume Spike</option>
                    <option value="technical">Technical Signal</option>
                    <option value="onchain">On-Chain Metric</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Condition Value</label>
                <input
                  type="number"
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-3 bg-surface-default rounded-lg border border-border-subtle focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Notification Channels</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 glass rounded-lg cursor-pointer hover:bg-white/5">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <Mail className="h-4 w-4 text-accent-primary" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 glass rounded-lg cursor-pointer hover:bg-white/5">
                    <input type="checkbox" className="w-4 h-4" />
                    <Smartphone className="h-4 w-4 text-accent-primary" />
                    <span>SMS</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 glass rounded-lg cursor-pointer hover:bg-white/5">
                    <input type="checkbox" className="w-4 h-4" />
                    <MessageSquare className="h-4 w-4 text-accent-primary" />
                    <span>Telegram</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingAlert(null)
                  }}
                  className="flex-1 px-4 py-3 glass hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover rounded-lg transition-colors"
                >
                  {editingAlert ? 'Update Alert' : 'Create Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Alert Types</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-accent-primary">Price Alerts:</strong>
              <p className="text-text-secondary">Get notified when price crosses a specific threshold</p>
            </div>
            <div>
              <strong className="text-accent-primary">Volume Spikes:</strong>
              <p className="text-text-secondary">Detect unusual trading activity and momentum shifts</p>
            </div>
            <div>
              <strong className="text-accent-primary">Technical Signals:</strong>
              <p className="text-text-secondary">RSI overbought/oversold, MACD crossovers, etc.</p>
            </div>
            <div>
              <strong className="text-accent-primary">On-Chain Metrics:</strong>
              <p className="text-text-secondary">Whale movements, exchange flows, network activity</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Notification Channels</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong>Email:</strong>
                <p className="text-text-secondary">Instant email notifications with detailed alert information</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Smartphone className="h-5 w-5 text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong>SMS:</strong>
                <p className="text-text-secondary">Text messages for urgent price movements (Premium)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong>Telegram:</strong>
                <p className="text-text-secondary">Real-time messages via Telegram bot (Premium)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
