'use client'

import { ConnectedWallet } from "@privy-io/react-auth";
import { useState } from "react";

import { useEmbedded } from "../wallet_context/embeddedContext";

interface WalletSelectorProps {
  wallets: ConnectedWallet[];
  selectedWalletAddress: string;
  onWalletSelect: (wallet: ConnectedWallet) => void;
}

export function WalletSelector({ wallets, selectedWalletAddress, onWalletSelect }: WalletSelectorProps) {
  const { showEmbedded, toggleEmbeddedInfo} = useEmbedded();
  
  
  const filteredWallets = wallets.filter(wallet => {
    const isEmbedded = wallet.connectorType === "embedded";
    return showEmbedded ? isEmbedded : !isEmbedded;
  });

  // if (!filteredWallets.length) {
  //   setError('No wallet connected');
  //   return;
  // }

  return (
    <div className="flex flex-col gap-4 w-full">
      <select
        value={selectedWalletAddress}
        onChange={(e) => {
          const selectedWallet = wallets.find(wallet => wallet.address === e.target.value);  // Is this needed?
          onWalletSelect(selectedWallet!);
        }}
        disabled={!wallets.length}
        className="p-2 border rounded-md bg-[#1a202c] text-white border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200"
      >
        <option value="">Select a wallet</option>
        {filteredWallets.map((wallet) => (
          <option key={wallet.address} value={wallet.address}>
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)} {wallet.imported ? '(Imported)' : ''}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-4 mb-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showEmbedded}
            onChange={() => toggleEmbeddedInfo()}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gradient-to-r from-gray-700 to-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gradient-to-br after:from-amber-400 after:to-orange-500 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-500 after:ease-in-out peer-checked:after:bg-gradient-to-br peer-checked:after:from-orange-500 peer-checked:after:to-amber-400 peer-checked:bg-gradient-to-r peer-checked:from-amber-700 peer-checked:to-orange-600 after:shadow-lg"></div>
          <span className="ml-3 text-sm font-medium text-gray-400">
            {showEmbedded ? 'Embedded Wallets (needs work)' : 'External Wallets'} {/* FIX: WORK ON THIS */}
          </span>
        </label>
      </div>
    </div>
  );
}