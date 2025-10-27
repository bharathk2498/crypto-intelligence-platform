'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface UserState {
  tier: 'free' | 'premium' | 'enterprise'
  isAuthenticated: boolean
}

const UserContext = createContext<{
  user: UserState
  setUser: (user: UserState) => void
} | undefined>(undefined)

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>({
    tier: 'free',
    isAuthenticated: false,
  })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within Providers')
  return context
}
