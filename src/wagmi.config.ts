import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

// Generate or hardcode a mock account
const account = privateKeyToAccount(generatePrivateKey()); // or use a fixed private key

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    mock({
      accounts: [account.address],
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});