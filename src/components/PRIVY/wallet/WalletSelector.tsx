'use client'

import { ConnectedWallet } from "@privy-io/react-auth";

interface WalletSelectorProps {
  wallets: any[];
  selectedWalletAddress: string;
  onWalletSelect: (wallet: ConnectedWallet) => void;
}

export function WalletSelector({ wallets, selectedWalletAddress, onWalletSelect }: WalletSelectorProps) {

  return (
    <div className="flex flex-col gap-4 w-full">
      <select
        value={selectedWalletAddress}
        onChange={(e) => {
          const selectedWallet = wallets.find(wallet => wallet.address === e.target.value);
          onWalletSelect(selectedWallet);
        }}
        disabled={!wallets.length}
        className="p-2 border rounded-md bg-[#1a202c] text-white border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200"
      >
        <option value="">Select a wallet</option>
        {wallets.map((wallet) => (
          <option key={wallet.address} value={wallet.address}>
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)} {wallet.imported ? '(Imported)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}