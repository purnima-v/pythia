'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type BetInfo = {
  id: string
  title: string
  amount: string
  description: string
  createdAt: Date
}

type BetContextType = {
  bets: BetInfo[]
  addBet: (bet: Omit<BetInfo, 'id' | 'createdAt'>) => void
  isLoading: boolean
  error: string | null
}

const BetContext = createContext<BetContextType | undefined>(undefined)

export function BetProvider({ children }: { children: React.ReactNode }) {
  const [bets, setBets] = useState<BetInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addBet = async (bet: Omit<BetInfo, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true)
      const newBet: BetInfo = {
        ...bet,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date()
      }
      setBets(prev => [newBet, ...prev])
      setError(null)
    } catch (error: any) {
      console.error('Failed to add bet:', error)
      setError(error.message || 'Failed to add bet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BetContext.Provider value={{ bets, addBet, isLoading, error }}>
      {children}
    </BetContext.Provider>
  )
}

export function useBets() {
  const context = useContext(BetContext)
  if (context === undefined) {
    throw new Error('useBets must be used within a BetProvider')
  }
  return context
}