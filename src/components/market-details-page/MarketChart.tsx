import React from 'react';
import DistributionChart from '../pythia/DistributionChart';
import MultiSlider from '../sliders/MultiSlider';

type MarketChartProps = {
  mode: 'pro' | 'novice';
  series: { x: number; y: number }[];
  meanValue: number | null;
  stdDevValue: number | null;
  sliderValues: {
    left: number;
    center: number;
    right: number;
  };
  minX: number;
  maxX: number;
  onSliderChange: (newValues: { left: number; center: number; right: number }) => void;
  isMarketResolving?: boolean;
};

export default function MarketChart({
  mode,
  series,
  meanValue,
  stdDevValue,
  sliderValues,
  minX,
  maxX,
  onSliderChange,
  isMarketResolving = false
}: MarketChartProps) {
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-card';

  if (mode !== 'pro' || !series.length) return null;

  // Handle mean input changes
  const handleMeanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : Number(e.target.value);
    if (val !== null && stdDevValue !== null && !isNaN(val)) {
      onSliderChange({
        left: val - stdDevValue,
        center: val,
        right: val + stdDevValue
      });
    }
  };

  // Handle stdDev input changes
  const handleStdDevChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : Number(e.target.value);
    if (val !== null && meanValue !== null && !isNaN(val) && val > 0) {
      onSliderChange({
        left: meanValue - val,
        center: meanValue,
        right: meanValue + val
      });
    }
  };

  return (
    <>
      {/* Distribution Chart */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
        <h2 className="text-xl font-semibold mb-4">Community Prediction</h2>
        <div className="h-80 w-full" style={{ minHeight: '350px' }}>
          <DistributionChart
            data={series}
            mode={mode}
            meanValue={meanValue}
            stdDevValue={stdDevValue}
            height={350}
            showCDF={false}
          />
        </div>
      </div>

      {/* Slider Section */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
        <h2 className="text-xl font-semibold mb-4">Adjust Your Prediction</h2>
        <MultiSlider
          min={minX}
          max={maxX}
          step={Math.max(0.01, parseFloat(((maxX - minX) / 100).toFixed(2)))}
          clampStep={Math.max(0.001, parseFloat(((maxX - minX) / 200).toFixed(3)))}
          value={sliderValues}
          onChange={onSliderChange}
          disabled={isMarketResolving}
        />

        {/* Mean / StdDev Inputs */}
        <div className="flex justify-center gap-6 mt-6 flex-wrap items-center">
          <div className="flex flex-col items-center">
            <label htmlFor="mean-input" className="text-xs mb-1">Mean</label>
            <input
              id="mean-input"
              type="number"
              value={meanValue?.toFixed(2) ?? ''}
              onChange={handleMeanChange}
              disabled={isMarketResolving}
              className={`w-20 px-2 py-1 rounded border text-center ${
                mode === 'pro' 
                  ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' 
                  : 'bg-white text-gray-900 border-gray-300'
              } ${isMarketResolving ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="stddev-input" className="text-xs mb-1">Standard Deviation</label>
            <input
              id="stddev-input"
              type="number"
              value={stdDevValue?.toFixed(2) ?? ''}
              onChange={handleStdDevChange}
              disabled={isMarketResolving}
              className={`w-20 px-2 py-1 rounded border text-center ${
                mode === 'pro' 
                  ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' 
                  : 'bg-white text-gray-900 border-gray-300'
              } ${isMarketResolving ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}