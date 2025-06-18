import React from 'react';

type MarketInfoProps = {
  mode: 'pro' | 'novice';
  market: {
    fullDescription?: string;
    expirationDate?: number;
    hasSettled?: boolean;
    category?: string;
  } | null;
  onResolveClick: () => void;
};

export default function MarketInfo({ mode, market, onResolveClick }: MarketInfoProps) {
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-card';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text';
  const borderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';

  return (
    <div className="space-y-6">
      {/* Market Details */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
        <h2 className="text-xl font-semibold mb-3">Market Details</h2>
        <p className="text-sm leading-relaxed">
          {market?.fullDescription || "Detailed description for this market will be displayed here. This section can include resolution criteria, methodology, and other relevant information to help users make informed predictions."}
        </p>
      </div>

      {/* Market Info Box */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
        <h3 className="text-lg font-semibold mb-3">Market Info</h3>
        <ul className="space-y-1 text-sm">
          <li><strong>Resolution Criteria:</strong> To be defined.</li>
          <li>
            <strong>Ends:</strong>{' '}
            {market?.expirationDate
              ? new Date(Number(market.expirationDate) * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'TBD'}
          </li>
          <li><strong>Source:</strong> Official Pythia Oracle</li>
          <li className="mt-4">
            {market?.hasSettled ? (
              <div className={`inline-block px-4 py-2 rounded ${
                mode === 'pro' 
                  ? 'bg-poseidon-deep-blue text-poseidon-light-text border border-poseidon-border' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}>
                Market Resolved
              </div>
            ) : (
              <button
                onClick={onResolveClick}
                className={`inline-block px-4 py-2 rounded ${
                  mode === 'pro' 
                    ? 'bg-poseidon-accent-cyan text-gray-800 hover:bg-cyan-400' 
                    : 'bg-blue-200 text-gray-800 hover:bg-blue-300'
                } transition-colors`}
              >
                Resolve Market
              </button>
            )}
          </li>
        </ul>
      </div>

      {/* Authors & Group Box */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
        <h3 className="text-lg font-semibold mb-3">Authors & Group</h3>
        <p className="text-sm">Created by Pythia Admin.</p>
      </div>

      {/* Tags Box */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
        <h3 className="text-lg font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {market?.category && (
            <span className={`px-2 py-1 text-xs rounded-full ${mode === 'pro' ? `bg-poseidon-deep-blue text-poseidon-accent-cyan border border-poseidon-accent-cyan/70` : `bg-light-hover text-light-accent border border-light-accent/70`}`}>
              {market?.category}
            </span>
          )}
          <span className={`px-2 py-1 text-xs rounded-full ${mode === 'pro' ? `bg-poseidon-deep-blue text-poseidon-accent-cyan border border-poseidon-accent-cyan/70` : `bg-light-hover text-light-accent border border-light-accent/70`}`}>
            Forecast
          </span>
        </div>
      </div>
      
      {/* News & Analysis */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
        <h3 className="text-lg font-semibold mb-3">News & Analysis</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className={`${mode === 'pro' ? 'text-poseidon-accent-cyan hover:underline' : 'text-light-accent hover:underline'}`}>Related News Article 1</a></li>
          <li><a href="#" className={`${mode === 'pro' ? 'text-poseidon-accent-cyan hover:underline' : 'text-light-accent hover:underline'}`}>Analysis Blog Post</a></li>
        </ul>
      </div>
    </div>
  );
} 