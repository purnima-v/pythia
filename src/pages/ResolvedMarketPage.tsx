import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMode } from '../components/pythia/Layout.tsx';
import DistributionChart from '../components/pythia/DistributionChart.tsx';
import { mockMarkets } from '../data/mockMarkets';

// Helper function to generate normal distribution data
const generateNormalData = (mean: number, stdDev: number, n: number = 100) => {
  const min = mean - 3 * stdDev;
  const max = mean + 3 * stdDev;
  const step = (max - min) / (n - 1);
  
  return Array.from({ length: n }, (_, i) => {
    const x = min + i * step;
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * stdDev * stdDev));
    return { x, y };
  });
};

export default function ResolvedMarketPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const { mode } = useMode();

  // Find the market data - in a real app, this would be an API call
  const market = mockMarkets.find(m => m.id === marketId);

  // Dummy resolved market data
  const resolvedMarket = market ? {
    ...market,
    status: 'resolved',
    resolutionDate: new Date('2024-03-15'),
    outcome: 42.5, // The actual outcome
    resolutionDetails: {
      source: 'Official Pythia Oracle',
      confidence: 'High',
      methodology: 'Direct measurement from verified data source',
      notes: 'The outcome was determined based on the official data release from the source.'
    },
    userPrediction: {
      mean: 41.2,
      stdDev: 2.5,
      confidence: 0.85,
      reward: 120, // Amount earned/lost
      rank: 15, // User's rank among all participants
      totalParticipants: 156
    },
    communityStats: {
      mean: 43.1,
      stdDev: 3.2,
      closestPredictor: {
        name: 'TopPredictor',
        prediction: 42.3,
        reward: 500
      }
    },
    distributionData: generateNormalData(43.1, 3.2) // Generate distribution data for community stats
  } : null;

  if (!resolvedMarket) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-poseidon-deep-blue text-poseidon-light-text">
        <h1 className="text-2xl font-bold mb-6">Market not found</h1>
        <Link to="/markets" className="text-poseidon-accent-cyan hover:underline">
          Return to Markets
        </Link>
      </div>
    );
  }

  const bgColor = mode === 'pro' ? 'bg-poseidon-dark-blue' : 'bg-light-background';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text';
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-card';
  const borderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const accentColor = mode === 'pro' ? 'bg-poseidon-accent-cyan' : 'bg-light-accent';
  const successColor = mode === 'pro' ? 'text-green-400' : 'text-green-600';
  const warningColor = mode === 'pro' ? 'text-yellow-400' : 'text-yellow-600';

  return (
    <div className={`p-4 sm:p-6 md:p-8 min-h-screen ${bgColor}`}>
      <div className="max-w-7xl mx-auto">
        <Link to="/markets" className={`inline-block mb-6 ${textColor} hover:underline`}>
          ← Back to Markets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chart and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Question */}
            <div className={`p-6 rounded-lg ${cardBgColor} border ${borderColor}`}>
              <h1 className={`text-2xl font-bold mb-4 ${textColor}`}>
                {resolvedMarket.shortDescription}
              </h1>
              <p className={`text-sm ${textColor} opacity-80`}>
                {resolvedMarket.fullDescription}
              </p>
            </div>

            {/* Distribution Chart */}
            <div className={`p-6 rounded-lg ${cardBgColor} border ${borderColor}`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Market Distribution</h2>
              <div className="h-64">
                <DistributionChart
                  data={resolvedMarket.distributionData || []}
                  mode={mode}
                  meanValue={resolvedMarket.userPrediction.mean}
                  stdDevValue={resolvedMarket.userPrediction.stdDev}
                  showOutcome={true}
                  outcome={resolvedMarket.outcome}
                />
              </div>
            </div>

            {/* Resolution Details */}
            <div className={`p-6 rounded-lg ${cardBgColor} border ${borderColor}`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Resolution Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Final Outcome</h3>
                  <p className={`text-2xl font-bold ${accentColor}`}>
                    {resolvedMarket.outcome}
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Resolution Date</h3>
                  <p className={textColor}>
                    {resolvedMarket.resolutionDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Source</h3>
                  <p className={textColor}>{resolvedMarket.resolutionDetails.source}</p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Methodology</h3>
                  <p className={textColor}>{resolvedMarket.resolutionDetails.methodology}</p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Notes</h3>
                  <p className={textColor}>{resolvedMarket.resolutionDetails.notes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats and User Results */}
          <div className="space-y-6">
            {/* User's Prediction Results */}
            <div className={`p-6 rounded-lg ${cardBgColor} border ${borderColor}`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Your Results</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Your Prediction</h3>
                  <p className={`text-2xl font-bold ${textColor}`}>
                    {resolvedMarket.userPrediction.mean.toFixed(1)}
                  </p>
                  <p className={`text-sm ${textColor} opacity-80`}>
                    ±{resolvedMarket.userPrediction.stdDev.toFixed(1)}
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Reward</h3>
                  <p className={`text-2xl font-bold ${resolvedMarket.userPrediction.reward >= 0 ? successColor : warningColor}`}>
                    {resolvedMarket.userPrediction.reward >= 0 ? '+' : ''}
                    ${resolvedMarket.userPrediction.reward.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Rank</h3>
                  <p className={`text-2xl font-bold ${textColor}`}>
                    #{resolvedMarket.userPrediction.rank}
                  </p>
                  <p className={`text-sm ${textColor} opacity-80`}>
                    of {resolvedMarket.userPrediction.totalParticipants} participants
                  </p>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className={`p-6 rounded-lg ${cardBgColor} border ${borderColor}`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Community Stats</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Community Mean</h3>
                  <p className={`text-2xl font-bold ${textColor}`}>
                    {resolvedMarket.communityStats.mean.toFixed(1)}
                  </p>
                  <p className={`text-sm ${textColor} opacity-80`}>
                    ±{resolvedMarket.communityStats.stdDev.toFixed(1)}
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Closest Predictor</h3>
                  <p className={`text-xl font-bold ${textColor}`}>
                    {resolvedMarket.communityStats.closestPredictor.name}
                  </p>
                  <p className={`text-sm ${textColor} opacity-80`}>
                    Prediction: {resolvedMarket.communityStats.closestPredictor.prediction.toFixed(1)}
                  </p>
                  <p className={`text-sm ${successColor}`}>
                    Reward: ${resolvedMarket.communityStats.closestPredictor.reward.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 