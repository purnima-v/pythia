'use client'
import { type GameMarkets } from '@/types/Sport';
// import { OutcomeButton, OutcomeResult } from '@/components'


type GameMarketsProps = {
  markets: GameMarkets
  betsSummary?: Record<string, string>
  isResult?: boolean
}

export function GameMarkets(props: GameMarketsProps) {
  const { markets, betsSummary, isResult } = props

  return (
    <div className="max-w-[600px] mx-auto space-y-6 bg-green-800 p-4 rounded-lg">
      {
        markets.map(({ name, outcomeRows }) => (
          <div key={name} className="">
            <div className="mb-2 text-lg font-semibold">{name}</div>
            <div className="space-y-1">
              {
                outcomeRows.map((outcomes, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="flex gap-2 w-full">
                      {
                        outcomes.map((outcome) => {
                          const key = outcome.gameId

                          return (
                            <div>
                              MARKET INFO
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}
