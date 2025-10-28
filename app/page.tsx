'use client'

// Pricing page for Crypto Intelligence Platform.
// This page wraps the existing PricingSection component with a header and
// descriptive text. It also adds a footer for consistency across the site.

import PricingSection from '@/components/PricingSection'

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">Pricing Plans</h1>
      <p className="text-text-secondary mb-8">
        Choose a subscription tier that matches your needs and unlock the full power of CryptoIntel.
      </p>
      <PricingSection />
      <footer className="mt-12 text-center text-sm text-text-tertiary">
        © 2025 CryptoIntel. All rights reserved.
      </footer>
    </div>
  )
}