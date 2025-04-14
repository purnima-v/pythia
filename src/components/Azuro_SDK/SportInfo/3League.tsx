'use client'
import { type SportsQuery } from '@azuro-org/toolkit';
import Link from 'next/link'
import cx from 'clsx'
import { useParams } from 'next/navigation'

import { CountryFlag } from './CountryFlag/CountryFlag'
import { Game } from './4Game'


type LeagueProps = {
  className?: string
  sportSlug: string
  countryName: string
  countrySlug: string
  league: SportsQuery['sports'][0]['countries'][0]['leagues'][0]
}



export function League(props: LeagueProps) {
  const { className, sportSlug, countryName, countrySlug, league } = props
  const { games } = league

  const params = useParams()

  const isLeaguePage = params.league
  
  return (
    <div
      className={cx(className, {
        "p-4 bg-orange-400 rounded-md": !isLeaguePage
      })}>
        <div className={cx("flex items-center mb-2", {
          "text-sm": !isLeaguePage,
          "text-lg font-bold": isLeaguePage
        })}>
          {
            isLeaguePage && (
              <>
                <Link 
                  className="hover:underline w-fit flex items-center"
                  href={`/events/${sportSlug}/${countrySlug}`}
                >
                  <CountryFlag countryName={countryName} />
                  <div className="ml-2">{countryName}</div>
                </Link>
                <div className="mx-2">&middot;</div>
              </>
            )
          }
          <Link 
            className="hover:underline w-fit"
            href={`/events/${sportSlug}/${countrySlug}/${league.slug}`}
          >
            {league.name}
          </Link>
        </div>

        
        {
          games.map(game => (
            <Game 
              key={game.gameId}
              className="mt-2 first-of-type:mt-0"
              game={game} 
            />
          ))
        }
    </div>
  )
}
