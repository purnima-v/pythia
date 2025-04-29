'use client';

import Balance from './PRIVY/Balance';
import BlockNumber from './PRIVY/BlockNumber';
import Button from './PRIVY/Button';
import ContractEvent from './PRIVY/ContractEvent';
import ContractRead from './PRIVY/ContractRead';
import ContractReads from './PRIVY/ContractReads';
import ContractWrite from './PRIVY/ContractWrite';
import EnsAddress from './PRIVY/EnsAddress';
import EnsAvatar from './PRIVY/EnsAvatar';
import EnsName from './PRIVY/EnsName';
import EnsResolver from './PRIVY/EnsResolver';
import FeeData from './PRIVY/FeeData';
import PublicClient from './PRIVY/PublicClient';
import SendTransaction from './PRIVY/SendTransaction';
import SignMessage from './PRIVY/SignMessage';
import SignTypedData from './PRIVY/SignTypedData';
import Signer from './PRIVY/Signer';
import SwitchNetwork from './PRIVY/SwitchNetwork';
import Token from './PRIVY/Token';
import Transaction from './PRIVY/Transaction';
import WaitForTransaction from './PRIVY/WaitForTransaction';
import WalletClient from './PRIVY/WalletClient';
import WatchPendingTransactions from './PRIVY/WatchPendingTransactions';
import {shorten} from '../lib/utils';
import Image from 'next/image';
import {useAccount, useDisconnect} from 'wagmi';

import {usePrivy, useWallets} from '@privy-io/react-auth';
import {useSetActiveWallet} from '@privy-io/wagmi';

import wagmiPrivyLogo from '../public/wagmi_privy_logo.png';

const MonoLabel = ({label}: {label: string}) => {
  return <span className="rounded-xl bg-slate-200 px-2 py-1 font-mono">{label}</span>;
};

export default function Home() {
  // Privy hooks
  const {ready, user, authenticated, login, connectWallet, logout, linkWallet} = usePrivy();
  const {wallets, ready: walletsReady} = useWallets();

  // WAGMI hooks
  const {address, isConnected, isConnecting, isDisconnected} = useAccount();
  const {disconnect} = useDisconnect();
  const {setActiveWallet} = useSetActiveWallet();

  if (!ready) {
    return null;
  }

  return (
    <>
      <main className="min-h-screen bg-slate-200 p-4 text-slate-800">
        <Image
          className="mx-auto rounded-lg"
          src={wagmiPrivyLogo}
          alt="wagmi x privy logo"
          width={400}
          height={100}
        />
        <p className="my-4 text-center">
          This demo showcases how you can integrate{' '}
          <a href="https://wagmi.sh/" className="font-medium underline">
            wagmi
          </a>{' '}
          alongside{' '}
          <a href="https://www.privy.io/" className="font-medium underline">
            Privy
          </a>{' '}
          in your React app. Login below to try it out!
          <br />
          For more information, check out{' '}
          <a href="https://docs.privy.io/guide/guides/wagmi" className="font-medium underline">
            our integration guide
          </a>{' '}
          or the{' '}
          <a href="https://github.com/privy-io/wagmi-demo" className="font-medium underline">
            source code
          </a>{' '}
          for this app.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
            <h1 className="text-4xl font-bold">Privy</h1>
            {ready && !authenticated && (
              <>
                <p>You are not authenticated with Privy</p>
                <div className="flex items-center gap-4">
                  <Button onClick_={login} cta="Login with Privy" />
                  <span>or</span>
                  <Button onClick_={connectWallet} cta="Connect only" />
                </div>
              </>
            )}

            {walletsReady &&
              wallets.map((wallet) => {
                return (
                  <div
                    key={wallet.address}
                    className="flex min-w-full flex-row flex-wrap items-center justify-between gap-2 bg-slate-50 p-4"
                  >
                    <div>
                      <MonoLabel label={shorten(wallet.address)} />
                    </div>
                    <Button
                      cta="Make active"
                      onClick_={() => {
                        setActiveWallet(wallet);
                      }}
                    />
                  </div>
                );
              })}

            {ready && authenticated && (
              <>
                <p className="mt-2">You are logged in with privy.</p>
                <Button onClick_={connectWallet} cta="Connect another wallet" />
                <Button onClick_={linkWallet} cta="Link another wallet" />
                <textarea
                  value={JSON.stringify(wallets, null, 2)}
                  className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
                  rows={JSON.stringify(wallets, null, 2).split('\n').length}
                  disabled
                />
                <br />
                <textarea
                  value={JSON.stringify(user, null, 2)}
                  className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
                  rows={JSON.stringify(user, null, 2).split('\n').length}
                  disabled
                />
                <br />
                <Button onClick_={logout} cta="Logout from Privy" />
              </>
            )}
          </div>
          <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
            <h1 className="text-4xl font-bold">WAGMI</h1>
            <p>
              Connection status: {isConnecting && <span>🟡 connecting...</span>}
              {isConnected && <span>🟢 connected.</span>}
              {isDisconnected && <span> 🔴 disconnected.</span>}
            </p>
            {isConnected && address && (
              <>
                <h2 className="mt-6 text-2xl">useAccount</h2>
                <p>
                  address: <MonoLabel label={address} />
                </p>

                <Balance />
                <Signer />
                <SignMessage />
                <SignTypedData />
                <PublicClient />
                <EnsName />
                <EnsAddress />
                <EnsAvatar />
                <EnsResolver />
                <SwitchNetwork />
                <BlockNumber />
                <SendTransaction />
                <ContractRead />
                <ContractReads />
                <ContractWrite />
                <ContractEvent />
                <FeeData />
                <Token />
                <Transaction />
                <WatchPendingTransactions />
                <WalletClient />
                <WaitForTransaction />

                <h2 className="mt-6 text-2xl">useDisconnect</h2>
                <Button onClick_={disconnect} cta="Disconnect from WAGMI" />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
