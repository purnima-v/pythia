'use client'
import { 
  useBetsSummary, 
  useChain } from "@azuro-org/sdk"
import { useAccount } from "wagmi"

import { OpenSummary } from '@/context/betsummary'




function Content({setOpen}: {setOpen: (open: boolean) => void}) {
  const { address } = useAccount()
  const { betToken } = useChain()
  const { toPayout, inBets, totalPayout, totalProfit, betsCount, wonBetsCount, lostBetsCount, loading } = useBetsSummary({
    account: address!,
  })

  if (!address || loading) {
    return null
  }

  return (
      <div className="w-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">To Payout:</span>
          {toPayout} {betToken.symbol}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">In Bets:</span>
          {inBets} {betToken.symbol}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">Total Payout:</span>
          {totalPayout} {betToken.symbol}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">Total Profit:</span>
          {totalProfit} {betToken.symbol}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">Bets Count:</span>
          {betsCount}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">Won Bets:</span>
          {wonBetsCount}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">Lost Bets:</span>
          {lostBetsCount}
        </div>
        <div className="border-gray-300 bg-gray-600 text-center text-bold" onClick={() => setOpen(false)}>
          V
        </div>
      </div>
  )
}


export function BetsSummary() {
  const { isOpen, setOpen } = OpenSummary()
  
  // console.log(items)

  return (
    <div className="
      fixed text-black bottom-4 left-4 bg-orange-100 rounded-md border border-solid"
      >
        
      {
        isOpen ? (
          <Content setOpen={setOpen} />
        ) : (
          <button
            className="flex items-center py-2 px-4 bg-orange-100 whitespace-nowrap rounded-full ml-auto"
            onClick={() => setOpen(!isOpen)}
          >
            SUMMARY
          </button>
        )
      }
      

      {/* <Content /> */}
    </div>
  )
}