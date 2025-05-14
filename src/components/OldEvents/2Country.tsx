'use client'
import { SportsQuery } from '@/types/Sport'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import cx from 'clsx'

import { League } from './3League'
import { CountryFlag } from '../../../archieve/Azuro_SDK/SportInfo/CountryFlag/CountryFlag'

import { colorTheme} from '@/constants/colors'


type CountryProps = {
  className?: string
  sportSlug: string
  country: SportsQuery['sports'][0]['countries'][0]
}

export function Country(props: CountryProps) {
  const { className, sportSlug, country } = props
  const { leagues } = country

  const params = useParams()

  const isCountryPage = params.country
  const isLeaguePage = params.league
  
  return (
    <div
      className={`p-4 rounded-3xl mt-2 first-of-type:mt-0 ${colorTheme.country}`}>
        {
          !isLeaguePage && (
            <div className="flex items-center mb-2 text-black">
              <CountryFlag countryName={country.name} />
              <Link 
                className={cx("ml-1 hover:underline", {
                  "text-md font-medium": !isCountryPage,
                  "text-lg font-bold": isCountryPage
                })} 
                href={`/events/${sportSlug}/${country.slug}`}
              >
                {country.name}
              </Link>
            </div>
          )
        }
        {
          leagues.map(league => (
            <League 
              key={league.slug}
              className="mt-2 first-of-type:mt-0"
              league={league} 
              sportSlug={sportSlug} 
              countryName={country.name}
              countrySlug={country.slug}
            />
          ))
        }
    </div>
  )
}
