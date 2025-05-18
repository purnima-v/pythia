import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as d3 from 'd3'; // Import d3 for d3.quantile
import { useMode } from '../components/pythia/Layout.tsx'; // To maintain consistent styling
import { mockMarkets } from './MarketsPage.tsx'; // Temporary: to get market data
import DistributionChart from '../components/pythia/DistributionChart.tsx';
import { type Market } from '../components/pythia/MarketCard.tsx';
import MultiSlider, { type MultiSliderValue as NumericSliderValue } from '../components/sliders/MultiSlider.tsx'; // Renamed import type

export default function MarketDetailPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const { mode } = useMode(); // Get current mode for styling

  // Find the market data - in a real app, this would be an API call
  const market = mockMarkets.find(m => m.id === marketId) as Market | undefined;

  // State for Novice mode discrete option selection
  const [selectedDiscreteOption, setSelectedDiscreteOption] = useState<string | null>(null);
  
  // State for Pro Mode betting with MultiSlider - now stores actual numeric values
  const [predictionType, setPredictionType] = useState<'pdf' | 'cdf'>('pdf');
  const [sliderNumericValues, setSliderNumericValues] = useState<NumericSliderValue | null>(null);

  // Processed numeric X values from market data, and min/max for slider
  const [numericXData, setNumericXData] = useState<number[]>([]);
  const [xSliderMin, setXSliderMin] = useState<number>(0);
  const [xSliderMax, setXSliderMax] = useState<number>(100); // Default, will be updated

  useEffect(() => {
    if (market && market.distributionData && market.distributionData.length > 0) {
      const parsedXData = market.distributionData.map(d => +d.x).sort((a, b) => a - b);
      setNumericXData(parsedXData);
      if (parsedXData.length > 0) {
        const minVal = parsedXData[0];
        const maxVal = parsedXData[parsedXData.length - 1];
        setXSliderMin(minVal);
        setXSliderMax(maxVal);

        if (mode === 'pro') {
          // Calculate Q1, Median, Q3 as numeric values
          const q1 = d3.quantile(parsedXData, 0.25) ?? minVal;
          const median = d3.quantile(parsedXData, 0.50) ?? parsedXData[Math.floor(parsedXData.length / 2)] ?? minVal;
          const q3 = d3.quantile(parsedXData, 0.75) ?? maxVal;
          
          setSliderNumericValues({
            left: Math.max(minVal, Math.min(median, q1)),       // Ensure q1 <= median
            center: median,
            right: Math.min(maxVal, Math.max(median, q3)),    // Ensure q3 >= median
          });
        }
      }
    } else {
      setNumericXData([]);
      setSliderNumericValues(null);
    }
  }, [market, mode]); // Re-run if market or mode changes

  const bgColor = mode === 'pro' ? 'bg-poseidon-dark-blue' : 'bg-light-background';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text';
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-card';
  const borderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const inputBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const buttonTextColor = mode === 'pro' ? 'text-poseidon-dark-blue' : 'text-light-background';
  const accentColor = mode === 'pro' ? 'bg-poseidon-accent-cyan' : 'bg-light-accent';
  const hoverAccentColor = mode === 'pro' ? 'hover:bg-cyan-400' : 'hover:bg-blue-400';
  const subtleButtonBg = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-bg';
  const subtleButtonBorder = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const subtleButtonHoverBg = mode === 'pro' ? 'hover:bg-poseidon-border' : 'hover:bg-light-hover';
  const tableHeaderBg = mode === 'pro' ? 'bg-poseidon-deep-blue/60' : 'bg-light-hover';

  const handleDiscreteOptionClick = (option: string) => {
    setSelectedDiscreteOption(option);
  };

  const handleDiscardProBet = () => {
    if (numericXData.length > 0) {
      const minVal = numericXData[0];
      const maxVal = numericXData[numericXData.length - 1];
      const q1 = d3.quantile(numericXData, 0.25) ?? minVal;
      const median = d3.quantile(numericXData, 0.50) ?? numericXData[Math.floor(numericXData.length / 2)] ?? minVal;
      const q3 = d3.quantile(numericXData, 0.75) ?? maxVal;
      setSliderNumericValues({
        left: Math.max(minVal, Math.min(median, q1)),
        center: median,
        right: Math.min(maxVal, Math.max(median, q3)),
      });
    } else {
        setSliderNumericValues(null);
    }
  };

  if (!market) {
    return <div className={`p-4 ${mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text'}`}>Market not found</div>;
  }

  const yValueForX = (xVal: number | null) => { // xVal is now number
    if (xVal === null || !market.distributionData) return 0;
    // Find closest point or interpolate if needed, for now, exact match
    const point = market.distributionData.find(d => +d.x === xVal);
    return point ? point.y : 0;
  };

  // Approximations for community stats (can use numericXData now)
  const communityLower25 = numericXData.length > 0 ? (d3.quantile(numericXData, 0.25)?.toFixed(2) ?? 'N/A') : 'N/A';
  const communityMedian = numericXData.length > 0 ? (d3.quantile(numericXData, 0.50)?.toFixed(2) ?? 'N/A') : 'N/A';
  const communityUpper75 = numericXData.length > 0 ? (d3.quantile(numericXData, 0.75)?.toFixed(2) ?? 'N/A') : 'N/A';
  
  const communityLastXProb = market.distributionData && market.distributionData.length > 0 
    ? (yValueForX(+market.distributionData[market.distributionData.length - 1].x) * 100).toFixed(1) + '%' 
    : 'N/A';
  const lastXLabel = numericXData.length > 0 ? `> ${numericXData[numericXData.length -1].toFixed(2)}` : '> Max';

  return (
    <div className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${bgColor} ${textColor} font-serif`}>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:w-2/3 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{market.question}</h1>

          {/* Distribution Chart Area */}
          {market.distributionData && (
            <div className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${cardBgColor}`}>
              <h2 className="text-xl font-semibold mb-4">Community Prediction</h2>
              <div className="h-80 md:h-80 lg:h-96 w-full" style={{ minHeight: '350px' }}>
                <DistributionChart
                  data={market.distributionData}
                  mode={mode}
                  q1Value={sliderNumericValues?.left}
                  medianValue={sliderNumericValues?.center}
                  q3Value={sliderNumericValues?.right}
                  showCDF={predictionType === 'cdf'}
                  height={420}
                />
              </div>
              {/* Slider and Q1/Median/Q3 input boxes directly below the chart */}
              {mode === 'pro' && sliderNumericValues && numericXData.length > 0 && (
                <>
                  <MultiSlider
                    min={xSliderMin}
                    max={xSliderMax}
                    step={Math.max(0.01, parseFloat(((xSliderMax - xSliderMin) / 100).toFixed(2)))}
                    value={sliderNumericValues}
                    onChange={(newValues) => setSliderNumericValues(newValues)}
                    clampStep={Math.max(0.001, parseFloat(((xSliderMax - xSliderMin) / 200).toFixed(3)))}
                  />
                  <div className="flex justify-center gap-6 mt-6 flex-wrap items-center">
                    <div className="flex flex-col items-center">
                      <label htmlFor="q1-input" className="text-xs mb-1">Lower 25% (Q1)</label>
                      <input
                        id="q1-input"
                        type="number"
                        min={xSliderMin}
                        max={sliderNumericValues.center}
                        step="any"
                        value={sliderNumericValues.left}
                        onChange={e => {
                          let val = Math.max(xSliderMin, Math.min(sliderNumericValues.center, Number(e.target.value)));
                          setSliderNumericValues({
                            ...sliderNumericValues,
                            left: val > sliderNumericValues.center ? sliderNumericValues.center : val
                          });
                        }}
                        className={`w-20 px-2 py-1 rounded border text-center ${mode === 'pro' ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' : 'bg-white text-gray-900 border-gray-300'}`}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <label htmlFor="median-input" className="text-xs mb-1">Median (Q2)</label>
                      <input
                        id="median-input"
                        type="number"
                        min={sliderNumericValues.left}
                        max={sliderNumericValues.right}
                        step="any"
                        value={sliderNumericValues.center}
                        onChange={e => {
                          let val = Math.max(sliderNumericValues.left, Math.min(sliderNumericValues.right, Number(e.target.value)));
                          setSliderNumericValues({
                            ...sliderNumericValues,
                            center: val
                          });
                        }}
                        className={`w-20 px-2 py-1 rounded border text-center ${mode === 'pro' ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' : 'bg-white text-gray-900 border-gray-300'}`}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <label htmlFor="q3-input" className="text-xs mb-1">Upper 75% (Q3)</label>
                      <input
                        id="q3-input"
                        type="number"
                        min={sliderNumericValues.center}
                        max={xSliderMax}
                        step="any"
                        value={sliderNumericValues.right}
                        onChange={e => {
                          let val = Math.max(sliderNumericValues.center, Math.min(xSliderMax, Number(e.target.value)));
                          setSliderNumericValues({
                            ...sliderNumericValues,
                            right: val < sliderNumericValues.center ? sliderNumericValues.center : val
                          });
                        }}
                        className={`w-20 px-2 py-1 rounded border text-center ${mode === 'pro' ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' : 'bg-white text-gray-900 border-gray-300'}`}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tabs Placeholder */}
          <div className="mb-6">
            <div className="flex border-b ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}">
              {['Predict', 'Comments', 'Edit', 'Related'].map((tabName, index) => (
                <button
                  key={tabName}
                  className={`py-2 px-4 font-semibold outline-none focus:outline-none ${
                    index === 0 
                      ? (mode === 'pro' ? 'border-b-2 border-poseidon-accent-cyan text-poseidon-accent-cyan bg-transparent' : 'border-b-2 border-light-accent text-light-accent')
                      : (mode === 'pro' ? `text-poseidon-light-text bg-transparent hover:text-poseidon-accent-cyan hover:border-b-2 hover:border-poseidon-accent-cyan/50 ${subtleButtonBorder}` : `text-light-text hover:text-light-accent`)
                  }`}
                >
                  {tabName}
                </button>
              ))}
            </div>
          </div>
          
          {/* Description/Activity Feed Placeholder */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h2 className="text-xl font-semibold mb-3">Market Details</h2>
            <p className="text-sm leading-relaxed">
              {market.description || "Detailed description for this market will be displayed here. This section can include resolution criteria, methodology, and other relevant information to help users make informed predictions."}
            </p>
          </div>

        </div>

        {/* Sidebar Area */}
        <div className="lg:w-1/3 w-full space-y-6">
          {/* Make a Prediction Box */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Make a Prediction</h2>
              {/* PDF/CDF Toggle moved here */}
              {mode === 'pro' && market.distributionData && (
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${predictionType === 'pdf' ? textColor : (mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted')}`}>PDF</span>
                  <button 
                    onClick={() => setPredictionType(pt => pt === 'pdf' ? 'cdf' : 'pdf')} 
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${predictionType === 'cdf' ? accentColor : (mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-gray-300')}`}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${predictionType === 'cdf' ? 'translate-x-6' : 'translate-x-1'}`}/>
                  </button>
                  <span className={`text-sm font-medium ${predictionType === 'cdf' ? textColor : (mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted')}`}>CDF</span>
                </div>
              )}
            </div>
            {mode === 'pro' && market.distributionData && (
              <div className="space-y-4">
                {/* Remove PDF/CDF toggle from here */}
                {/* Remove Discard button, update Place Bet button color */}
                <div className="flex space-x-2 pt-4">
                    <button className={`flex-1 py-2 px-4 rounded font-semibold ${accentColor} text-black ${hoverAccentColor} transition-colors`}>
                    Place Bet
                    </button>
                </div>
                {/* Summary Table */}
                <div className="pt-4 text-sm">
                  <table className={`w-full border-collapse ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                    <thead>
                      <tr>
                        <th className={`p-2 border-b font-normal text-left ${tableHeaderBg} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}></th>
                        <th className={`p-2 border-b font-normal text-center ${tableHeaderBg} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>Range Start<br/>(Lower 25%)</th>
                        <th className={`p-2 border-b font-normal text-center ${tableHeaderBg} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>Point Est.<br/>(Median)</th>
                        <th className={`p-2 border-b font-normal text-center ${tableHeaderBg} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>Range End<br/>(Upper 75%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={`p-2 border-b ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>Community</td>
                        <td className={`p-2 border-b text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>{communityLower25}</td>
                        <td className={`p-2 border-b text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>{communityMedian}</td>
                        <td className={`p-2 border-b text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>{communityUpper75}</td>
                      </tr>
                      <tr>
                        <td className={`p-2 ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>My Prediction</td>
                        <td className={`p-2 text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>{sliderNumericValues?.left?.toFixed(2) || 'N/A'}</td>
                        <td className={`p-2 text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>{sliderNumericValues?.center?.toFixed(2) || 'N/A'}</td>
                        <td className={`p-2 text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>{sliderNumericValues?.right?.toFixed(2) || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {mode === 'novice' && market.discreteOptions && (
              <div className="space-y-3">
                {market.discreteOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleDiscreteOptionClick(option)}
                    className={`w-full p-3 rounded text-left transition-colors
                      ${
                        selectedDiscreteOption === option 
                          ? 'bg-light-accent text-white'
                          : `${subtleButtonBg} hover:${subtleButtonHoverBg} border ${subtleButtonBorder} ${textColor}`
                      }`}
                  >
                    {option}
                  </button>
                ))}
                 {selectedDiscreteOption && (
                    <button className={`w-full mt-3 py-2 px-4 rounded font-semibold ${accentColor} ${buttonTextColor} ${hoverAccentColor} transition-colors`}>
                        Confirm Bet on: {selectedDiscreteOption}
                    </button>
                )}
              </div>
            )}
            {!market.distributionData && !market.discreteOptions && (
              <p>Prediction interface for this market type is not yet available.</p>
            )}
          </div>

          {/* Market Info Box Placeholder */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h3 className="text-lg font-semibold mb-3">Market Info</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>Resolution Criteria:</strong> To be defined.</li>
              <li><strong>Ends:</strong> {new Date(market.endDate).toLocaleDateString()}</li>
              <li><strong>Source:</strong> Official Pythia Oracle</li>
            </ul>
          </div>

          {/* Authors & Group Box Placeholder */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h3 className="text-lg font-semibold mb-3">Authors & Group</h3>
            <p className="text-sm">Created by Pythia Admin.</p>
          </div>

          {/* Tags Box Placeholder */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {market.category && (
                <span className={`px-2 py-1 text-xs rounded-full ${mode === 'pro' ? `bg-poseidon-deep-blue text-poseidon-accent-cyan border border-poseidon-accent-cyan/70` : `bg-light-hover text-light-accent border border-light-accent/70`}`}>
                  {market.category}
                </span>
              )}
              <span className={`px-2 py-1 text-xs rounded-full ${mode === 'pro' ? `bg-poseidon-deep-blue text-poseidon-accent-cyan border border-poseidon-accent-cyan/70` : `bg-light-hover text-light-accent border border-light-accent/70`}`}>
                Forecast
              </span>
            </div>
          </div>
          
          {/* News & Analysis Placeholder */}
           <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h3 className="text-lg font-semibold mb-3">News & Analysis</h3>
            <ul className="space-y-2 text-sm">
                <li><a href="#" className={`${mode === 'pro' ? 'text-poseidon-accent-cyan hover:underline' : 'text-light-accent hover:underline'}`}>Related News Article 1</a></li>
                <li><a href="#" className={`${mode === 'pro' ? 'text-poseidon-accent-cyan hover:underline' : 'text-light-accent hover:underline'}`}>Analysis Blog Post</a></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
} 