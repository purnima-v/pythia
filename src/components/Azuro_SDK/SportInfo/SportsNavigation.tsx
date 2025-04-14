'use client'
import { useSportsNavigation, useLive } from '@azuro-org/sdk'
import { ActiveLink } from '@/components'

import { useEffect } from 'react'



export function SportsNavigation() {
  const { isLive } = useLive()
  const { loading, sports } = useSportsNavigation({
    withGameCount: true,
    isLive,
  })

  useEffect(() => {
    console.log(sports)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full mb-8 overflow-hidden">
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex space-x-1">
          <ActiveLink
            className="py-2 px-4 bg-blue-600 whitespace-nowrap rounded-full"
            activeClassName="!bg-purple-600"
            href="/events/top"
          >
            Top
          </ActiveLink>
          {
            [ ...sports || [] ]
              .sort((a, b) => b.games!.length - a.games!.length)
              .map(({ slug, name, games }) => (
                <ActiveLink
                  key={slug}
                  className="flex items-center py-2 px-4 bg-purple-600 whitespace-nowrap rounded-full"
                  activeClassName="!bg-orange-400"
                  href={`/events/${slug}`}
                >
                  <span>{name}</span>
                  {
                    games && (
                      <span className="pl-1.5 text-black">{games.length}</span>
                    )
                  }
                </ActiveLink>
              ))
          }
          <div className="flex-none w-3 h-4" />
        </div>
      </div>
    </div>
  )
}
