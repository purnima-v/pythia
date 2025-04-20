'use client'
import { DisplayBets } from '@/components/Display/DisplayBets'
import { useBets } from '@/components/betContext'

export default function SomePage() {
  const { bets } = useBets()
  
  return (
    <div>
      {/* other content */}
      <DisplayBets bets={bets} />
    </div>
  )
}