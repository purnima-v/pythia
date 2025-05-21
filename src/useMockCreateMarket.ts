// hooks/useMockCreateMarket.ts
import { useState } from 'react';

interface CreateMarketArgs {
  question: string;
  endDate: string;
  category: string;
  type: 'discrete' | 'continuous';
  options?: string[];
  range?: [number, number];
}

export function useMockCreateMarket() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createMarket = async (args: CreateMarketArgs) => {
    setIsLoading(true);
    console.log('🛠️ Mock creating market with:', args);
    await new Promise((res) => setTimeout(res, 1000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  return { createMarket, isLoading, isSuccess };
}