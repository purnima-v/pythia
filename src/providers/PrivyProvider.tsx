import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';
import type { ReactNode } from 'react';
import { mainnet } from 'viem/chains';

interface PrivyProviderProps {
  children: ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  return (
    <PrivyProviderBase
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#0EA5E9',
          showWalletLoginFirst: true,
          logo: 'https://pythia.xyz/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        defaultChain: mainnet,
        supportedChains: [mainnet],
      }}
    >
      {children}
    </PrivyProviderBase>
  );
} 