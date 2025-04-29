'use client'

import { useWallets, useConnectWallet } from '@privy-io/react-auth';

export function ConnectWalletButton() {
  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();

  const handleCreateWallet = async () => {
    try {
      connectWallet();
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      <button onClick={handleCreateWallet}>Connect Wallet</button>
    </div>
  );
}