import React from 'react';
import { parseEther } from 'viem';
import { useWriteContract } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';
import { toast } from '../ui/toast';
import { PAIR_ABI } from '../../contracts/ABIs';

type PredictionControlsProps = {
  mode: 'pro' | 'novice';
  marketId: `0x${string}`;
  requiredCollateral: number;
  isCollateralSufficient: boolean;
  collateralInput: string;
  onCollateralInputChange: (value: string) => void;
  onPlacePrediction: () => void;
};

export default function PredictionControls({
  mode,
  marketId,
  requiredCollateral,
  isCollateralSufficient,
  collateralInput,
  onCollateralInputChange,
  onPlacePrediction
}: PredictionControlsProps) {
  const { writeContract } = useWriteContract();
  const [isPlacingPrediction, setIsPlacingPrediction] = React.useState(false);

  const inputValue = parseFloat(collateralInput);
  const isInputTooLow = isNaN(inputValue) || inputValue < requiredCollateral;

  const handlePlacePrediction = async () => {
    if (!isCollateralSufficient || !marketId) return;
    setIsPlacingPrediction(true);
    try {
      const tx = await writeContract({
        address: marketId,
        abi: PAIR_ABI,
        functionName: 'buy',
        args: [parseEther(collateralInput), parseEther(collateralInput)]
      });
      await waitForTransaction({ hash: tx });
      toast({
        title: 'Success',
        description: 'Prediction placed successfully!'
      });
      onPlacePrediction();
    } catch (error) {
      console.error('Error placing prediction:', error);
      toast({
        title: 'Error',
        description: 'Failed to place prediction',
        variant: 'destructive'
      });
    } finally {
      setIsPlacingPrediction(false);
    }
  };

  const inputBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const borderColor = isInputTooLow ? 'border-red-500' : (mode === 'pro' ? 'border-poseidon-border' : 'border-light-border');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Make a Prediction</h3>
      <div className={`p-4 rounded-lg ${mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-card'}`}> 
        {/* Required Collateral Warning - only show if input is too low */}
        {isInputTooLow && (
          <div className="mb-4">
            <div className="border border-red-500 bg-red-50 text-red-700 rounded px-3 py-2 text-sm font-semibold flex items-center gap-2">
              <span>Required Collateral: <span className="font-bold">${requiredCollateral.toLocaleString()}</span></span>
            </div>
            <div className="text-xs text-red-500 mt-1 ml-1">Enter at least ${requiredCollateral.toLocaleString()} to place a bet.</div>
          </div>
        )}
        {/* Collateral Input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Your Collateral</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">$</span>
            <input
              type="number"
              value={collateralInput}
              onChange={(e) => onCollateralInputChange(e.target.value)}
              className={`w-full pl-7 pr-2 py-2 rounded border text-sm ${inputBgColor} ${borderColor}`}
              placeholder="Enter amount"
            />
          </div>
        </div>
        <button
          onClick={handlePlacePrediction}
          disabled={isInputTooLow || isPlacingPrediction}
          className={`w-full py-2 rounded font-semibold transition-colors ${
            !isInputTooLow && !isPlacingPrediction
              ? (mode === 'pro' 
                  ? 'bg-cyan-100 text-gray-800 hover:bg-cyan-200' 
                  : 'bg-blue-100 text-gray-800 hover:bg-blue-200')
              : 'bg-gray-100 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isPlacingPrediction ? 'Placing...' : 'Place Bet'}
        </button>
      </div>
    </div>
  );
}
