

export enum GameStatus {
    Canceled = "Canceled",
    Created = "Created",
    Paused = "Paused",
    Resolved = "Resolved"
}

export type SportsGames = {
    __typename?: "Sport";
    id: string;
    slug: string;
    name: string;
    sportId: string;
    games?: Array<{
        __typename?: "Game";
        id: string;
    }>;
};


export type GameQuery = {
    __typename?: 'Query';
    games: Array<{
        __typename?: 'Game';
        id: string;
        gameId: string;
        title?: string | null;
        startsAt: string;
        status: GameStatus;
        sport: {
            __typename?: 'Sport';
            sportId: string;
            slug: string;
            name: string;
        };
        league: {
            __typename?: 'League';
            slug: string;
            name: string;
            country: {
                __typename?: 'Country';
                slug: string;
                name: string;
            };
        };
        participants: Array<{
            __typename?: 'Participant';
            image?: string | null;
            name: string;
        }>;
    }>;
};

export declare enum ConditionStatus {
    Canceled = "Canceled",
    Created = "Created",
    Paused = "Paused",
    Resolved = "Resolved"
}

export type MarketOutcome = {
    selectionName: string;
    odds?: number;
    lpAddress: string;
    coreAddress: string;
    status: ConditionStatus;
    gameId: string;
    isExpressForbidden: boolean;
    margin?: string;
    isWon?: boolean;
} & Selection;

export type Market = {
    marketKey: string;
    name: string;
    description: string;
    outcomeRows: MarketOutcome[][];
};
export type GameMarkets = Market[];


// You can also export the type from here
export type SportsQuery = {
    __typename?: 'Query';
    sports: Array<{
        __typename?: 'Sport';
        id: string;
        slug: string;
        name: string;
        sportId: string;
        countries: Array<{
            __typename?: 'Country';
            slug: string;
            name: string;
            turnover: string;
            leagues: Array<{
                __typename?: 'League';
                slug: string;
                name: string;
                turnover: string;
                games: Array<{
                    __typename?: 'Game';
                    turnover: string;
                    id: string;
                    gameId: string;
                    title?: string | null;
                    startsAt: string;
                    status: GameStatus;
                    sport: {
                        __typename?: 'Sport';
                        sportId: string;
                        slug: string;
                        name: string;
                    };
                    league: {
                        __typename?: 'League';
                        slug: string;
                        name: string;
                        country: {
                            __typename?: 'Country';
                            slug: string;
                            name: string;
                        };
                    };
                    participants: Array<{
                        __typename?: 'Participant';
                        image?: string | null;
                        name: string;
                    }>;
                }>;
            }>;
        }>;
    }>;
};








// GamesQuery

export type GamesQuery = {
    __typename?: 'Query';
    games: Array<{
        __typename?: 'Game';
        id: string;
        gameId: string;
        title?: string | null;
        startsAt: string;
        status: GameStatus;
        sport: {
            __typename?: 'Sport';
            sportId: string;
            slug: string;
            name: string;
        };
        league: {
            __typename?: 'League';
            slug: string;
            name: string;
            country: {
                __typename?: 'Country';
                slug: string;
                name: string;
            };
        };
        participants: Array<{
            __typename?: 'Participant';
            image?: string | null;
            name: string;
        }>;
    }>;
};