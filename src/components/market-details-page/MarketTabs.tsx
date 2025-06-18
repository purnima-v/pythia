import React from 'react';

type MarketTabsProps = {
  mode: 'pro' | 'novice';
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function MarketTabs({ mode, activeTab, onTabChange }: MarketTabsProps) {
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-card';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text';
  const borderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const subtleButtonBorder = mode === 'pro' ? 'border-poseidon-border/30' : 'border-light-border/30';

  return (
    <div className="mb-6">
      <div className={`flex border-b ${mode === 'pro' ? 'border-poseidon-border' : 'border-gray-200'}`}>
        {['Predict', 'Comments', 'Related'].map((tabName) => (
          <button
            key={tabName}
            onClick={() => onTabChange(tabName)}
            className={`py-2 px-4 font-semibold outline-none focus:outline-none ${
              activeTab === tabName
                ? (mode === 'pro' 
                    ? 'border-b-2 border-poseidon-accent-cyan text-poseidon-accent-cyan bg-transparent' 
                    : 'border-b-2 border-blue-400 text-blue-600 bg-transparent')
                : (mode === 'pro' 
                    ? `text-poseidon-light-text bg-transparent hover:text-poseidon-accent-cyan hover:border-b-2 hover:border-poseidon-accent-cyan/50 ${subtleButtonBorder}` 
                    : `text-gray-600 bg-transparent hover:text-blue-600 hover:border-b-2 hover:border-blue-400/50`)
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className={`mt-4 ${cardBgColor} rounded-lg shadow-md p-4`}>
        {activeTab === 'Predict' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Make Your Prediction</h3>
            <p className="text-sm text-gray-600 dark:text-poseidon-muted-text">
              Use the controls above to make your prediction.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-poseidon-muted-text space-y-2">
              <li>Adjust the slider to set your prediction range</li>
              <li>Enter specific mean and standard deviation values</li>
            </ul>
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comments</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${mode === 'pro' ? 'bg-poseidon-deep-blue border-poseidon-border' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full ${mode === 'pro' ? 'bg-poseidon-accent-cyan' : 'bg-blue-200'}`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">User Name</h4>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="mt-1 text-sm">This is a sample comment about the market prediction.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <textarea 
                className={`w-full p-3 rounded-lg border ${mode === 'pro' ? 'bg-poseidon-deep-blue border-poseidon-border text-poseidon-light-text' : 'bg-white border-gray-200 text-gray-900'}`}
                placeholder="Add your comment..."
                rows={3}
              ></textarea>
              <button className={`mt-2 px-4 py-2 rounded-lg ${mode === 'pro' ? 'bg-cyan-100 text-gray-800 hover:bg-cyan-200' : 'bg-blue-100 text-gray-800 hover:bg-blue-200'}`}>
                Post Comment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Related' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Related Markets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${mode === 'pro' ? 'border-poseidon-border bg-poseidon-deep-blue' : 'border-gray-200 bg-white'}`}>
                <h4 className="font-medium mb-2">Similar Market 1</h4>
                <p className="text-sm text-gray-600 dark:text-poseidon-muted-text">Related prediction market with similar context and timeframe.</p>
              </div>
              <div className={`p-4 rounded-lg border ${mode === 'pro' ? 'border-poseidon-border bg-poseidon-deep-blue' : 'border-gray-200 bg-white'}`}>
                <h4 className="font-medium mb-2">Similar Market 2</h4>
                <p className="text-sm text-gray-600 dark:text-poseidon-muted-text">Another related market that might interest you.</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Related News & Analysis</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className={`text-sm ${mode === 'pro' ? 'text-poseidon-accent-cyan hover:underline' : 'text-light-accent-primary hover:underline'}`}>
                    Market Analysis Report
                  </a>
                </li>
                <li>
                  <a href="#" className={`text-sm ${mode === 'pro' ? 'text-poseidon-accent-cyan hover:underline' : 'text-light-accent-primary hover:underline'}`}>
                    Industry News Article
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 