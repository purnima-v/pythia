'use client'
import { SportsNavigation, Sport } from '@/components'
import { useParams } from 'next/navigation'
import { sampleSports } from '@/constants/SampleSport';
import { Suspense } from 'react';


import { useSports, type UseSportsProps, useLive } from '@azuro-org/sdk'
import { Game_OrderBy, OrderDirection } from '@azuro-org/toolkit';
import { SportsGames } from '@/types/Sport';


const getFilteredSports = () => {
  const params = useParams()
  const isTopPage = params.sport === 'top'



  // UNCOMMENT BELOW CODE TO GET SPORTS FROM AZURO

  // const { isLive } = useLive()
  // const props: UseSportsProps = isTopPage ? {
  //   gameOrderBy: Game_OrderBy.Turnover,
  //   filter: {
  //     limit: 10,
  //   },
  //   isLive,
  // } : {
  //   gameOrderBy: Game_OrderBy.StartsAt,
  //   orderDir: OrderDirection.Asc,
  //   filter: {
  //     sportSlug: params.sport as string,
  //     countrySlug: params.country as string,
  //     leagueSlug: params.league as string,
  //   },
  //   isLive,
  // }
  // const {sports} = useSports(props)

  // sampleSports.sports = sports


  const filteredSports = isTopPage 
    ? sampleSports.sports.slice(0, 10)
    : sampleSports.sports.filter(sport => {
        if (params.sport && sport.slug !== params.sport) return false;
        
        if (params.country) {
          const matchingCountry = sport.countries.find(country => 
            country.slug === params.country
          );
          if (!matchingCountry) return false;

          if (params.league) {
            return matchingCountry.leagues.some(league => 
              league.slug === params.league
            );
          }
        }
        return true;
      });

  return {
    sports: filteredSports,
  }
}



export default function EventsLayout() {
  const { sports } = getFilteredSports()
  
  console.log(sports)

  return (
    <>
      <SportsNavigation />
      
      <Suspense fallback={<div>Loading...</div>}>
        <div className='bg-black/5 p-4 rounded-lg flex flex-col gap-4'>
          {
            sports.map((sport) => (
              <Sport key={sport.slug} sport={sport} />
            ))
          }
        </div>
      </Suspense>
    </>
  )
}
