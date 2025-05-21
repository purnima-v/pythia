import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketCard, { type Market } from '../components/pythia/MarketCard.tsx';
import { useMode } from '../components/pythia/Layout.tsx';

// Mock Data for Markets
export const mockMarkets: Market[] = [
  {
    id: '0x1' as `0x${string}`,
    shortDescription: 'ETH/USD price by EOD on July 30, 2024?',
    fullDescription: 'What will be the ETH/USD price at the end of day on July 30, 2024?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2024-07-30').getTime() / 1000),
    mean: BigInt(3500),
    standardDeviation: BigInt(250),
    totalBacking: BigInt(1200000),
    hasSettled: false,
    category: 'Crypto'
  },
  {
    id: '0x2' as `0x${string}`,
    shortDescription: 'Average global temperature anomaly for 2025?',
    fullDescription: 'What will be the average global temperature anomaly for the year 2025?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2025-12-31').getTime() / 1000),
    mean: BigInt(150),
    standardDeviation: BigInt(25),
    totalBacking: BigInt(300000),
    hasSettled: false,
    category: 'Climate'
  },
  {
    id: '0x3' as `0x${string}`,
    shortDescription: 'Expert consensus: Probability of AGI by 2030?',
    fullDescription: 'What is the expert consensus on the probability of achieving AGI by 2030?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2030-01-01').getTime() / 1000),
    mean: BigInt(25),
    standardDeviation: BigInt(10),
    totalBacking: BigInt(750000),
    hasSettled: false,
    category: 'Technology'
  },
  {
    id: '0x4' as `0x${string}`,
    shortDescription: 'Candidate A\'s popular vote % in 2024 US Election?',
    fullDescription: 'What percentage of the popular vote will Candidate A receive in the 2024 US Election?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2024-11-05').getTime() / 1000),
    mean: BigInt(45),
    standardDeviation: BigInt(2),
    totalBacking: BigInt(2500000),
    hasSettled: false,
    category: 'Politics'
  },
  {
    id: '0x5' as `0x${string}`,
    shortDescription: 'US inflation rate (CPI y-o-y) for Q4 2024?',
    fullDescription: 'What will be the US inflation rate (CPI year-over-year) for Q4 2024?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2025-01-15').getTime() / 1000),
    mean: BigInt(30),
    standardDeviation: BigInt(5),
    totalBacking: BigInt(500000),
    hasSettled: false,
    category: 'Economics'
  },
  {
    id: '0x6' as `0x${string}`,
    shortDescription: 'Probability of a manned Mars mission launch by 2035?',
    fullDescription: 'What is the probability of a successful manned Mars mission launch by 2035?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2035-12-31').getTime() / 1000),
    mean: BigInt(10),
    standardDeviation: BigInt(5),
    totalBacking: BigInt(450000),
    hasSettled: false,
    category: 'Space'
  },
  {
    id: '0x7' as `0x${string}`,
    shortDescription: 'Rotten Tomatoes score for \'Movie Title X\' on release week?',
    fullDescription: 'What will be the Rotten Tomatoes score for \'Movie Title X\' during its release week?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2025-03-10').getTime() / 1000),
    mean: BigInt(70),
    standardDeviation: BigInt(20),
    totalBacking: BigInt(200000),
    hasSettled: false,
    category: 'Entertainment'
  },
  {
    id: '0x8' as `0x${string}`,
    shortDescription: 'What will be Apple (AAPL) stock peak price in 2024?',
    fullDescription: 'What will be the peak price of Apple (AAPL) stock during 2024?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2024-12-31').getTime() / 1000),
    mean: BigInt(240),
    standardDeviation: BigInt(15),
    totalBacking: BigInt(900000),
    hasSettled: false,
    category: 'Stocks'
  },
  {
    id: '0x9' as `0x${string}`,
    shortDescription: 'Goals scored by winning team in next FIFA World Cup final?',
    fullDescription: 'How many goals will the winning team score in the next FIFA World Cup final?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2026-07-19').getTime() / 1000),
    mean: BigInt(2),
    standardDeviation: BigInt(1),
    totalBacking: BigInt(1800000),
    hasSettled: false,
    category: 'Sports'
  },
  {
    id: '0x10' as `0x${string}`,
    shortDescription: 'Community odds: QC breaks RSA-2048 by 2030?',
    fullDescription: 'What are the community odds that quantum computing will break RSA-2048 by 2030?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2030-01-01').getTime() / 1000),
    mean: BigInt(10),
    standardDeviation: BigInt(5),
    totalBacking: BigInt(600000),
    hasSettled: false,
    category: 'Technology'
  },
  {
    id: '0x11' as `0x${string}`,
    shortDescription: 'Global EV market share by 2028?',
    fullDescription: 'What will be the global electric vehicle market share by 2028?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2028-12-31').getTime() / 1000),
    mean: BigInt(25),
    standardDeviation: BigInt(5),
    totalBacking: BigInt(700000),
    hasSettled: false,
    category: 'Automotive'
  },
  {
    id: '0x12' as `0x${string}`,
    shortDescription: 'Will fusion energy contribute to the power grid by 2040?',
    fullDescription: 'What is the probability that fusion energy will contribute to the power grid by 2040?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2040-01-01').getTime() / 1000),
    mean: BigInt(20),
    standardDeviation: BigInt(10),
    totalBacking: BigInt(400000),
    hasSettled: false,
    category: 'Energy'
  },
  {
    id: '0x13' as `0x${string}`,
    shortDescription: 'Earth\'s population in 2050 (UN estimates)?',
    fullDescription: 'What will be Earth\'s population in 2050 according to UN estimates?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2050-01-01').getTime() / 1000),
    mean: BigInt(9700),
    standardDeviation: BigInt(150),
    totalBacking: BigInt(150000),
    hasSettled: false,
    category: 'Demographics'
  },
  {
    id: '0x14' as `0x${string}`,
    shortDescription: 'Will commercial space tourism to the Moon be available by 2035?',
    fullDescription: 'What is the probability that commercial space tourism to the Moon will be available by 2035?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2035-01-01').getTime() / 1000),
    mean: BigInt(5),
    standardDeviation: BigInt(3),
    totalBacking: BigInt(320000),
    hasSettled: false,
    category: 'Space'
  },
  {
    id: '0x15' as `0x${string}`,
    shortDescription: 'What will be the price of Bitcoin (BTC) at EOY 2025?',
    fullDescription: 'What will be the price of Bitcoin (BTC) at the end of 2025?',
    imageURL: '',
    hasExpirationDate: true,
    expirationDate: BigInt(new Date('2025-12-31').getTime() / 1000),
    mean: BigInt(150000),
    standardDeviation: BigInt(50000),
    totalBacking: BigInt(3100000),
    hasSettled: false,
    category: 'Crypto'
  }
];

export default function MarketsPage() {
  const { mode } = useMode();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const containerBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';

  const filteredMarkets = mockMarkets.filter(market => {
    if (!categoryFilter || categoryFilter === 'all') {
      return true;
    }
    return market.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className={`p-4 sm:p-6 md:p-8 min-h-screen ${containerBgColor}`}>
      {/* <h1 className={`text-4xl font-bold mb-8 text-center ${titleColor} font-serif`}>Whispers from the Depths</h1> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map(market => (
          <MarketCard key={market.id} market={market} mode={mode} />
        ))}
      </div>
    </div>
  );
} 