'use client'

import Balance from '@/components/PRIVY/Balance';
import Signer from '@/components/PRIVY/Signer';
import { useAddress } from '../wallet_context/addressContext';

interface WalletInformationColumnProps {
  isConnected: boolean;
  address: string | undefined;
}

export default function WalletInformationColumn({
  isConnected
}: WalletInformationColumnProps) {

  const { selectedAddress } = useAddress()

  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-[#334155]">
        <h2 className="text-xl font-semibold text-white">Wallet Information</h2>
      </div>
      <div className="p-6 space-y-5">
        {isConnected && selectedAddress ? (
          <>
            <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Connected Address</span>
              </div>
              <div className="font-mono text-sm text-white break-all bg-[#1a202c] p-3 rounded border border-[#4b5563]">
                {selectedAddress}
              </div>
            </div>
            <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200">
              <Balance />
            </div>
            {/* <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200">
              <Signer />
            </div> */}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2d3748] flex items-center justify-center mb-4 border border-[#4b5563]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-300 mb-2">No Wallet Connected</p>
            <p className="text-sm text-gray-400">Connect a wallet to view your balance and information</p>
          </div>
        )}
      </div>
    </div>
  );
}