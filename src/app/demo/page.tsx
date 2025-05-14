'use client'
import Home from '@/components/PRIVY/privy'
import { useBets } from '@/components/Bets/betContext'

export default function SomePage() {
  const { bets } = useBets()
  
  return (
    <div>
      {/* other content */}
      <Home />
    </div>
  )
}