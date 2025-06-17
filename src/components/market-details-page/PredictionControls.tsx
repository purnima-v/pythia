import React from 'react';
import * as d3 from 'd3';

type Position = {
  id: string;
  mean: number;
  stdDev: number;
  collateral: number;
  timestamp: number;
};

type PredictionControlsProps = {
  mode: 'pro' | 'novice';
  collateralInput: string;
  setCollateralInput: (value: string) => void;
  isCollateralSufficient: boolean;
  isPlacingBet: boolean;
  isMarketResolving: boolean;
  requiredCollateral: number;
  meanValue: number | null;
  stdDevValue: number | null;
  numericXData: number[];
  positions: Position[];
  onPlaceBet: () => void;
};

export default function PredictionControls({
  mode,
  collateralInput,
  setCollateralInput,
  isCollateralSufficient,
  isPlacingBet,
  isMarketResolving,
  requiredCollateral,
  meanValue,
  stdDevValue,
  numericXData,
  positions,
  onPlaceBet
}: PredictionControlsProps) {
  const isPro = mode === 'pro';

  const textColor = isPro ? 'text-poseidon-light-text' : 'text-light-text';
  const cardBgColor = isPro ? 'bg-poseidon-mid-blue' : 'bg-light-card';
  const borderColor = isPro ? 'border-poseidon-border' : 'border-light-border';
  const tableHeaderBg = isPro ? 'bg-poseidon-deep-blue/60' : 'bg-light-hover';

  return (
    <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
      <h2 className="text-xl font-semibold mb-4">Make a Prediction</h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="collateral-input" className="block text-sm mb-1">Your Collateral</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">$</span>
            <input
              id="collateral-input"
              type="number"
              value={collateralInput}
              onChange={(e) => setCollateralInput(e.target.value)}
              placeholder="Enter amount"
              disabled={isMarketResolving}
              className={`w-full pl-7 pr-2 py-2 rounded border text-sm ${isPro
                ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border'
                : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
        </div>
        <div className="flex-1 flex items-end">
          <button
            disabled={!isCollateralSufficient || isPlacingBet || isMarketResolving}
            onClick={onPlaceBet}
            className={`w-full py-2 rounded font-semibold transition-colors ${
              isCollateralSufficient && !isPlacingBet && !isMarketResolving
                ? `${isPro ? 'bg-cyan-100 text-gray-800 hover:bg-cyan-200' : 'bg-blue-100 text-gray-800 hover:bg-blue-200'}`
                : 'bg-gray-100 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isPlacingBet ? 'Placing...' : 'Place Bet'}
          </button>
        </div>
      </div>

      {/* Summary Table */}
      <table className={`w-full text-sm border-collapse ${borderColor}`}>
        <thead>
          <tr>
            <th className={`p-2 text-left font-medium ${tableHeaderBg} ${borderColor}`}></th>
            <th className={`p-2 text-center font-medium ${tableHeaderBg} ${borderColor}`}>Mean</th>
            <th className={`p-2 text-center font-medium ${tableHeaderBg} ${borderColor}`}>Std Dev</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`p-2 ${borderColor}`}>Community</td>
            <td className={`p-2 text-center ${borderColor}`}>{numericXData.length ? d3.mean(numericXData)?.toFixed(2) : 'N/A'}</td>
            <td className={`p-2 text-center ${borderColor}`}>{numericXData.length ? d3.deviation(numericXData)?.toFixed(2) : 'N/A'}</td>
          </tr>
          <tr>
            <td className={`p-2 ${borderColor}`}>Your Prediction</td>
            <td className={`p-2 text-center ${borderColor}`}>{meanValue?.toFixed(2) ?? 'N/A'}</td>
            <td className={`p-2 text-center ${borderColor}`}>{stdDevValue?.toFixed(2) ?? 'N/A'}</td>
          </tr>
          {positions.map((pos, idx) => (
            <tr key={pos.id}>
              <td className={`p-2 ${borderColor}`}>
                Position {positions.length - idx}
              </td>
              <td className={`p-2 text-center ${borderColor}`}>{pos.mean.toFixed(2)}</td>
              <td className={`p-2 text-center ${borderColor}`}>{pos.stdDev.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
