import { ConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectWalletButton = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <ConnectButton label='CONNECT WALLET'/>
    </div>
  );
};