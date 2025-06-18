import React from 'react';
import MarketCard, { type Market } from '../pythia/MarketCard';

interface MarketGridProps {
  markets: Market[];
  mode: 'pro' | 'novice';
}

export default function MarketGrid({ markets, mode }: MarketGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map(market => (
        <MarketCard key={market.id} market={market} mode={mode} />
      ))}
    </div>
  );
} 