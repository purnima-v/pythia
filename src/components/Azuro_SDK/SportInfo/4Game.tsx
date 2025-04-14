'use client'
import { useGameStatus, useActiveMarkets, useLive } from '@azuro-org/sdk'
import { type GamesQuery} from '@azuro-org/toolkit';
import Link from 'next/link'
import cx from 'clsx'
import dayjs from 'dayjs'

import { OutcomeButton } from '@/components'


type GameProps = {
  className?: string
  game: GamesQuery['games'][0]
}

export function Game(props: GameProps) {
  const { className, game } = props
  const { gameId, title, startsAt, status: graphStatus } = game

  const { isLive } = useLive()
  const { status } = useGameStatus({
    graphStatus,
    startsAt: +startsAt,
    isGameExistInLive: isLive,
  })
  const { markets } = useActiveMarkets({
    gameStatus: status,
    gameId,
  })

  return (
    <div className={cx(className, "p-2 bg-purple-600 rounded-lg flex items-center justify-between")}>
      <div className='max-w-[220px] w-full'>
        <Link 
          className="text-sm mb-2 hover:underline block whitespace-nowrap overflow-hidden text-ellipsis w-full" 
          href={`/event/${gameId}`}
        >
          {title}
        </Link>
        <div>{dayjs(+startsAt * 1000).format('DD MMM HH:mm')}</div>
      </div>
      {
        Boolean(markets?.[0]?.outcomeRows[0]) && (
          <div className="min-w-[500px]">
            <div className="text-center">{markets![0].name}</div>
            <div className="flex items-center ">
              {
                markets![0].outcomeRows[0].map((outcome) => (
                  <OutcomeButton
                    className="ml-2 first-of-type:ml-0"
                    key={outcome.selectionName}
                    outcome={outcome}
                  />
                ))
              }
            </div>
          </div>
        )
      }
      <Link 
        className="text-md p-2 rounded-lg bg-blue-800 hover:underline" 
        href={`/event/${gameId}`}
      >
        All Markets =&gt;
      </Link>
    </div>
  )
}