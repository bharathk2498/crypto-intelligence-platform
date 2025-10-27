'use client'

import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-background-primary to-accent-secondary/20 blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block">Institutional-Grade</span>
            <span className="block bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
              Crypto Analytics
            </span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Advanced risk metrics, on-chain intelligence, and AI-powered insights for serious investors and teams. 
            The Bloomberg Terminal for crypto.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="px-8 py-4 rounded-xl bg-accent-primary hover:bg-accent-primary-hover transition-all transform hover:scale-105 text-white font-semibold flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/demo"
              className="px-8 py-4 rounded-xl glass hover:bg-white/10 transition-all text-white font-semibold"
            >
              View Demo
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Risk Metrics</h3>
              <p className="text-text-secondary">Alpha, Beta, Sharpe, Sortino, VaR with full transparency and confidence intervals</p>
            </div>

            <div className="glass rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">On-Chain Intelligence</h3>
              <p className="text-text-secondary">Real-time whale tracking, exchange flows, supply distribution, and validator data</p>
            </div>

            <div className="glass rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Copilot</h3>
              <p className="text-text-secondary">Natural language queries, portfolio optimization, and strategy backtesting with explainability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
