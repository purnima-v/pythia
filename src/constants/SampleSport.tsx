import { SportsQuery, GameStatus, SportsGames } from '../types/Sport'

export const sampleSports: SportsQuery = {
    __typename: 'Query',
    sports: [
      {
        __typename: 'Sport',
        id: '1004',
        slug: 'Idiot',
        name: 'The Idiot Game',
        sportId: '1004',
        countries: [
          {
            __typename: 'Country',
            slug: 'japan',
            name: 'Japan',
            turnover: '0',
            leagues: [
              {
                __typename: 'League',
                slug: 'japan-Idiot-league',
                name: 'Japan Idiot League',
                turnover: '0',
                games: [
                  {
                    __typename: 'Game',
                    turnover: '0',
                    id: '1001000000001603658498',
                    gameId: '1001000000001603658498',
                    title: 'Tokyo Titans – Osaka Warriors',
                    startsAt: '1739438900',
                    status: GameStatus.Created,
                    sport: {
                      __typename: 'Sport',
                      sportId: '1004',
                      slug: 'Idiot',
                      name: 'The Idiot Game'
                    },
                    league: {
                      __typename: 'League',
                      slug: 'japan-Idiot-league',
                      name: 'Japan Idiot League',
                      country: {
                        __typename: 'Country',
                        slug: 'japan',
                        name: 'Japan'
                      }
                    },
                    participants: [
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/japan/tokyo-titans.png',
                        name: 'Tokyo Titans'
                      },
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/japan/osaka-warriors.png',
                        name: 'Osaka Warriors'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            __typename: 'Country',
            slug: 'korea',
            name: 'South Korea',
            turnover: '0',
            leagues: [
              {
                __typename: 'League',
                slug: 'korea-Idiot-championship',
                name: 'Korea Idiot Championship',
                turnover: '0',
                games: [
                  {
                    __typename: 'Game',
                    turnover: '0',
                    id: '1001000000001603658499',
                    gameId: '1001000000001603658499',
                    title: 'Seoul Dragons – Busan Knights',
                    startsAt: '1739438900',
                    status: GameStatus.Created,
                    sport: {
                      __typename: 'Sport',
                      sportId: '1004',
                      slug: 'Idiot',
                      name: 'The Idiot Game'
                    },
                    league: {
                      __typename: 'League',
                      slug: 'korea-Idiot-championship',
                      name: 'Korea Idiot Championship',
                      country: {
                        __typename: 'Country',
                        slug: 'korea',
                        name: 'South Korea'
                      }
                    },
                    participants: [
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/korea/seoul-dragons.png',
                        name: 'Seoul Dragons'
                      },
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/korea/busan-knights.png',
                        name: 'Busan Knights'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        __typename: 'Sport',
        id: '1003',
        slug: 'csgo',
        name: 'Counter-Strike',
        sportId: '1003',
        countries: [
          {
            __typename: 'Country',
            slug: 'sweden',
            name: 'Sweden',
            turnover: '0',
            leagues: [
              {
                __typename: 'League',
                slug: 'swedish-elite',
                name: 'Swedish Elite League',
                turnover: '0',
                games: [
                  {
                    __typename: 'Game',
                    turnover: '0',
                    id: '1001000000001603658497',
                    gameId: '1001000000001603658497',
                    title: 'Ninjas in Pyjamas – Fnatic',
                    startsAt: '1739438800',
                    status: GameStatus.Created,
                    sport: {
                      __typename: 'Sport',
                      sportId: '1003',
                      slug: 'csgo',
                      name: 'Counter-Strike'
                    },
                    league: {
                      __typename: 'League',
                      slug: 'swedish-elite',
                      name: 'Swedish Elite League',
                      country: {
                        __typename: 'Country',
                        slug: 'sweden',
                        name: 'Sweden'
                      }
                    },
                    participants: [
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/sweden/nip.png',
                        name: 'Ninjas in Pyjamas'
                      },
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/sweden/fnatic.png',
                        name: 'Fnatic'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            __typename: 'Country',
            slug: 'denmark',
            name: 'Denmark',
            turnover: '0',
            leagues: [
              {
                __typename: 'League',
                slug: 'danish-pro',
                name: 'Danish Pro League',
                turnover: '0',
                games: [
                  {
                    __typename: 'Game',
                    turnover: '0',
                    id: '1001000000001603658496',
                    gameId: '1001000000001603658496',
                    title: 'Astralis – Heroic',
                    startsAt: '1739438800',
                    status: GameStatus.Created,
                    sport: {
                      __typename: 'Sport',
                      sportId: '1003',
                      slug: 'csgo',
                      name: 'Counter-Strike'
                    },
                    league: {
                      __typename: 'League',
                      slug: 'danish-pro',
                      name: 'Danish Pro League',
                      country: {
                        __typename: 'Country',
                        slug: 'denmark',
                        name: 'Denmark'
                      }
                    },
                    participants: [
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/denmark/astralis.png',
                        name: 'Astralis'
                      },
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/denmark/heroic.png',
                        name: 'Heroic'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        __typename: 'Sport',
        id: '1002',
        slug: 'pie',
        name: 'Squat Cobbler',
        sportId: '1002',
        countries: [
          {
            __typename: 'Country',
            slug: 'usa',
            name: 'United States',
            turnover: '0',
            leagues: [
              {
                __typename: 'League',
                slug: 'american-pie-league',
                name: 'American Pie League',
                turnover: '0',
                games: [
                  {
                    __typename: 'Game',
                    turnover: '0',
                    id: '1001000000001603658495',
                    gameId: '1001000000001603658495',
                    title: 'Chicago Cobblers vs LA Pies',
                    startsAt: '1739438700',
                    status: GameStatus.Created,
                    sport: {
                      __typename: 'Sport',
                      sportId: '1002',
                      slug: 'pie',
                      name: 'Squat Cobbler'
                    },
                    league: {
                      __typename: 'League',
                      slug: 'american-pie-league',
                      name: 'American Pie League',
                      country: {
                        __typename: 'Country',
                        slug: 'usa',
                        name: 'United States'
                      }
                    },
                    participants: [
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/usa/chicago-cobblers.png',
                        name: 'Chicago Cobblers'
                      },
                      {
                        __typename: 'Participant',
                        image: 'https://avatars.azuro.org/usa/la-pies.png',
                        name: 'LA Pies'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

// export const sportsGames = sampleSports.sports.map(sport => ({
//     __typename: sport.__typename,
//     id: sport.id,
//     slug: sport.slug,
//     name: sport.name,
//     sportId: sport.sportId,
//     games: sport.countries.flatMap(country => 
//       country.leagues.flatMap(league => 
//         league.games.map(game => ({
//           __typename: game.__typename,
//           id: game.id
//         }))
//       )
//     )
//   }))





  // // THIS IS A FUNCTION THAT TURNS A BIG COMPLICATED SPORT TO ITS SIMPLER TYPE...CONFUSING AS TO WHY THIS IS A THING BUT LIKE WHATEVER
  export function toSportsGames(sports: SportsQuery): SportsGames[] {
    return sports.sports.map(sport => ({
      __typename: sport.__typename,
      id: sport.id,
      slug: sport.slug,
      name: sport.name,
      sportId: sport.sportId,
      games: sport.countries.flatMap(country => 
        country.leagues.flatMap(league => 
          league.games.map(game => ({
            __typename: game.__typename,
            id: game.id
          }))
        )
      )
    }))
  }