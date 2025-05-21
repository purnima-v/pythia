// hooks/useMockPlaceBet.ts
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useConnect } from 'wagmi';

interface PlaceBetArgs {
  marketId: string;
  mean: number;
  stdDev: number;
  collateral: number;
}

export function useMockPlaceBet() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (!isConnected) {
        const mock = connectors.find(c => c.id == 'mock'); 
        if (mock) connect({connector: mock}); 
      //connect({ connector: connectors[0] });
    }
  }, [isConnected, connectors, connect]);

  const placeBet = async (args: PlaceBetArgs) => {
    setIsLoading(true);
  
    console.log('📦 Mock placing bet with args:', {
      address,
      isConnected,
      args,
    });
  
    await new Promise((res) => setTimeout(res, 1000));
  
    setIsLoading(false);
    setIsSuccess(true);
  };

  return { placeBet, isLoading, isSuccess };
}