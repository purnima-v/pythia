import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketCard, { type Market } from '../components/pythia/MarketCard.tsx';
import { useMode } from '../components/pythia/Layout.tsx';

// Mock Data for Markets - Export this
export const mockMarkets: Market[] = [
  {
    id: '1',
    question: 'ETH/USD price by EOD on July 30, 2024?',
    currentPrediction: 'Peak at 3500 USD',
    volume: '1.2M USD',
    liquidity: '500K USD',
    endDate: '2024-07-30',
    category: 'Crypto',
    distributionData: [
      { x: 3000, y: 0.1 }, { x: 3250, y: 0.3 }, { x: 3500, y: 0.5 }, { x: 3750, y: 0.3 }, { x: 4000, y: 0.1 },
    ],
    discreteOptions: ['< $3000', '$3000 - $3250', '$3251 - $3500', '$3501 - $3750', '> $3750']
  },
  {
    id: '2',
    question: 'Average global temperature anomaly for 2025?',
    currentPrediction: 'Centered at +1.5°C',
    volume: '300K USD',
    liquidity: '120K USD',
    endDate: '2025-12-31',
    category: 'Climate',
    distributionData: [
      { x: 1.2, y: 0.15 }, { x: 1.35, y: 0.3 }, { x: 1.5, y: 0.4 }, { x: 1.65, y: 0.3 }, { x: 1.8, y: 0.15 },
    ],
    discreteOptions: ['< +1.3°C', '+1.3°C to +1.49°C', '+1.5°C to +1.69°C', '> +1.7°C']
  },
  {
    id: '3',
    question: 'Expert consensus: Probability of AGI by 2030?',
    currentPrediction: 'Median: 25%',
    volume: '750K USD',
    liquidity: '200K USD',
    endDate: '2030-01-01',
    category: 'Technology',
    distributionData: [
      { x: 5, y: 0.3 }, { x: 15, y: 0.25 }, { x: 25, y: 0.2 }, { x: 35, y: 0.15 }, { x: 45, y: 0.1 },
    ],
    discreteOptions: ['0-10%', '11-20%', '21-30%', '31-40%', '> 40%']
  },
  {
    id: '4',
    question: 'Candidate A\'s popular vote % in 2024 US Election?',
    currentPrediction: 'Range: 44-46%',
    volume: '2.5M USD',
    liquidity: '800K USD',
    endDate: '2024-11-05',
    category: 'Politics',
    distributionData: [
      { x: 42, y: 0.1 }, { x: 43, y: 0.2 }, { x: 44, y: 0.3 }, { x: 45, y: 0.25 }, { x: 46, y: 0.15 },
    ],
    discreteOptions: ['< 43%', '43.0-43.9%', '44.0-44.9%', '45.0-45.9%', '> 46%']
  },
  {
    id: '5',
    question: 'What will be the US inflation rate (CPI y-o-y) for Q4 2024?',
    currentPrediction: 'Most likely 2.8-3.2%',
    volume: '500K USD',
    liquidity: '150K USD',
    endDate: '2025-01-15',
    category: 'Economics',
    distributionData: [
      { x: 2.5, y: 0.1 }, { x: 2.8, y: 0.3 }, { x: 3.0, y: 0.4 }, { x: 3.2, y: 0.15 }, { x: 3.5, y: 0.05 },
    ],
    discreteOptions: ['< 2.7%', '2.7-2.9%', '3.0-3.2%', '3.3-3.5%', '> 3.5%']
  },
  {
    id: '6',
    question: 'Probability of a manned Mars mission launch by 2035?',
    currentPrediction: 'Low, peak at 10%',
    volume: '450K USD',
    liquidity: '100K USD',
    endDate: '2035-12-31',
    category: 'Space',
    distributionData: [
      { x: 2.5, y: 0.4 }, { x: 7.5, y: 0.3 }, { x: 12.5, y: 0.2 }, { x: 17.5, y: 0.05 }, { x: 22.5, y: 0.05 },
    ],
    discreteOptions: ['0-5%', '6-10%', '11-15%', '16-20%', '> 20%']
  },
  {
    id: '7',
    question: 'Rotten Tomatoes score for \'Movie Title X\' on release week?',
    currentPrediction: 'Likely 60-80%',
    volume: '200K USD',
    liquidity: '80K USD',
    endDate: '2025-03-10',
    category: 'Entertainment',
    distributionData: [
      { x: 10, y: 0.05 }, { x: 30, y: 0.15 }, { x: 50, y: 0.3 }, { x: 70, y: 0.35 }, { x: 90, y: 0.15 },
    ],
    discreteOptions: ['0-39%', '40-59%', '60-79%', '80-100%']
  },
  {
    id: '8',
    question: 'What will be Apple (AAPL) stock peak price in 2024?',
    currentPrediction: 'Expected peak $240-$260',
    volume: '900K USD',
    liquidity: '300K USD',
    endDate: '2024-12-31',
    category: 'Stocks',
    distributionData: [
      { x: 220, y: 0.1 }, { x: 230, y: 0.2 }, { x: 240, y: 0.3 }, { x: 250, y: 0.25 }, { x: 260, y: 0.15 },
    ],
    discreteOptions: ['< $230', '$230-$239', '$240-$249', '$250-$259', '> $260']
  },
  {
    id: '9',
    question: 'Goals scored by winning team in next FIFA World Cup final?',
    currentPrediction: 'Most likely 2 or 3',
    volume: '1.8M USD',
    liquidity: '600K USD',
    endDate: '2026-07-19',
    category: 'Sports',
    distributionData: [
      { x: 1, y: 0.2 }, { x: 2, y: 0.35 }, { x: 3, y: 0.3 }, { x: 4, y: 0.1 }, { x: 5, y: 0.05 },
    ],
    discreteOptions: ['0 goals', '1 goal', '2 goals', '3 goals', '4+ goals']
  },
  {
    id: '10',
    question: 'Community odds: QC breaks RSA-2048 by 2030?',
    currentPrediction: 'Low, tail risk',
    volume: '600K USD',
    liquidity: '180K USD',
    endDate: '2030-01-01',
    category: 'Technology',
    distributionData: [
      { x: 2.5, y: 0.6 }, { x: 7.5, y: 0.25 }, { x: 12.5, y: 0.1 }, { x: 17.5, y: 0.03 }, { x: 22.5, y: 0.02 },
    ],
    discreteOptions: ['0-5% chance', '5-10% chance', '10-20% chance', '> 20% chance']
  },
  {
    id: '11',
    question: 'Global EV market share by 2028?',
    currentPrediction: 'Likely 22-28%',
    volume: '700K USD',
    liquidity: '220K USD',
    endDate: '2028-12-31',
    category: 'Automotive',
    distributionData: [
      { x: 15, y: 0.1 }, { x: 20, y: 0.25 }, { x: 25, y: 0.35 }, { x: 30, y: 0.2 }, { x: 35, y: 0.1 },
    ],
    discreteOptions: ['< 20%', '20-24%', '25-29%', '30-34%', '> 35%']
  },
  {
    id: '12',
    question: 'Will fusion energy contribute to the power grid by 2040?',
    currentPrediction: 'Small chance, peak 15-25% prob.',
    volume: '400K USD',
    liquidity: '90K USD',
    endDate: '2040-01-01',
    category: 'Energy',
    distributionData: [
      { x: 5, y: 0.4 }, { x: 15, y: 0.3 }, { x: 25, y: 0.2 }, { x: 35, y: 0.07 }, { x: 45, y: 0.03 },
    ],
    discreteOptions: ['No (0-10% chance)', 'Unlikely (10-20% chance)', 'Possible (20-30% chance)', 'Likely (>30% chance)']
  },
  {
    id: '13',
    question: 'Earth\'s population in 2050 (UN estimates)?',
    currentPrediction: 'Median ~9.7 Billion',
    volume: '150K USD',
    liquidity: '50K USD',
    endDate: '2050-01-01',
    category: 'Demographics',
    distributionData: [
      { x: 9.4, y: 0.15 }, { x: 9.55, y: 0.3 }, { x: 9.7, y: 0.35 }, { x: 9.85, y: 0.15 }, { x: 10.0, y: 0.05 },
    ],
    discreteOptions: ['< 9.5B', '9.5B - 9.69B', '9.7B - 9.89B', '> 9.9B']
  },
  {
    id: '14',
    question: 'Will commercial space tourism to the Moon be available by 2035?',
    currentPrediction: 'Very low, peak 5% prob.',
    volume: '320K USD',
    liquidity: '70K USD',
    endDate: '2035-01-01',
    category: 'Space',
    distributionData: [
      { x: 1, y: 0.5 }, { x: 3.5, y: 0.3 }, { x: 6.5, y: 0.15 }, { x: 9, y: 0.03 }, { x: 12, y: 0.02 },
    ],
    discreteOptions: ['Extremely Unlikely (0-2%)', 'Very Unlikely (2-5%)', 'Unlikely (5-10%)', 'Possible (>10%)']
  },
  {
    id: '15',
    question: 'What will be the price of Bitcoin (BTC) at EOY 2025?',
    currentPrediction: 'Median Estimate $150k',
    volume: '3.1M USD',
    liquidity: '1.1M USD',
    endDate: '2025-12-31',
    category: 'Crypto',
    distributionData: [
      { x: 75000, y: 0.1 }, { x: 100000, y: 0.2 }, { x: 150000, y: 0.35 }, { x: 200000, y: 0.25 }, { x: 250000, y: 0.1 },
    ],
    discreteOptions: ['< $100k', '$100k - $149k', '$150k - $199k', '$200k - $249k', '> $250k']
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