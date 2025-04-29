'use client'

interface WalletSelectorProps {
  wallets: any[];
  selectedWalletAddress: string;
  onWalletSelect: (address: string) => void;
}

export function WalletSelector({ wallets, selectedWalletAddress, onWalletSelect }: WalletSelectorProps) {
  return (
    <div className="flex flex-col gap-4 w-1/2">
      <select
        value={selectedWalletAddress}
        onChange={(e) => onWalletSelect(e.target.value)}
        disabled={!wallets.length}
        className="p-2 border rounded-md bg-orange-400"
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