import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(generatePrivateKey());

export const mockWagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    mock({
      accounts: [account.address],
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});