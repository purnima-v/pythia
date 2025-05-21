import { useState } from 'react';
import { useWriteContract, useTransaction } from 'wagmi';
import { toast } from '../components/ui/toast';
import confetti from 'canvas-confetti';
import { dummyAbi, dummyAddress } from '../contracts/dummyMarket';

interface PlaceBetParams {
  marketId: string;
  mean: number;
  stdDev: number;
  collateral: number;
  onSuccess?: (params: PlaceBetParams) => void;
}

export function usePlaceBet() {
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const { writeContract } = useWriteContract();

  const placeBet = async ({ marketId, mean, stdDev, collateral, onSuccess }: PlaceBetParams) => {
    try {
      console.log('Starting bet placement...');
      setIsPlacingBet(true);
      
      // Show loading toast
      toast({
        title: "Placing your bet...",
        description: "Please wait while we process your transaction.",
      });

      // Convert numbers to bigint for contract
      const meanBigInt = BigInt(Math.round(mean * 1e6));
      const stdDevBigInt = BigInt(Math.round(stdDev * 1e6));
      const collateralBigInt = BigInt(Math.round(collateral * 1e6));

      console.log('Calling contract...');
      // Call contract
      await writeContract({
        abi: dummyAbi,
        address: dummyAddress,
        functionName: 'placeBet',
        args: [marketId, meanBigInt, stdDevBigInt, collateralBigInt],
      });

      // Show success toast with confetti
      toast({
        title: "✅ Bet Placed!",
        description: `Your bet of $${collateral.toLocaleString()} has been placed successfully.`,
      });

      // Trigger confetti
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

      console.log('Calling onSuccess callback...');
      // Call onSuccess callback
      onSuccess?.({ marketId, mean, stdDev, collateral });
    } catch (error) {
      console.error('Error placing bet:', error);
      toast({
        title: "❌ Transaction Failed",
        description: "There was an error placing your bet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingBet(false);
    }
  };

  return {
    placeBet,
    isPlacingBet,
  };
} 