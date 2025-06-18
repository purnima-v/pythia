import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { mockMarkets } from './MarketsPage.tsx';
import { useMode } from '../components/pythia/Layout.tsx';
import { type Market } from '../components/pythia/MarketCard.tsx';
import { type MultiSliderValue as NumericSliderValue } from '../components/sliders/MultiSlider.tsx';
import MarketChart from '../components/market-details-page/MarketChart.tsx';
import MarketInfo from '../components/market-details-page/MarketInfo.tsx';
import MarketTabs from '../components/market-details-page/MarketTabs.tsx';
import MarketResolution from '../components/market-details-page/MarketResolution.tsx';
import MarketStats from '../components/market-details-page/MarketStats.tsx';
import PredictionControls from '../components/market-details-page/PredictionControls.tsx';
import { useReadContract } from 'wagmi';
import { COLLATERAL_ABI } from '../contracts/ABIs.ts';

// Extend Market type to include distribution data
interface ExtendedMarket extends Market {
  distributionData?: Array<{ x: number; y: number }>;
}

export default function MarketDetailPage() {
  const { marketId } = useParams<{ marketId: `0x${string}` }>();
  const { mode } = useMode();
  const { data: collateralData } = useReadContract({
    address: marketId as `0x${string}`,
    abi: COLLATERAL_ABI,
    functionName: "calculateRequiredCollateral",
    args: [
      BigInt(0), // These will be updated in the effect
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0)
    ]
  });

  const [market, setMarket] = useState<ExtendedMarket | null>(null);
  const [predictionType, setPredictionType] = useState<'pdf' | 'cdf'>('pdf');
  const [meanValue, setMeanValue] = useState<number | null>(null);
  const [stdDevValue, setStdDevValue] = useState<number | null>(null);
  const [sliderNumericValues, setSliderNumericValues] = useState<NumericSliderValue>({
    left: 0,
    center: 0,
    right: 0,
  });
  const [numericXData, setNumericXData] = useState<number[]>([]);
  const [xSliderMin, setXSliderMin] = useState<number>(0);
  const [xSliderMax, setXSliderMax] = useState<number>(100);
  const [collateralInput, setCollateralInput] = useState<string>('');
  const [positions, setPositions] = useState<Array<{
    id: string;
    mean: number;
    stdDev: number;
    collateral: number;
    timestamp: number;
  }>>([]);
  const [kValue, setKValue] = useState<bigint | null>(null);
  const [requiredCollateral, setRequiredCollateral] = useState(100);
  const [activeTab, setActiveTab] = useState('Predict');
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [finalValue, setFinalValue] = useState<string>('');
  const [isResolving, setIsResolving] = useState(false);
  const [isMarketResolving, setIsMarketResolving] = useState(false);

  useEffect(() => {
    const m = mockMarkets.find(m => m.id === marketId) as ExtendedMarket;
    if (!m?.distributionData) return;
    
    const xs = m.distributionData.map(d => d.x).sort((a, b) => a - b);
    const minVal = xs[0];
    const maxVal = xs[xs.length - 1];
    // Calculate community mean and stddev
    const communityMean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const communityStdDev = Math.sqrt(xs.reduce((a, b) => a + Math.pow(b - communityMean, 2), 0) / xs.length);
    
    setMarket(m);
    setXSliderMin(minVal);
    setXSliderMax(maxVal);
    setNumericXData(xs);
    setMeanValue(communityMean);
    setStdDevValue(communityStdDev);
    setSliderNumericValues({ 
      left: communityMean - communityStdDev, 
      center: communityMean, 
      right: communityMean + communityStdDev 
    });
  }, [marketId]);

  useEffect(() => {
    if (!kValue || !market) return;
    
    if (collateralData) {
      setRequiredCollateral(Number(collateralData));
    }
  }, [market, kValue, collateralData]);

  const isCollateralSufficient = useMemo(() => {
    const inputValue = parseFloat(collateralInput);
    return !isNaN(inputValue) && inputValue >= requiredCollateral;
  }, [collateralInput, requiredCollateral]);

  const handleSliderChange = (newValues: NumericSliderValue) => {
    const mean = newValues.center;
    const stdDev = Math.abs(newValues.right - mean);
    
    setSliderNumericValues({
      left: mean - stdDev,
      center: mean,
      right: mean + stdDev
    });
    
    setMeanValue(mean);
    setStdDevValue(stdDev);
  };

  const handlePlacePrediction = () => {
    // Add new position to the top of the positions array
    if (meanValue !== null && stdDevValue !== null && collateralInput) {
      setPositions(prev => [{
        id: Date.now().toString(),
        mean: meanValue,
        stdDev: stdDevValue,
        collateral: parseFloat(collateralInput),
        timestamp: Date.now()
      }, ...prev]);
    }
    setCollateralInput('');
  };

  const bgColor = mode === 'pro' ? 'bg-poseidon-dark-blue' : 'bg-light-background';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text';

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

      {/* Market Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{market?.shortDescription}</h1>

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Chart, Slider, Tabs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart */}
          <MarketChart
            mode={mode}
            series={market?.distributionData || []}
            meanValue={meanValue}
            stdDevValue={stdDevValue}
            sliderValues={sliderNumericValues}
            minX={xSliderMin}
            maxX={xSliderMax}
            onSliderChange={handleSliderChange}
            isMarketResolving={isMarketResolving}
          />
          {/* Slider/Adjust Prediction */}
          {/* If you have a separate AdjustPrediction component, use it here. Otherwise, keep this as a placeholder. */}
          {/* <AdjustPrediction ... /> */}
          {/* Tabs */}
          <MarketTabs
            mode={mode}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        {/* Right Column: Prediction, Stats, Info */}
        <div className="flex flex-col gap-6">
          {/* Make a Prediction Box */}
          <PredictionControls
            mode={mode}
            marketId={marketId as `0x${string}`}
            requiredCollateral={requiredCollateral}
            isCollateralSufficient={isCollateralSufficient}
            collateralInput={collateralInput}
            onCollateralInputChange={setCollateralInput}
            onPlacePrediction={handlePlacePrediction}
          />
          {/* Stats Table */}
          <MarketStats
            mode={mode}
            numericXData={numericXData}
            meanValue={meanValue}
            stdDevValue={stdDevValue}
            positions={positions}
          />
          {/* Market Details/Info */}
          <MarketInfo
            mode={mode}
            market={market ? {
              fullDescription: market.fullDescription,
              expirationDate: Number(market.expirationDate),
              hasSettled: market.hasSettled,
              category: market.category
            } : null}
            onResolveClick={() => setShowResolutionModal(true)}
          />
        </div>
      </div>

      {/* Resolution Modal */}
      <MarketResolution
        mode={mode}
        showModal={showResolutionModal}
        isResolving={isResolving}
        finalValue={finalValue}
        onClose={() => setShowResolutionModal(false)}
        onResolve={() => {
          setIsResolving(true);
          // Handle market resolution
        }}
        onFinalValueChange={setFinalValue}
      />
    </div>
  );
}