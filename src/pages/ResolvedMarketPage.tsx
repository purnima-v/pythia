import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMode } from '../components/pythia/Layout.tsx';
import DistributionChart from '../components/pythia/DistributionChart.tsx';
import { mockMarkets } from './MarketsPage.tsx';

export default function ResolvedMarketPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const { mode } = useMode();

  // Find the market data - in a real app, this would be an API call
  const market = mockMarkets.find(m => m.id === marketId);

  // Dummy resolved market data
  const resolvedMarket = {
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
      rank: 15, // User's rank among all predictors
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
    }
  };

  const bgColor = mode === 'pro' ? 'bg-poseidon-dark-blue' : 'bg-light-background';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text';
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-card';
  const borderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const accentColor = mode === 'pro' ? 'bg-poseidon-accent-cyan' : 'bg-light-accent';
  const successColor = mode === 'pro' ? 'text-green-400' : 'text-green-600';
  const warningColor = mode === 'pro' ? 'text-yellow-400' : 'text-yellow-600';

  if (!resolvedMarket) {
    return <div className={`p-4 ${textColor}`}>Market not found</div>;
  }

  return (
    <div className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${bgColor} ${textColor} font-serif`}>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:w-2/3 w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">{resolvedMarket.question}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${successColor} bg-opacity-10 ${mode === 'pro' ? 'bg-green-400' : 'bg-green-100'}`}>
              Resolved
            </span>
          </div>

          {/* Outcome Banner */}
          <div className={`p-6 rounded-lg shadow-md mb-6 ${cardBgColor} border ${borderColor}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Market Outcome</h2>
                <p className="text-3xl font-bold">{resolvedMarket.outcome}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm opacity-75">Your Prediction</p>
                  <p className="text-xl font-semibold">{resolvedMarket.userPrediction.mean}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-75">Community Mean</p>
                  <p className="text-xl font-semibold">{resolvedMarket.communityStats.mean}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Chart */}
          {resolvedMarket.distributionData && (
            <div className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${cardBgColor}`}>
              <h2 className="text-xl font-semibold mb-4">Final Distribution</h2>
              <div className="h-80 md:h-80 lg:h-96 w-full" style={{ minHeight: '350px' }}>
                <DistributionChart
                  data={resolvedMarket.distributionData}
                  mode={mode}
                  showOutcome={true}
                  outcome={resolvedMarket.outcome}
                  height={420}
                />
              </div>
            </div>
          )}

          {/* Resolution Details */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${cardBgColor}`}>
            <h2 className="text-xl font-semibold mb-4">Resolution Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Resolution Source</h3>
                <p className="text-sm">{resolvedMarket.resolutionDetails.source}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Methodology</h3>
                <p className="text-sm">{resolvedMarket.resolutionDetails.methodology}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm">{resolvedMarket.resolutionDetails.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 w-full space-y-6">
          {/* Your Results */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h2 className="text-xl font-semibold mb-4">Your Results</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Reward</span>
                <span className={`font-semibold ${resolvedMarket.userPrediction.reward >= 0 ? successColor : warningColor}`}>
                  {resolvedMarket.userPrediction.reward >= 0 ? '+' : ''}{resolvedMarket.userPrediction.reward} USDC
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rank</span>
                <span className="font-semibold">
                  #{resolvedMarket.userPrediction.rank} of {resolvedMarket.userPrediction.totalParticipants}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prediction Accuracy</span>
                <span className="font-semibold">
                  {Math.abs(resolvedMarket.outcome - resolvedMarket.userPrediction.mean).toFixed(2)} units off
                </span>
              </div>
            </div>
          </div>

          {/* Top Predictor */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h2 className="text-xl font-semibold mb-4">Top Predictor</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Name</span>
                <span className="font-semibold">{resolvedMarket.communityStats.closestPredictor.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prediction</span>
                <span className="font-semibold">{resolvedMarket.communityStats.closestPredictor.prediction}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reward</span>
                <span className={`font-semibold ${successColor}`}>
                  +{resolvedMarket.communityStats.closestPredictor.reward} USDC
                </span>
              </div>
            </div>
          </div>

          {/* Market Info */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h2 className="text-xl font-semibold mb-4">Market Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Resolution Date</span>
                <span>{resolvedMarket.resolutionDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Participants</span>
                <span>{resolvedMarket.userPrediction.totalParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span>Category</span>
                <span>{resolvedMarket.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 