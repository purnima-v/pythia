'use client'

import { useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { optimism, optimismSepolia, sepolia, mainnet } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

import { ConnectedWallet } from "@privy-io/react-auth";
import { useAddress } from '../wallet_context/addressContext';

interface WalletSelectorProps {
  selectedWalletAddress: string;
}



export function ChainSelector({selectedWalletAddress }: WalletSelectorProps) {
  const { wallets } = useWallets();
  const { chain } = useAccount();
  const { chains, error: switchNetworkError, switchChain } = useSwitchChain();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { walletType } = useAddress()
  

  useEffect(() => {
    if (switchNetworkError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    // console.log('curr chain: ', chain);
  }, [switchNetworkError]);

  const handleChainSwitch = async (chainId: number) => {

    if (chainId === -1) {
      console.log("No chain selected")
      return;
    }

    try {
      setSwitching(true);
      setError(null);
      await switchChain({ chainId });
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {switchNetworkError && showError && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 px-4 py-3 bg-red-100 text-red-500 text-sm font-medium rounded-md shadow-lg whitespace-nowrap z-[9999] flex items-center gap-2 transition-opacity duration-300">
          <ExclamationCircleIcon className="h-5 w-5" />
          Network switch error: {switchNetworkError.message}
        </div>
      )}
      
      <div className="flex flex-row items-center gap-2 w-full">
        {walletType === 'Embedded' ? (
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm text-amber-500/80 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-full">
              Embedded Wallet (Network switching disabled)
            </span>
          </div>
        ) : (
          <div className="relative w-full flex flex-col gap-2">
            {chain && (
              <p className="text-sm flex items-center gap-2">
                <span className="text-gray-400">Connected to</span>
                <span className="font-mono bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-amber-500 font-medium shadow-sm">
                  {chain.name}
                </span>
              </p>
            )}

            <select
              value={chain?.id || -1}
              onChange={(e) => handleChainSwitch(Number(e.target.value))}
              disabled={switching || !selectedWalletAddress}
              className="w-full p-2 border rounded-md bg-orange-400 hover:bg-orange-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            >
              <option value={-1}>NONE</option>
              <option value={optimism.id}>{optimism.name}</option>
              <option value={optimismSepolia.id}>{optimismSepolia.name}</option>
              <option value={sepolia.id}>{sepolia.name}</option>
              <option value={mainnet.id}>{mainnet.name}</option>
            </select>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      {switching && <p className="text-blue-500 text-sm font-medium animate-pulse">Switching network...</p>}
    </div>
  );
}