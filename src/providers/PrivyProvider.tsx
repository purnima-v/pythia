import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';
import type { ReactNode } from 'react';
import { mainnet } from 'viem/chains';
import { PositionsProvider, usePositions } from '../contexts/PositionsContext';

interface PrivyProviderProps {
  children: ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  const { addPosition } = usePositions();

  return (
    <PositionsProvider>
      <PrivyProviderBase
        appId="cmasu2bdd010cl40m78u3a683"
        config={{
          appearance: {
            theme: 'light',
            accentColor: '#0EA5E9',
            showWalletLoginFirst: true,
          },
          embeddedWallets: {
            createOnLogin: 'off',
          },
          defaultChain: mainnet,
          supportedChains: [mainnet],
        }}
      >
        {children}
      </PrivyProviderBase>
    </PositionsProvider>
  );
} 