import React, { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DistributionChart from './DistributionChart.tsx';

// Define the type for the market prop
export interface Market {
  id: string;
  question: string;
  currentPrediction: string; // This field remains in the interface for other uses (e.g. detail page)
  volume: string;
  liquidity: string;
  endDate: string;
  category: string;
  description?: string; // Added optional description field
  distributionData?: Array<{ x: string | number; y: number }>; // For continuous distributions
  discreteOptions?: string[]; // Added for Novice Mode betting
}

interface MarketCardProps {
  market: Market;
  mode: 'pro' | 'novice'; // Changed prop name from theme to mode
}

export default function MarketCard({ market, mode }: MarketCardProps) {
  const navigate = useNavigate();
  
  const [minValue, setMinValue] = useState('75000'); 
  const [maxValue, setMaxValue] = useState('95000'); 
  const marketMinRange = 0; 
  const marketMaxRange = 150000; 
  const [selectedDiscreteOption, setSelectedDiscreteOption] = useState<string | null>(null);

  const [showBettingControls, setShowBettingControls] = useState(false);

  // Theme-specific classes
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-surface';
  const cardBorderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const cardHoverBorderColor = mode === 'pro' ? 'hover:border-poseidon-accent-cyan/70' : 'hover:border-light-accent-primary/70'; // Kept for subtle hover feedback
  const cardHoverShadow = mode === 'pro' ? 'hover:shadow-poseidon-accent-cyan/10' : 'hover:shadow-light-accent-primary/10'; // Kept for subtle hover feedback
  const categoryBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-accent-secondary/20';
  const categoryTextColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-secondary';
  const categoryRingColor = mode === 'pro' ? 'ring-poseidon-border' : 'ring-light-accent-secondary/30';
  const questionTextColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const mutedTextColor = mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted';
  const primaryTextColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const sliderTrackBg = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-border';
  const sliderAccentColor = mode === 'pro' ? 'accent-poseidon-accent-cyan' : 'accent-light-accent-primary';
  const inputBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue/70' : 'bg-light-bg';
  const inputBorderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const inputFocusRingColor = mode === 'pro' ? 'focus:ring-poseidon-accent-cyan focus:border-poseidon-accent-cyan' : 'focus:ring-light-accent-primary focus:border-light-accent-primary';
  const buttonBgColor = mode === 'pro' ? 'bg-poseidon-accent-cyan hover:bg-cyan-400' : 'bg-light-accent-primary hover:bg-blue-600';
  const buttonTextColor = mode === 'pro' ? 'text-poseidon-deep-blue' : 'text-white';
  const discreteButtonBase = mode === 'novice' ? `border ${inputBorderColor} ${primaryTextColor} hover:border-light-accent-primary hover:bg-light-accent-primary/10` : '';
  const discreteButtonSelected = mode === 'novice' ? `!bg-light-accent-primary !text-white !border-light-accent-primary` : '';

  const handleNavigationAreaClick = (e: MouseEvent) => {
    // Allow navigation only if betting controls are NOT shown, and the click isn't on an already interactive part
    if (!showBettingControls) {
      // Check if the click target or its parent is the graph div, to prevent nav if graph is clicked.
      let targetElement = e.target as HTMLElement;
      while (targetElement && targetElement !== e.currentTarget as HTMLElement) {
        if (targetElement.dataset.isGraphContainer === 'true') return;
        targetElement = targetElement.parentElement as HTMLElement;
      }
      navigate(`/market/${market.id}`);
    }
  };

  const handleInitialPlaceBetClick = (e: MouseEvent) => {
    e.stopPropagation(); 
    setShowBettingControls(true);
  };

  const handleConfirmBetClick = (e: MouseEvent) => {
    e.stopPropagation();
    console.log('Confirm Bet clicked for market:', market.id, 'Pro Value:', (parseInt(minValue) + parseInt(maxValue)) / 2, 'Novice Option:', selectedDiscreteOption);
    alert('Bet Confirmed (see console)!');
    setShowBettingControls(false); 
  };

  // Conditional classes for the question title
  const titleBaseClasses = "font-semibold mt-2 mb-3";
  const titleNormalClasses = "text-lg min-h-[56px]"; // Approx 2 lines of 18px text
  const titleSmallClasses = "text-sm min-h-[40px]";  // Approx 2 lines of 14px text
  const titleDynamicClasses = showBettingControls ? titleSmallClasses : titleNormalClasses;

  return (
    <div 
      className={`relative rounded-lg shadow-xl p-3 border font-sans ${cardBgColor} ${cardBorderColor} ${cardHoverBorderColor} ${cardHoverShadow} transition-all duration-300 flex flex-col justify-between min-h-0`}
      onClick={() => {
        // If betting controls are shown, clicking on the card background (outside the controls) closes them.
        if (showBettingControls) {
          setShowBettingControls(false);
        }
      }}
    >
      {/* Section 1: Always visible Question & Graph (Graph is clickable for nav if controls hidden) */}
      <div 
        onClick={(e) => {
          // This is the navigation area. If betting controls are shown, we don't want clicks here
          // to propagate to the card's main onClick (which would close controls).
          // However, we DO want navigation if controls are NOT shown.
          // The stopPropagation here is conditional based on whether navigation will occur.
          if (!showBettingControls) {
            // Stop propagation to prevent card's main onClick if we are about to navigate
            e.stopPropagation(); 
            handleNavigationAreaClick(e);
          }
          // If showBettingControls is true, clicks here will propagate to the card's main onClick,
          // which will then close the betting controls. This is the desired "click away" behavior
          // for this top section.
          // Exception: if the click is specifically on the graph while controls are shown,
          // the graph's own stopPropagation will take precedence.
        }} 
        className={`${!showBettingControls ? 'cursor-pointer' : ''}`}
      >
          {!showBettingControls && (
            <span 
                className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ring-1 mb-2 ${categoryBgColor} ${categoryTextColor} ${categoryRingColor}`}>
                {market.category}
            </span>
          )}
        <h3 className={`${titleBaseClasses} ${titleDynamicClasses} ${questionTextColor}`}>{market.question}</h3>
        
        {mode === 'pro' && market.distributionData && (
          // Removed onClick handler from this div.
          // Clicks on the graph will now propagate up to the main card's onClick when betting controls are shown (closing them),
          // or be handled by Section 1 div's onClick for navigation purposes (which prevents nav on graph click) when controls are hidden.
          // The data-is-graph-container attribute is still used by handleNavigationAreaClick.
          <div className="w-full" data-is-graph-container="true" style={{ marginBottom: 0, paddingBottom: 0 }}>
            <DistributionChart data={market.distributionData} mode={mode} height={180} />
          </div>
        )}
      </div>

      {/* Section 2: Swappable content area */}
      <div className="flex-grow flex flex-col justify-end"> {/* Use flex-grow to push to bottom */} 
        {!showBettingControls ? (
          // Default View: Volume, Liquidity, Ends, Initial Place Bet Button
          <div className="mt-auto"> {/* Pushes this block to the bottom of its flex container */}
            <div className="grid grid-cols-2 gap-4 text-sm mt-0 mb-4" style={{ marginTop: 0, paddingTop: 0 }} onClick={(e) => e.stopPropagation()}>
                <div>
                <p className={`${mutedTextColor}`}>Volume:</p>
                <p className={`${primaryTextColor} font-medium`}>{market.volume}</p>
                </div>
                <div>
                <p className={`${mutedTextColor}`}>Liquidity:</p>
                <p className={`${primaryTextColor} font-medium`}>{market.liquidity}</p>
                </div>
            </div>
            <p className={`text-xs ${mutedTextColor} mb-3`} onClick={(e) => e.stopPropagation()}>Market ends: {new Date(market.endDate).toLocaleDateString()}</p>
            <button 
                onClick={handleInitialPlaceBetClick}
                className={`w-full font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${buttonBgColor} ${buttonTextColor}`}>
                Place Bet
            </button>
          </div>
        ) : (
          // Betting View: Controls, Confirm/Cancel buttons
          <div className="my-2 pt-2 border-t border-gray-600/50" onClick={(e) => e.stopPropagation()}> {/* X button removed from here */}
            {mode === 'novice' && market.discreteOptions && (
              <div className="space-y-2 mb-4"> {/* Removed mt-6 */}
                <p className={`text-sm font-semibold ${primaryTextColor} mb-2`}>Choose your prediction:</p>
                {market.discreteOptions.map((option) => (
                  <button 
                    key={option}
                    onClick={(e: MouseEvent) => { setSelectedDiscreteOption(option); }}
                    className={`w-full text-left p-3 rounded-md transition-all duration-150 text-sm ${discreteButtonBase} ${selectedDiscreteOption === option ? discreteButtonSelected : ''}`}>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {mode === 'pro' && (
              <div className="mb-4">
                <p className={`text-sm font-semibold ${primaryTextColor} mb-1`}>Your Prediction Range</p>
                <div className="relative mb-2">
                  <input 
                    type="range" min={marketMinRange} max={marketMaxRange} 
                    defaultValue={(parseInt(minValue) + parseInt(maxValue)) / 2}
                    onChange={(e) => { /* Basic handling, can be improved */ const midPoint = parseInt(e.target.value); setMinValue(String(midPoint - 1000)); setMaxValue(String(midPoint + 1000))}}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${sliderTrackBg} ${sliderAccentColor}`}
                  />
                  <div className={`flex justify-between text-xs ${mutedTextColor} mt-1 px-1`}>
                    <span>{marketMinRange}</span>
                    <span>{marketMaxRange}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label htmlFor={`min-value-${market.id}`} className={`block text-xs font-medium ${mutedTextColor} mb-0.5`}>Min Value</label>
                    <input type="number" id={`min-value-${market.id}`} value={minValue} 
                        onChange={(e) => setMinValue(e.target.value)} 
                        className={`w-full border text-center rounded-md p-2 ${inputBgColor} ${inputBorderColor} ${primaryTextColor} ${inputFocusRingColor}`}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`max-value-${market.id}`} className={`block text-xs font-medium ${mutedTextColor} mb-0.5`}>Max Value</label>
                    <input type="number" id={`max-value-${market.id}`} value={maxValue} 
                        onChange={(e) => setMaxValue(e.target.value)} 
                        className={`w-full border text-center rounded-md p-2 ${inputBgColor} ${inputBorderColor} ${primaryTextColor} ${inputFocusRingColor}`}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4"> {/* Simplified button container */}
              <button 
                onClick={handleConfirmBetClick}
                className={`w-full font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${buttonBgColor} ${buttonTextColor}`}>
                Confirm Bet
              </button>
            </div>
          </div>
        )}
      </div>
      {/* X button to close betting controls - now a direct child of the main card div */}
      {showBettingControls && (
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setShowBettingControls(false); 
          }}
          className={`absolute top-3 right-3 bg-transparent border-none p-0 focus:outline-none focus:ring-0 transition-colors ${mode === 'pro' ? 'text-poseidon-light-text hover:text-poseidon-accent-cyan' : 'text-light-text-muted hover:text-light-accent-primary'}`}
          aria-label="Close betting controls"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
} 