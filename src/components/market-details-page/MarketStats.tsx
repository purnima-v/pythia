import React from 'react';
import * as d3 from 'd3';

type Position = {
  id: string;
  mean: number;
  stdDev: number;
  collateral: number;
  timestamp: number;
};

type MarketStatsProps = {
  mode: 'pro' | 'novice';
  numericXData: number[];
  meanValue: number | null;
  stdDevValue: number | null;
  positions: Position[];
};

export default function MarketStats({
  mode,
  numericXData,
  meanValue,
  stdDevValue,
  positions
}: MarketStatsProps) {
  const tableHeaderBg = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-gray-50';
  const borderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';

  return (
    <div className="pt-4 text-sm">
      <table className={`w-full border-collapse ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
        <thead>
          <tr>
            <th className={`p-2 border-b font-normal text-left ${tableHeaderBg} ${borderColor}`}></th>
            <th className={`p-2 border-b font-normal text-center ${tableHeaderBg} ${borderColor}`}>Mean</th>
            <th className={`p-2 border-b font-normal text-center ${tableHeaderBg} ${borderColor}`}>Standard<br/>Deviation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`p-2 border-b ${borderColor}`}>Community</td>
            <td className={`p-2 border-b text-center ${borderColor}`}>
              {numericXData.length > 0 ? (d3.mean(numericXData)?.toFixed(2) ?? 'N/A') : 'N/A'}
            </td>
            <td className={`p-2 border-b text-center ${borderColor}`}>
              {numericXData.length > 0 ? (d3.deviation(numericXData)?.toFixed(2) ?? 'N/A') : 'N/A'}
            </td>
          </tr>
          <tr>
            <td className={`p-2 border-b ${borderColor}`}>My Prediction</td>
            <td className={`p-2 border-b text-center ${borderColor}`}>
              {meanValue?.toFixed(2) || 'N/A'}
            </td>
            <td className={`p-2 border-b text-center ${borderColor}`}>
              {stdDevValue?.toFixed(2) || 'N/A'}
            </td>
          </tr>
          {positions.map((position, index) => (
            <tr key={position.id}>
              <td className={`p-2 ${index === positions.length - 1 ? '' : 'border-b'} ${borderColor}`}>
                <div className="flex items-center gap-2">
                  <span>Position {positions.length - index}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    mode === 'pro' 
                      ? 'bg-poseidon-deep-blue text-poseidon-accent-cyan border border-poseidon-accent-cyan/70'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    ${position.collateral.toLocaleString()}
                  </span>
                </div>
              </td>
              <td className={`p-2 ${index === positions.length - 1 ? '' : 'border-b'} text-center ${borderColor}`}>
                {position.mean.toFixed(2)}
              </td>
              <td className={`p-2 ${index === positions.length - 1 ? '' : 'border-b'} text-center ${borderColor}`}>
                {position.stdDev.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 