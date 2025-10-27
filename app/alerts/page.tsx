use client

import { useState } from 'react'
import { Plus, Bell, Mail, MessageSquare, Webhook, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface Alert {
  id: string
  name: string
  asset: string
  condition: string
  value: number
  channels: string[]
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      name: 'Bitcoin Price Alert',
      asset: 'BTC',
      condition: 'price_above',
      value: 50000,
      channels: ['email', 'telegram'],
      isActive: true,
      lastTriggered: '2 days ago',
      triggerCount: 5
    },
    {
      id: '2',
      name: 'Ethereum Volume Spike',
      asset: 'ETH',
      condition: 'volume_spike',
      value: 200,
      channels: ['email', 'slack'],
      isActive: true,
      triggerCount: 12
    },
    {
      id: '3',
      name: 'SOL Whale Activity',
      asset: 'SOL',
      condition: 'whale_transaction',
      value: 100000,
      channels: ['telegram', 'webhook'],
      isActive: false,
      lastTriggered: '5 hours ago',
      triggerCount: 3
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newAlert, setNewAlert] = useState({
    name: '',
    asset: 'BTC',
    condition: 'price_above',
    value: '',
    channels: [] as string[]
  })

  function toggleAlert(id: string) {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ))
  }

  function deleteAlert(id: string) {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  function createAlert() {
    const alert: Alert = {
      id: Date.now().toString(),
      name: newAlert.name,
      asset: newAlert.asset,
      condition: newAlert.condition,
      value: parseFloat(newAlert.value),
      channels: newAlert.channels,
      isActive: true,
      triggerCount: 0
    }

    setAlerts([...alerts, alert])
    setShowCreateModal(false)
    setNewAlert({
      name: '',
      asset: 'BTC',
      condition: 'price_above',
      value: '',
      channels: []
    })
  }

  function toggleChannel(channel: string) {
    if (newAlert.channels.includes(channel)) {
      setNewAlert({
        ...newAlert,
        channels: newAlert.channels.filter(c => c !== channel)
      })
    } else {
      setNewAlert({
        ...newAlert,
        channels: [...newAlert.channels, channel]
      })
    }
  }

  const conditionLabels: Record<string, string> = {
    price_above: 'Price Above',
    price_below: 'Price Below',
    volume_spike: 'Volume Spike',
    whale_transaction: 'Whale Transaction',
    exchange_flow: 'Exchange Flow Alert',
    technical_indicator: 'Technical Indicator'
  }

  const channelIcons: Record<string, any> = {
    email: Mail,
    telegram: MessageSquare,
    slack: MessageSquare,
    webhook: Webhook
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Alerts</h1>
          <p className="text-text-secondary mt-2">Stay informed about market movements and critical events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Alert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Total Alerts</span>
            <Bell className="h-4 w-4 text-text-tertiary" />
          </div>
          <div className="text-3xl font-bold">{alerts.length}</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Active Alerts</span>
            <Bell className="h-4 w-4 text-semantic-success" />
          </div>
          <div className="text-3xl font-bold">{alerts.filter(a => a.isActive).length}</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Triggered (24h)</span>
            <Bell className="h-4 w-4 text-accent-primary" />
          </div>
          <div className="text-3xl font-bold">
            {alerts.reduce((sum, a) => sum + a.triggerCount, 0)}
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Bell className="h-16 w-16 mx-auto mb-4 text-text-tertiary" />
          <h2 className="text-2xl font-semibold mb-2">No Alerts Yet</h2>
          <p className="text-text-secondary mb-6">Create your first alert to stay informed</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors"
          >
            Create Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="glass rounded-xl p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{alert.name}</h3>
                    <span className="px-2 py-1 rounded bg-background-secondary text-xs font-medium">
                      {alert.asset}
                    </span>
                    {alert.isActive ? (
                      <span className="px-2 py-1 rounded bg-semantic-success/20 text-semantic-success text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-text-tertiary/20 text-text-tertiary text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-text-secondary mb-4">
                    <span>
                      {conditionLabels[alert.condition]} {alert.value.toLocaleString()}
                    </span>
                    {alert.lastTriggered && (
                      <span>Last triggered: {alert.lastTriggered}</span>
                    )}
                    <span>Triggered {alert.triggerCount} times</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.channels.map(channel => {
                      const Icon = channelIcons[channel]
                      return (
                        <div
                          key={channel}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg glass text-xs"
                        >
                          <Icon className="h-3 w-3" />
                          <span className="capitalize">{channel}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                  >
                    {alert.isActive ? (
                      <ToggleRight className="h-5 w-5 text-semantic-success" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-text-tertiary" />
                    )}
                  </button>
                  <button className="p-2 rounded-lg hover:bg-background-tertiary transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 rounded-lg hover:bg-semantic-error/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-semantic-error" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Alert</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Alert Name</label>
                <input
                  type="text"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  placeholder="My Alert"
                  className="w-full px-4 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Asset</label>
                <select
                  value={newAlert.asset}
                  onChange={(e) => setNewAlert({ ...newAlert, asset: e.target.value })}
                  className="w-full px-4 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="ADA">Cardano (ADA)</option>
                  <option value="AVAX">Avalanche (AVAX)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Condition</label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  className="w-full px-4 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                >
                  <option value="price_above">Price Above</option>
                  <option value="price_below">Price Below</option>
                  <option value="volume_spike">Volume Spike (%)</option>
                  <option value="whale_transaction">Whale Transaction (USD)</option>
                  <option value="exchange_flow">Exchange Flow Alert</option>
                  <option value="technical_indicator">Technical Indicator</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Value</label>
                <input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                  placeholder="Enter value"
                  className="w-full px-4 py-2 bg-background-secondary rounded-lg border border-border-default focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Notification Channels</label>
                <div className="grid grid-cols-2 gap-3">
                  {['email', 'telegram', 'slack', 'webhook'].map(channel => {
                    const Icon = channelIcons[channel]
                    return (
                      <button
                        key={channel}
                        onClick={() => toggleChannel(channel)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                          newAlert.channels.includes(channel)
                            ? 'border-accent-primary bg-accent-primary/20'
                            : 'border-border-default hover:border-border-subtle'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="capitalize">{channel}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border-subtle">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border-default hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createAlert}
                disabled={!newAlert.name || !newAlert.value || newAlert.channels.length === 0}
                className="flex-1 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}