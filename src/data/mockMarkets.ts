import { type Market } from '../components/pythia/MarketCard';
import { randomNormal } from 'd3-random';

// helper to generate a normal distribution of x-values
function makeNormalData(mu: number, sigma: number, n = 200) {
  const sampler = randomNormal(mu, sigma);
  return Array.from({ length: n }, () => ({ x: sampler() }));
}

// Mock Data for Markets, now with distributionData
export const mockMarkets: Array<Market & { distributionData?: { x: number }[] }> = [
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
    category: 'Crypto',
    chain: 'Chain A',
    distributionData: makeNormalData(3500, 250)
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
    category: 'Climate',
    chain: 'Chain B',
    distributionData: makeNormalData(150, 25)
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
    category: 'Economics',
    chain: 'Chain A',
    distributionData: makeNormalData(30, 5)
  }
]; 