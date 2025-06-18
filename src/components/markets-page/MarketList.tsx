import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMode } from '../pythia/Layout';
import MarketGrid from './MarketGrid';
import { mockMarkets } from '../../data/mockMarkets';

export default function MarketList() {
  const { mode } = useMode();
  const location = useLocation();
  const urlSearchParams = new window.URLSearchParams(location.search);
  const categoryFilter = urlSearchParams.get('category');

  const containerBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';

  const filteredMarkets = mockMarkets.filter(market => {
    if (!categoryFilter || categoryFilter === 'all') {
      return true;
    }
    return market.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className={`p-4 sm:p-6 md:p-8 min-h-screen ${containerBgColor}`}>
      <MarketGrid markets={filteredMarkets} mode={mode} />
    </div>
  );
} 