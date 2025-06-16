import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockMarkets } from './MarketsPage.tsx';  // make sure this is imported
import * as d3 from 'd3'; // Import d3 for d3.quantile
import { useMode } from '../components/pythia/Layout.tsx'; // To maintain consistent styling
import DistributionChart from '../components/pythia/DistributionChart.tsx';
import { type Market } from '../components/pythia/MarketCard.tsx';
import MultiSlider, { type MultiSliderValue as NumericSliderValue } from '../components/sliders/MultiSlider.tsx'; // Renamed import type
//import NoviceHistogram from '../components/pythia/NoviceHistogram';
//import { useMockCreateMarket } from '../useMockCreateMarket';
//import { useMockPlaceBet } from '../useMockPlaceBet';
import { dummyAbi, dummyAddress } from '../contracts/dummyMarket';
import { useWriteContract, useTransaction, useAccount, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { usePlaceBet } from '../hooks/usePlaceBet';
import { PAIR_ABI, 
  COLLATERAL_ABI,
  ROUTER_ABI
 } from '../contracts/ABIs.ts';
import { readContract } from '@wagmi/core';
import { config } from '../wagmi.config.ts';
import { toast } from '../components/ui/toast.tsx';
import confetti from 'canvas-confetti';
import { waitForTransaction } from 'wagmi/actions';


export default function MarketDetailPage() {
  const { marketId } = useParams<{ marketId: `0x${string}` }>();
  useEffect(() => {
    const m = mockMarkets.find(m => m.id === marketId);
    if (!m?.distributionData) return;
    // sort the x-values
    const xs = m.distributionData.map(d => d.x).sort((a, b) => a - b);
    // compute mean/stdDev
    const mu = d3.mean(xs) ?? 0;
    const sd = d3.deviation(xs) ?? 1;
    // prime all of your state
    setMarket(m);
    setMeanValue(mu);
    setStdDevValue(sd);
    setXSliderMin(xs[0]);
    setXSliderMax(xs[xs.length - 1]);
    setSliderNumericValues({ left: mu - sd, center: mu, right: mu + sd });
    setNumericXData(xs);
    setSeries(buildNormalSeries(mu, sd));
  }, [marketId]);
  const { mode } = useMode(); // Get current mode for styling
  const [activeTab, setActiveTab] = useState('Predict'); // Add this line for tab state
  const { writeContract } = useWriteContract();
  const { address } = useAccount();   
  const { placeBet, isPlacingBet } = usePlaceBet();

  // Directly find the market from mockMarkets
  // const market = mockMarkets.find(m => m.id === marketId) as Market | undefined;
  const [market, setMarket] = useState<Market | null>(null);

  // State for Novice mode discrete option selection
  //const [selectedDiscreteOption, setSelectedDiscreteOption] = useState<string | null>(null);
  
  // State for Pro Mode betting
  const [predictionType, setPredictionType] = useState<'pdf' | 'cdf'>('pdf');
  const [meanValue, setMeanValue] = useState<number | null>(null);
  const [stdDevValue, setStdDevValue] = useState<number | null>(null);
  const [sliderNumericValues, setSliderNumericValues] =
  useState<NumericSliderValue>({
    left:   0,
    center: 0,
    right:  0,
  });
  // Processed numeric X values from market data, and min/max for slider
  const [numericXData, setNumericXData] = useState<number[]>([]);
  const [xSliderMin, setXSliderMin] = useState<number>(0);
  const [xSliderMax, setXSliderMax] = useState<number>(100);

  // Add state for collateral input
  const [collateralInput, setCollateralInput] = useState<string>('');

  // TODO: add the other fields that positions have
  const [positions, setPositions] = useState<Array<{
    id: string;
    mean: number;
    stdDev: number;
    collateral: number;
    timestamp: number;
  }>>([]);

  // Compute bucket probabilities (mocked for now)
  const bucketProbabilities = useMemo(() => {
    if (!market?.discreteOptions) return [];
    // Uniform or random for now
    const n = market.discreteOptions.length;
    return market.discreteOptions.map((option, i) => ({
      id: option,
      rangeLabel: option,
      communityProb: 1 / n // uniform
    }));
  }, [market?.discreteOptions]);

  // Add state for novice collateral input and positions
  //noviceCollateralInput, setNoviceCollateralInput] = useState('');
  /*const [novicePositions, setNovicePositions] = useState<Array<{
    id: string;
    option: string;
    collateral: number;
    timestamp: number;
  }>>([]);
  const [noviceRequiredCollateral, setNoviceRequiredCollateral] = useState(100);
  // Collateral sufficiency for novice
  const isNoviceCollateralSufficient = useMemo(() => {
    const inputValue = parseFloat(noviceCollateralInput);
    return !isNaN(inputValue) && inputValue >= noviceRequiredCollateral;
  }, [noviceCollateralInput, noviceRequiredCollateral]);

  // Place novice bet handler
  const handlePlaceNoviceBet = async () => {
    if (!market || !selectedDiscreteOption) {
      toast({
        title: 'Error',
        description: 'Please select an option.',
        variant: 'destructive',
      });
      return;
    }
    if (!noviceCollateralInput || !isNoviceCollateralSufficient) {
      toast({
        title: 'Error',
        description: 'Insufficient collateral.',
        variant: 'destructive',
      });
      return;
    }
    try {
      // Simulate contract call
      // await writeContract({ ... })
      toast({
        title: 'Success',
        description: `Bet placed on "${selectedDiscreteOption}"!`,
      });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00ff00', '#0000ff', '#ff0000', '#ffff00'],
        shapes: ['square', 'circle'],
        gravity: 1.5,
        scalar: 1.1,
        ticks: 180
      });
      setNovicePositions(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          option: selectedDiscreteOption,
          collateral: parseFloat(noviceCollateralInput),
          timestamp: Date.now(),
        },
      ]);
      setNoviceCollateralInput('');
      setSelectedDiscreteOption(null);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Transaction failed or was rejected',
        variant: 'destructive',
      });
    }
  }; */

  const [kValue, setKValue] = useState<bigint | null>(null);

  useEffect(() => {
    const getMarketPosition = async () => {
      try {
        if (!marketId) return;
        
        const marketPosition = await readContract(config, {
          address: marketId as `0x${string}`,
          abi: PAIR_ABI,
          functionName: "getMarketPosition"
        });
        
        const marketMetadata = await readContract(config, {
          address: marketId as `0x${string}`,
          abi: PAIR_ABI,
          functionName: "marketMetadata"
        });
  
        setMarket({
          id: marketId as `0x${string}`,
          shortDescription: marketMetadata[0],
          fullDescription: marketMetadata[1], 
          imageURL: marketMetadata[2],
          hasExpirationDate: marketMetadata[3],
          expirationDate: marketMetadata[4],
          mean: marketPosition.mean,
          standardDeviation: marketPosition.stdDev,
          totalBacking: marketPosition.collateral,
          hasSettled: marketPosition.settled,
          category: "Crypto",
        });
        
        setKValue(marketPosition.k);
        
        const marketMean = Number(marketPosition.mean);
        const marketStdDev = Number(marketPosition.stdDev);
        const initSigma = marketStdDev;  
        const marketMin = marketMean - 4 * marketStdDev;
        const marketMax = marketMean + 4 * marketStdDev;
        
        setMeanValue(marketMean);
        setStdDevValue(marketStdDev);
        setXSliderMin(marketMin);
        setXSliderMax(marketMax);
  
        setSliderNumericValues({
          left: marketMean - initSigma,
          center: marketMean,
          right: marketMean + initSigma,
        });
      } catch (error) {
        console.error("Error loading market data:", error);
        // Handle error appropriately
      }
    };
  
    getMarketPosition();
  }, [marketId]);

  const [requiredCollateral, setRequiredCollateral] = useState(100); 
  useEffect(() => {
    if (!kValue || !market ) return;
    
    const getRequiredCollateral = async () => {
      const { left, center, right } = sliderNumericValues;
      const collateral = await readContract(config, {
        address: marketId as `0x${string}`,
        abi: COLLATERAL_ABI,
        functionName: "calculateRequiredCollateral",
        args: [
          market.mean,
          market.standardDeviation, 
          BigInt(center),
          BigInt((right - left)/2),
          kValue,
          BigInt(center)
        ]
      });
      setRequiredCollateral(Number(collateral));
    };
    getRequiredCollateral();
  }, [
    sliderNumericValues,
    marketId,
    market,
    kValue
  ]);

  // Calculate if input is sufficient
  const isCollateralSufficient = useMemo(() => {
    const inputValue = parseFloat(collateralInput);
    return !isNaN(inputValue) && inputValue >= requiredCollateral;
  }, [collateralInput, requiredCollateral]);

  // Handle slider changes to maintain symmetry
  const handleSliderChange = (newValues: NumericSliderValue) => {
    const mean = newValues.center;
    const stdDev = Math.abs(newValues.right - mean);
    
    // Update both the slider values and the mean/stdDev states
    setSliderNumericValues({
      left: mean - stdDev,
      center: mean,
      right: mean + stdDev
    });
    
    // Update the mean and stdDev states that control the curve
    setMeanValue(mean);
    setStdDevValue(stdDev);
  };

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

  const handleDiscardProBet = () => {
    if (numericXData.length > 0) {
      const minVal = numericXData[0];
      const maxVal = numericXData[numericXData.length - 1];
      const marketMean = d3.mean(numericXData) ?? minVal;
      const marketStdDev = d3.deviation(numericXData) ?? (maxVal - minVal) / 4;
      
      // Reset to market mean with smaller standard deviation
      const initialStdDev = marketStdDev * 0.4;
      setMeanValue(marketMean);
      setStdDevValue(initialStdDev);
      
      // Reset slider to mean ± smaller stdDev
      setSliderNumericValues({
        left: marketMean - initialStdDev,
        center: marketMean,
        right: marketMean + initialStdDev
      });
    } else {
      setMeanValue(null);
      setStdDevValue(null);
      setSliderNumericValues({
        left: 0,
        center: 0,
        right: 0,
      });
    }
  };

  const handlePlaceBet = async () => {
    if (!market) {
      toast({
        title: 'Error',
        description: 'Missing prediction values.',
        variant: 'destructive'
      });
      return;
    }
    // Compute mean and stdDev from sliderNumericValues
    const mean = sliderNumericValues.center;
    const stdDev = (sliderNumericValues.right - sliderNumericValues.left) / 2;
    if (isNaN(mean) || isNaN(stdDev)) {
      toast({
        title: 'Error',
        description: 'Missing prediction values.',
        variant: 'destructive'
      });
      return;
    }
    try {
      await writeContract({
        address: marketId as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'buyETH',
        args: [
          market.id,
          BigInt(Math.round(mean)),
          BigInt(Math.round(stdDev))
        ],
        // If collateral is sent as msg.value, add:
        // value: parseEther(collateralInput),
      });

      toast({
        title: 'Success',
        description: 'Bet placed!',
      });

      // Confetti!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00ff00', '#0000ff', '#ff0000', '#ffff00'],
        shapes: ['square', 'circle'],
        gravity: 1.5,
        scalar: 1.2,
        ticks: 200
      });
      
      // Add the user's prediction to the positions table
      if (meanValue !== null && stdDevValue !== null && collateralInput) {
        setPositions(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            mean: meanValue,
            stdDev: stdDevValue,
            collateral: parseFloat(collateralInput),
            timestamp: Date.now(),
          },
        ]);
      }
      setCollateralInput('');
      // optionally: refetch positions / market state here
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Transaction failed or was rejected',
        variant: 'destructive'
      });
    }
  };

  const [isMarketResolving, setIsMarketResolving] = useState(false);

  const handleResolveMarket = async () => {
    if (!market) return;
    try {
      setIsMarketResolving(true); // Freeze the market
      await writeContract({
        address: marketId as `0x${string}`,
        abi: PAIR_ABI,
        functionName: 'settleMarket',
        args: [
          BigInt(Math.floor(Number(finalValue)))
        ]
      });

      // Update the market state to reflect that it's settled
      setMarket(prev => {
        if (!prev) return null;
        return {
          ...prev,
          hasSettled: true
        };
      });

      toast({
        title: 'Success',
        description: 'Market resolved!'
      });
      setShowResolutionModal(false);
      setIsMarketResolving(false);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to resolve market',
        variant: 'destructive'
      });
      setIsMarketResolving(false); // Only unfreeze if there's an error
    }
  };
  
  const buildNormalSeries = (mu: number, sig: number, span = 4, n = 200) => {
    const step = (2 * span * sig) / (n - 1);
    const data = [];
    for (let i = 0; i < n; i++) {
      const x = mu - span * sig + i * step;
      const z = (x - mu) / sig;
      const y = Math.exp(-0.5 * z * z) / (sig * Math.sqrt(2 * Math.PI));
      data.push({ x, y });
    }
    return data;
  };

  const [series, setSeries] = useState<{ x: number; y: number }[]>([]);

useEffect(() => {
  if (meanValue !== null && stdDevValue !== null) {
    setSeries(buildNormalSeries(meanValue, stdDevValue));
    setNumericXData(series.map(p => p.x));          // keeps quartile helpers working
  }
}, [meanValue, stdDevValue]);


  const yValueForX = (xVal: number | null) => { // xVal is now number
    if (xVal === null || !series) return 0;
    // Find closest point or interpolate if needed, for now, exact match
    const point = series.find(d => +d.x === xVal);
    return point ? point.y : 0;
  };

  // Approximations for community stats (can use numericXData now)
  const communityLower25 = numericXData.length > 0 ? (d3.quantile(numericXData, 0.25)?.toFixed(2) ?? 'N/A') : 'N/A';
  const communityMedian = numericXData.length > 0 ? (d3.quantile(numericXData, 0.50)?.toFixed(2) ?? 'N/A') : 'N/A';
  const communityUpper75 = numericXData.length > 0 ? (d3.quantile(numericXData, 0.75)?.toFixed(2) ?? 'N/A') : 'N/A';
  
  const communityLastXProb = series && series.length > 0 
    ? (yValueForX(+series[series.length - 1].x) * 100).toFixed(1) + '%' 
    : 'N/A';
  const lastXLabel = numericXData.length > 0 ? `> ${numericXData[numericXData.length -1].toFixed(2)}` : '> Max';

  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [finalValue, setFinalValue] = useState<string>('');
  const [isResolving, setIsResolving] = useState(false);

  return (
    <div className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${bgColor} ${textColor}`}>
      <style>
        {`
          button {
            -webkit-tap-highlight-color: transparent !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            outline: none !important;
          }
          button:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          button:active {
            outline: none !important;
            box-shadow: none !important;
          }
        `}
      </style>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:w-2/3 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{market?.shortDescription}</h1>

          {/* Distribution Chart Area */}
          {series && mode === 'pro' && (
            <div className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${cardBgColor}`}>
              <h2 className="text-xl font-semibold mb-4">Community Prediction</h2>
              <div className="h-80 md:h-80 lg:h-96 w-full" style={{ minHeight: '350px' }}>
                <DistributionChart
                  data={series}
                  mode={mode}
                  meanValue={meanValue}
                  stdDevValue={stdDevValue}
                  showCDF={predictionType === 'cdf'}
                  height={420}
                />
              </div>
            </div>
          )}
      </div>
          {/* Discrete Distribution for Novice Mode */} {/*
          {mode === 'novice' && market?.discreteOptions && (
            <div className="space-y-4">
              <div className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${cardBgColor}`}>
                <h2 className="text-xl font-semibold mb-4">Community Prediction</h2>
                <div className="h-60 w-full flex flex-col justify-center">
                  <NoviceHistogram
                    buckets={bucketProbabilities}
                    selected={selectedDiscreteOption ? [{ id: selectedDiscreteOption, weight: 1 }] : []}
                    accentColor={'#93c5fd'}
                    onHover={id => id && setSelectedDiscreteOption(id)}
                  />
                </div>
              </div>
              <div className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${cardBgColor}`}>
                <h2 className="text-lg font-semibold mb-2">Choose Your Option</h2>
                <div className="space-y-2">
                  {market.discreteOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedDiscreteOption(option)}
                      className={`w-full p-3 rounded text-left transition-colors font-semibold border ${selectedDiscreteOption === option ? 'bg-blue-100 text-gray-800 border-blue-300' : `${subtleButtonBg} hover:bg-blue-50 ${subtleButtonBorder} ${textColor}`}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-4 items-center">
                  <div className="flex-1">
                    <label htmlFor="novice-collateral-input" className="text-sm mb-1 block">Your Collateral</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">$</span>
                      <input
                        id="novice-collateral-input"
                        type="number"
                        min="0"
                        step="1"
                        value={noviceCollateralInput}
                        onChange={e => setNoviceCollateralInput(e.target.value)}
                        placeholder="Enter amount"
                        className={`w-full p-2 pl-7 rounded border text-sm bg-white text-gray-900 border-gray-300`}
                      />
                    </div>
                  </div>
                  <button
                    className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${isNoviceCollateralSufficient && selectedDiscreteOption ? 'bg-blue-100 text-gray-800 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`}
                    disabled={!isNoviceCollateralSufficient || !selectedDiscreteOption}
                    onClick={handlePlaceNoviceBet}
                  >
                    Place Bet
                  </button>
                </div>
                <div className="pt-4 text-sm">
                  <table className={`w-full border-collapse border-light-border`}>
                    <thead>
                      <tr>
                        <th className={`p-2 border-b font-normal text-left ${tableHeaderBg}`}>Option</th>
                        <th className={`p-2 border-b font-normal text-center ${tableHeaderBg}`}>Community %</th>
                        <th className={`p-2 border-b font-normal text-center ${tableHeaderBg}`}>My Bets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bucketProbabilities.map(bucket => (
                        <tr key={bucket.id}>
                          <td className="p-2 border-b">{bucket.rangeLabel}</td>
                          <td className="p-2 border-b text-center">{(bucket.communityProb * 100).toFixed(1)}%</td>
                          <td className="p-2 border-b text-center">
                            {novicePositions.filter(p => p.option === bucket.id).length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )} */}
''
          {/* Slider and controls */}
              {mode === 'pro' && sliderNumericValues && numericXData.length > 0 && (
            <div className={`p-4 sm:p-6 rounded-lg shadow-md mb-6 ${cardBgColor}`}>
                  <MultiSlider
                    min={xSliderMin}
                    max={xSliderMax}
                    step={Math.max(0.01, parseFloat(((xSliderMax - xSliderMin) / 100).toFixed(2)))}
                    value={sliderNumericValues}
                onChange={handleSliderChange}
                    clampStep={Math.max(0.001, parseFloat(((xSliderMax - xSliderMin) / 200).toFixed(3)))}
                    disabled={isMarketResolving}
                  />
                  <div className="flex justify-center gap-6 mt-6 flex-wrap items-center">
                    <div className="flex flex-col items-center">
                  <label htmlFor="mean-input" className="text-xs mb-1">Mean</label>
                      <input
                    id="mean-input"
                    type="text"
                    value={meanValue?.toFixed(2) ?? ''}
                    onChange={e => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      
                      if (val !== null && stdDevValue !== null) {
                        // Update both the meanValue state and slider position
                        setMeanValue(val);
                        setSliderNumericValues({
                          left: val - stdDevValue,
                          center: val,
                          right: val + stdDevValue
                        });
                      }
                    }}
                    className={`w-20 px-2 py-1 rounded border text-center ${mode === 'pro' ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                    </div>
                    <div className="flex flex-col items-center">
                  <label htmlFor="stddev-input" className="text-xs mb-1">Standard Deviation</label>
                      <input
                    id="stddev-input"
                    type="text"
                    value={stdDevValue?.toFixed(2) ?? ''}
                    onChange={e => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      
                      if (val !== null && meanValue !== null) {
                        // Update both the stdDevValue state and slider position
                        setStdDevValue(val);
                        setSliderNumericValues({
                          left: meanValue - val,
                          center: meanValue,
                          right: meanValue + val
                        });
                      }
                    }}
                    className={`w-20 px-2 py-1 rounded border text-center ${mode === 'pro' ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                    </div>
                  </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className={`flex border-b ${mode === 'pro' ? 'border-poseidon-border' : 'border-gray-200'}`}>
              {['Predict', 'Comments', 'Related'].map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setActiveTab(tabName)}
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
                    Use the controls on the right to make your prediction.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-poseidon-muted-text space-y-2">
                    <li>Select a range for continuous predictions</li>
                    {/*<li>Choose from discrete options (Novice mode)</li>*/}
                  </ul>
                </div>
              )}

              {activeTab === 'Comments' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Discussion</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-poseidon-deep-blue"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">User123</span>
                          <span className="text-xs text-gray-500 dark:text-poseidon-muted-text">2 hours ago</span>
                        </div>
                        <p className="text-sm mt-1">I think this prediction is too conservative. The market conditions suggest a higher probability.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-poseidon-deep-blue"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">CryptoExpert</span>
                          <span className="text-xs text-gray-500 dark:text-poseidon-muted-text">5 hours ago</span>
                        </div>
                        <p className="text-sm mt-1">Based on historical data and current trends, I agree with the community prediction.</p>
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
          
          {/* Description/Activity Feed Placeholder */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h2 className="text-xl font-semibold mb-3">Market Details</h2>
            <p className="text-sm leading-relaxed">
              {market?.fullDescription || "Detailed description for this market will be displayed here. This section can include resolution criteria, methodology, and other relevant information to help users make informed predictions."}
            </p>
          </div>

        </div>

        {/* Sidebar Area */}
        <div className="lg:w-1/3 w-full space-y-6">
          {/* Make a Prediction Box */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor} mt-[60px]`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Make a Prediction</h2>
              {/* PDF/CDF Toggle moved here */}
              {mode === 'pro' && series && (
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
            {mode === 'pro' && series && (
              <div className="space-y-4">
                {/* Remove PDF/CDF toggle from here */}
                {/* Remove Discard button, update Place Bet button color */}
                <div className="flex flex-col space-y-3 pt-4">
                    <div className="flex gap-4">
                        <div className={`flex-1 text-sm p-2 rounded border ${
                            mode === 'pro' 
                                ? collateralInput && !isCollateralSufficient
                                    ? 'bg-poseidon-deep-blue/50 text-yellow-400 border-yellow-400/30'
                                    : collateralInput && isCollateralSufficient
                                        ? 'bg-poseidon-deep-blue/50 text-green-400 border-green-400/30'
                                        : 'bg-poseidon-deep-blue/50 text-red-400 border-red-400/30'
                                : collateralInput && !isCollateralSufficient
                                    ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                    : collateralInput && isCollateralSufficient
                                        ? 'bg-green-50 text-green-600 border-green-200'
                                        : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                            {collateralInput && isCollateralSufficient ? (
                                <div>
                                    <div className="font-medium mb-1 text-green-400">Ready to Trade</div>
                                    <div className="text-xs mt-1">
                                        Your collateral of ${parseFloat(collateralInput).toLocaleString()} exceeds the required amount of ${requiredCollateral.toLocaleString()}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="font-medium mb-1">Required Collateral: ${requiredCollateral.toLocaleString()}</div>
                                    <div className="text-xs mt-2 text-gray-400 dark:text-poseidon-muted-text">
                                      Minimum stake for your prediction.
                                    </div>
                                    {collateralInput && !isCollateralSufficient && (
                                        <div className="text-xs mt-1">
                                            Consider aligning your prediction more with the community to reduce required collateral:
                                            <ul className="list-disc list-inside mt-1">
                                                <li>Current community mean: {numericXData.length > 0 ? d3.mean(numericXData)?.toFixed(2) : 'N/A'}</li>
                                                <li>Your mean: {meanValue?.toFixed(2) ?? 'N/A'}</li>
                                                <li>Current community std dev: {numericXData.length > 0 ? d3.deviation(numericXData)?.toFixed(2) : 'N/A'}</li>
                                                <li>Your std dev: {stdDevValue?.toFixed(2) ?? 'N/A'}</li>
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex-1">
                            <label htmlFor="collateral-input" className="text-sm mb-1 block">Your Collateral</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">$</span>
                                <input
                                    id="collateral-input"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={collateralInput}
                                    onChange={(e) => setCollateralInput(e.target.value)}
                                    placeholder="Enter amount"
                                    disabled={isMarketResolving}
                                    className={`w-full p-2 pl-7 rounded border text-sm ${
                                        mode === 'pro' 
                                            ? 'bg-poseidon-deep-blue text-poseidon-light-text border-poseidon-border' 
                                            : 'bg-white text-gray-900 border-gray-300'
                                    } ${isMarketResolving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                    <button 
                      className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${
                        isCollateralSufficient && !isMarketResolving
                          ? `${mode === 'pro' ? 'bg-cyan-100' : 'bg-blue-100'} text-gray-800 hover:${
                              mode === 'pro' ? 'bg-cyan-200' : 'bg-blue-200'
                            }`
                          : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      }`}
                      disabled={!isCollateralSufficient || isPlacingBet || isMarketResolving}
                      onClick={handlePlaceBet}
                    >
                      {isPlacingBet ? 'Placing...' : 'Place Bet'}
                    </button>
                </div>
                {/* Summary Table */}
                <div className="pt-4 text-sm">
                  <table className={`w-full border-collapse ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                    <thead>
                      <tr>
                        <th className={`p-2 border-b font-normal text-left ${tableHeaderBg} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}></th>
                        <th className={`p-2 border-b font-normal text-center ${tableHeaderBg} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>Mean</th>
                        <th className={`p-2 border-b font-normal text-center ${tableHeaderBg} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>Standard<br/>Deviation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={`p-2 border-b ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>Community</td>
                        <td className={`p-2 border-b text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                          {numericXData.length > 0 ? (d3.mean(numericXData)?.toFixed(2) ?? 'N/A') : 'N/A'}
                        </td>
                        <td className={`p-2 border-b text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                          {numericXData.length > 0 ? (d3.deviation(numericXData)?.toFixed(2) ?? 'N/A') : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className={`p-2 border-b ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>My Prediction</td>
                        <td className={`p-2 border-b text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                          {meanValue?.toFixed(2) || 'N/A'}
                        </td>
                        <td className={`p-2 border-b text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                          {stdDevValue?.toFixed(2) || 'N/A'}
                        </td>
                      </tr>
                      {positions.map((position, index) => (
                        <tr key={position.id}>
                          <td className={`p-2 ${index === positions.length - 1 ? '' : 'border-b'} ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
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
                          <td className={`p-2 ${index === positions.length - 1 ? '' : 'border-b'} text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                            {position.mean.toFixed(2)}
                          </td>
                          <td className={`p-2 ${index === positions.length - 1 ? '' : 'border-b'} text-center ${mode === 'pro' ? 'border-poseidon-border' : 'border-light-border'}`}>
                            {position.stdDev.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          {/*
            {mode === 'novice' && market?.discreteOptions && (
              <div className="space-y-3">
                {market.discreteOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleDiscreteOptionClick(option)}
                    className={`prediction-button w-full p-3 rounded text-left transition-colors
                      ${
                        selectedDiscreteOption === option 
                          ? 'bg-blue-100 text-gray-800'
                          : `${subtleButtonBg} hover:bg-blue-50 border ${subtleButtonBorder} ${textColor}`
                      }`}
                  >
                    {option}
                  </button>
                ))}
                 {selectedDiscreteOption && (
                    <button className={`prediction-button w-full mt-3 py-2 px-4 rounded font-semibold bg-blue-100 text-gray-800 hover:bg-blue-200 transition-colors`}>
                        Confirm Bet on: {selectedDiscreteOption}
                    </button>
                )}
              </div>
            )}
            {!series && !market?.discreteOptions && (
              <p>Prediction interface for this market type is not yet available.</p>
            )}
          </div> */}

          {/* Market Info Box Placeholder */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h3 className="text-lg font-semibold mb-3">Market Info</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>Resolution Criteria:</strong> To be defined.</li>
              <li>
                <strong>Ends:</strong>{' '}
                {market?.expirationDate
                  ? new Date(Number(market.expirationDate) * 1000).toLocaleDateString('en-US', {
                      year:  'numeric',
                      month: 'long',
                      day:   'numeric'
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
                    onClick={() => setShowResolutionModal(true)}
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

          {/* Authors & Group Box Placeholder */}
          <div className={`p-4 sm:p-6 rounded-lg shadow-md ${cardBgColor}`}>
            <h3 className="text-lg font-semibold mb-3">Authors & Group</h3>
            <p className="text-sm">Created by Pythia Admin.</p>
          </div>

          {/* Tags Box Placeholder */}
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
      {showResolutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg ${mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-white'} max-w-md w-full`}>
            <h3 className="text-lg font-semibold mb-4">Resolve Market</h3>
            <div className="mb-4">
              <label htmlFor="final-value" className="block text-sm mb-2">Final Value</label>
              <input
                id="final-value"
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
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
                onClick={() => setShowResolutionModal(false)}
                className={`px-4 py-2 rounded ${
                  mode === 'pro' 
                    ? 'bg-poseidon-deep-blue text-poseidon-light-text border border-poseidon-border' 
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleResolveMarket}
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
          </div>
        </div>
      )}
      {isMarketResolving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg ${mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-white'} max-w-md w-full text-center`}>
            <h3 className="text-lg font-semibold mb-4">Resolving Market</h3>
            <p className="text-sm mb-4">Please wait while the market is being resolved...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-poseidon-accent-cyan mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
                    }