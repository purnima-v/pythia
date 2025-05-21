import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketCard, { type Market } from '../components/pythia/MarketCard';
import { useMode } from '../components/pythia/Layout';
import { mockMarkets } from './MarketsPage';

export default function SearchResultsPage() {
  const { mode } = useMode();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const containerBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';

  // Filter markets based on search query
  const filteredMarkets = mockMarkets.filter(market => {
    const searchableText = [
      market.question,
      market.category,
      market.currentPrediction,
      market.discreteOptions?.join(' ')
    ].join(' ').toLowerCase();
    
    return searchableText.includes(query);
  });

  return (
    <div className={`p-4 sm:p-6 md:p-8 min-h-screen ${containerBgColor}`}>
      <h1 className={`text-2xl font-bold mb-6 ${textColor}`}>
        Search Results for "{query}"
      </h1>
      
      {filteredMarkets.length === 0 ? (
        <div className={`text-center py-12 ${textColor}`}>
          <p className="text-lg">No markets found matching your search.</p>
          <p className="text-sm mt-2">Try different keywords or browse all markets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map(market => (
            <MarketCard key={market.id} market={market} mode={mode} />
          ))}
        </div>
      )}
    </div>
  );
} 