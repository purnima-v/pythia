'use client';

import {useAccount, useBalance} from 'wagmi';
import { useAddress } from '../Wallet/wallet_context/addressContext';

const Balance = () => {
  const {selectedAddress} = useAddress();
  const {data, isError, isLoading} = useBalance({
    address: `0x${selectedAddress}`
  });


  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <>
      <h2 className="mt-6 text-2xl">useBalance</h2>
      {isLoading && <p>fetching balance...</p>}
      {isError && <p>Error fetching balance.</p>}
      {data && (
        <p>
          Balance: {data?.formatted} {data?.symbol}
        </p>
      )}
    </>
  );
};

export default Balance;
