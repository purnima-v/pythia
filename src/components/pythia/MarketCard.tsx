import React, { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DistributionChart from './DistributionChart.tsx';

export type Market = {
  id: `0x${string}`;
  shortDescription: string;
  fullDescription: string;
  imageURL: string;
  hasExpirationDate: boolean;
  expirationDate: bigint;
  mean: bigint;
  standardDeviation: bigint;
  totalBacking: bigint;
  hasSettled: boolean;
  category: string;
  discreteOptions?: string[];
}

interface MarketCardProps {
  market: Market;
  mode: 'pro' | 'novice';
}

export default function MarketCard({ market, mode }: MarketCardProps) {
  const navigate = useNavigate();
  
  // Theme-specific classes
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-surface';
  const cardBorderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const cardHoverBorderColor = mode === 'pro' ? 'hover:border-poseidon-accent-cyan/70' : 'hover:border-light-accent-primary/70';
  const cardHoverShadow = mode === 'pro' ? 'hover:shadow-poseidon-accent-cyan/10' : 'hover:shadow-light-accent-primary/10';
  const categoryBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-accent-secondary/20';
  const categoryTextColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-secondary';
  const categoryRingColor = mode === 'pro' ? 'ring-poseidon-border' : 'ring-light-accent-secondary/30';
  const questionTextColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const mutedTextColor = mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted';
  const primaryTextColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const buttonBgColor = mode === 'pro' ? 'bg-poseidon-accent-cyan hover:bg-cyan-400' : 'bg-light-accent-primary hover:bg-blue-600';
  const buttonTextColor = mode === 'pro' ? 'text-poseidon-deep-blue' : 'text-white';

  // Generate distribution data based on mean and standard deviation
  const distributionData = [
    { x: Number(market.mean) - 2 * Number(market.standardDeviation), y: 0.1 },
    { x: Number(market.mean) - Number(market.standardDeviation), y: 0.3 },
    { x: Number(market.mean), y: 0.5 },
    { x: Number(market.mean) + Number(market.standardDeviation), y: 0.3 },
    { x: Number(market.mean) + 2 * Number(market.standardDeviation), y: 0.1 }
  ];

  // Hardcoded values for UI
  const volume = Number(market.totalBacking * 2n); // Example: volume is 2x total backing
  const liquidity = Number(market.totalBacking * 3n); // Example: liquidity is 3x total backing

  return (
    <div 
      className={`relative rounded-lg shadow-xl p-4 border font-sans ${cardBgColor} ${cardBorderColor} ${cardHoverBorderColor} ${cardHoverShadow} transition-all duration-300 flex flex-col justify-between min-h-0`}
    >
      {/* Category and Title */}
      <div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ring-1 mb-2 ${categoryBgColor} ${categoryTextColor} ${categoryRingColor}`}>
          {market.category}
        </span>
        <h3 className={`font-semibold text-base mb-2 min-h-[10px] ${questionTextColor}`}>
          {market.shortDescription}
        </h3>
        {/* Show discrete options as pills in novice mode */}
        {mode === 'novice' && market.discreteOptions && (
          <div className="flex flex-wrap gap-2 mb-2">
            {market.discreteOptions.map(option => (
              <span
                key={option}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-semibold"
              >
                {option}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Distribution Chart */}
      {mode === 'pro' && (
        <div className="w-full mb-4 mt-0" style={{ height: '200px' }}>
          <DistributionChart 
            data={distributionData} 
            mode={mode} 
            height={200} 
          />
        </div>
      )}

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className={`${mutedTextColor} text-xs`}>Volume:</p>
          <p className={`${primaryTextColor} font-medium text-sm`}>
            ${volume.toLocaleString()}
          </p>
        </div>
        <div>
          <p className={`${mutedTextColor} text-xs`}>Liquidity:</p>
          <p className={`${primaryTextColor} font-medium text-sm`}>
            ${liquidity.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Market End Date */}
      <p className={`text-xs ${mutedTextColor} mb-4`}>
        Market ends: {new Date(Number(market.expirationDate) * 1000).toLocaleDateString()}
      </p>

      {/* Open Market Button */}
      <button 
        onClick={() => navigate(`/market/${market.id}`)}
        className={`w-full font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${buttonBgColor} ${buttonTextColor}`}
      >
        Open Market
      </button>
    </div>
  );
} 