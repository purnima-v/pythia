import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { PrivyProvider } from '../providers/PrivyProvider';
import { config as wagmiConfig } from '../wagmi.config';
import { AutoMockConnect } from '../AutoMockContract';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';
  return (
    <PrivyProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {useMock && <AutoMockConnect />}
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}