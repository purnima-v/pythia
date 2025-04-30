'use client'

import { ChainSelector } from '@/components/PRIVY/wallet/ChainSelector';
import { ImportWalletButton } from '@/components/PRIVY/wallet/ImportWalletButton';
import { WalletSelector } from '@/components/PRIVY/wallet/WalletSelector';
import { sepolia } from 'viem/chains';
import {useSetActiveWallet} from '@privy-io/wagmi';

import { useWallets, useConnectWallet, ConnectedWallet } from '@privy-io/react-auth';

interface WalletManagementColumnProps {
  selectedWalletAddress: string;
  setSelectedWalletAddress: (address: string) => void;
//   selectedChain: typeof sepolia;
//   setSelectedChain: (chain: typeof sepolia) => void;
}


export default function WalletManagementColumn({
  selectedWalletAddress,
  setSelectedWalletAddress,
//   setSelectedChain
}: WalletManagementColumnProps) {

    const { wallets } = useWallets();
    const { connectWallet } = useConnectWallet();

    const {setActiveWallet} =  useSetActiveWallet()
    
    
    const handleSetSelectedWalletAddress = (wallet: ConnectedWallet) => {
      console.log("wallet", wallet)
      setSelectedWalletAddress(wallet.address);
      setActiveWallet(wallet)
    };

    const handleCreateWallet = async () => {
      try {
        connectWallet();
      } catch (error) {
        console.error("Error creating wallet:", error);
      }
    };


  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-[#334155]">
        <h2 className="text-xl font-semibold text-white">Wallet Management</h2>
      </div>
      <div className="p-6 space-y-5">
        <div className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex justify-center items-center">
          <div className="space-y-6">
            <button onClick={handleCreateWallet}>Connect Wallet</button>
          </div>
        </div>
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Network</label>
          <ChainSelector 
            // onChainChange={setSelectedChain} 
          />
        </div>
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Wallet</label>
          <WalletSelector 
            wallets={wallets}
            selectedWalletAddress={selectedWalletAddress}
            onWalletSelect={handleSetSelectedWalletAddress}
          />
        </div>
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Import Wallet</label>
          <div className="bg-[#2d3748] hover:bg-[#374151] rounded-lg p-4 cursor-pointer transition-colors duration-200 border border-[#4b5563] hover:border-[#6b7280]">
            <ImportWalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}