'use client'
import { ActiveLink } from '@/components'

import {sportsGames} from '@/constants/SampleSport'


export function SportsNavigation() {

  return (
    <div className="w-full my-4 ml-5 overflow-hidden">
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex space-x-1">
            <ActiveLink
              className="py-2 px-4 bg-blue-400 whitespace-nowrap rounded-full mr-10"
              activeClassName="!bg-orange-400"
              href="/events/top"
            >
              Top
            </ActiveLink>
            {
            [ ...sportsGames || [] ]
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
