'use client'

import { useEffect, useState } from 'react';
import { sepolia } from 'viem/chains';
import { useAccount, useDisconnect, useConnect } from 'wagmi';

import WalletManagementColumn from './Sections/WalletManagementColumn';
import WalletInformationColumn from './Sections/WalletInformationColumn';
import TransactionsColumn from './Sections/TransactionsColumn';

interface Web3DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Web3Dashboard({ isOpen, onClose }: Web3DashboardProps) {
  
  const [selectedWalletAddress, setSelectedWalletAddress] = useState("");
//   const [selectedChain, setSelectedChain] = useState<typeof sepolia>(sepolia);
  let { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { connect } = useConnect();
  
  const { disconnect } = useDisconnect();

  useEffect(() => {
    

  }, [selectedWalletAddress]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-7xl mx-auto ">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-[#1e293b] text-white rounded-full p-2 hover:bg-[#334155] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="min-h-[50vh] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-950 via-stone-600 to-gray-750 border border-amber-500/30 p-6 rounded-xl shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">Wallet</h1>
              <div className="flex items-center space-x-3 mr-10">
                <div className="px-4 py-2 rounded-full bg-[#1e293b] text-white text-sm border border-[#334155]">
                  {isConnecting && <span className="text-yellow-400 font-medium">🟡 Connecting...</span>}
                  {isConnected && <span className="text-green-400 font-medium">🟢 Connected</span>}
                  {isDisconnected && <span className="text-red-400 font-medium">🔴 Disconnected</span>}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <WalletManagementColumn 
                selectedWalletAddress={selectedWalletAddress}
                setSelectedWalletAddress={setSelectedWalletAddress}
                // setSelectedChain={setSelectedChain}
              />

              <WalletInformationColumn 
                isConnected={isConnected}
                address={address}
              />

              <TransactionsColumn 
                isConnected={isConnected}
                disconnect={disconnect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}