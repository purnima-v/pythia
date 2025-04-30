'use client'

import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { optimism, optimismSepolia, sepolia, mainnet } from 'viem/chains';

// interface ChainSelectorProps {
//   onChainChange: (chain: any) => void;
// }

export function ChainSelector(
  // { onChainChange }: ChainSelectorProps
) {
  const { wallets } = useWallets();
  const [selectedChain, setSelectedChain] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChainSwitch = async (chainId: number) => {
    if (!wallets.length) {
      setError('No wallet connected');
      return;
    }

    try {
      setSwitching(true);
      setError(null);
      const wallet = wallets[0];
      await wallet.switchChain(chainId);
      setSelectedChain(chainId);

      const chain = [optimism, optimismSepolia, sepolia, mainnet].find(c => c.id === chainId);
      if (!chain) {
        throw new Error('Unsupported chain');
      }
      
      // onChainChange(chain);
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-1/2">
      <select
        value={selectedChain}
        onChange={(e) => handleChainSwitch(Number(e.target.value))}
        disabled={switching || !wallets.length}
        className="p-2 border rounded-md bg-orange-400 hover:bg-orange-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
      >
        <option value={optimism.id}>{optimism.name}</option>
        <option value={optimismSepolia.id}>{optimismSepolia.name}</option>
        <option value={sepolia.id}>{sepolia.name}</option>
        <option value={mainnet.id}>{mainnet.name}</option>
      </select>
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      {switching && <p className="text-blue-500 text-sm font-medium animate-pulse">Switching network...</p>}
    </div>
  );
}