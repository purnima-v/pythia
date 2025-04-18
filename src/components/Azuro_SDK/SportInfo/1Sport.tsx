'use client'
import { SportsQuery } from '@/types/Sport'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Country } from './2Country'

import cx from 'clsx'
import { colorTheme} from '@/constants/colors'

type SportProps = {
  sport: SportsQuery['sports'][0]
}

export function Sport(props: SportProps) {
  const { sport } = props
  const { countries } = sport
  const params = useParams()

  

  const isSportPage = params.sport !== 'top'

  return (
    <div
      className={`${!isSportPage && `p-4 rounded-3xl mt-2 first-of-type:mt-0 ${colorTheme.sport}`}`}
    >
      {
        !isSportPage && (
          <Link 
            className="text-lg mb-2 hover:underline font-bold" 
            href={`/events/${sport.slug}`}
          >
            {sport.name}
          </Link>
        )
      }
      {
        countries.map(country => (
          <Country 
            key={country.slug} 
            className="mt-2" 
            country={country} 
            sportSlug={sport.slug} 
          />
        ))
      }
    </div>
  )
}
