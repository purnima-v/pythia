'use client'


import { useAccount } from 'wagmi';

export function ChainStatus() {
  
  const { chain } = useAccount();
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <p className="text-sm flex items-center gap-2">
          <span className="text-gray-400">Connected to</span>
          {chain ? (
            <span className="font-mono bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-amber-500 font-medium shadow-sm">
              {chain.name}
            </span>
          ) : (
            <span className="font-mono bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-amber-500 font-medium shadow-sm">
              NONE
            </span>
          )}
        </p>
        
      </div>
    </div>
  );
}