import React from 'react';

type MarketResolutionProps = {
  mode: 'pro' | 'novice';
  showModal: boolean;
  isResolving: boolean;
  finalValue: string;
  onClose: () => void;
  onResolve: () => void;
  onFinalValueChange: (value: string) => void;
};

export default function MarketResolution({
  mode,
  showModal,
  isResolving,
  finalValue,
  onClose,
  onResolve,
  onFinalValueChange
}: MarketResolutionProps) {
  if (!showModal && !isResolving) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-lg ${mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-white'} max-w-md w-full`}>
        {isResolving ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Resolving Market</h3>
            <p className="text-sm mb-4">Please wait while the market is being resolved...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-poseidon-accent-cyan mx-auto"></div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Resolve Market</h3>
            <div className="mb-4">
              <label htmlFor="final-value" className="block text-sm mb-2">Final Value</label>
              <input
                id="final-value"
                type="number"
                value={finalValue}
                onChange={(e) => onFinalValueChange(e.target.value)}
                className={`w-full p-2 rounded border ${
                  mode === 'pro' 
                    ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="Enter final value"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded ${
                  mode === 'pro' 
                    ? 'bg-poseidon-deep-blue text-poseidon-light-text border border-poseidon-border' 
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={onResolve}
                disabled={!finalValue || isResolving}
                className={`px-4 py-2 rounded ${
                  mode === 'pro' 
                    ? 'bg-poseidon-accent-cyan text-gray-800 hover:bg-cyan-400' 
                    : 'bg-blue-200 text-gray-800 hover:bg-blue-300'
                } ${(!finalValue || isResolving) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isResolving ? 'Resolving...' : 'Confirm Resolution'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 