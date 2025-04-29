'use client';

import { useState } from 'react';
import Button from './Button';
import Wrapper from './Wrapper';
import {parseEther} from 'viem';
import type {Config} from 'wagmi';
import {useSendTransaction} from 'wagmi';
import type {SendTransactionVariables} from 'wagmi/query';

const SendTransaction = () => {
  const [address, setAddress] = useState("0xF2A919977c6dE88dd8ed90feAADFcC5d65D66038");
  const [amount, setAmount] = useState(0);


  const handleSendTransaction = () => {
    const transactionRequest: SendTransactionVariables<Config, number> = {
      // to: `${address}`,
      to: `${address}` as `0x${string}`,
      value: parseEther(`${amount}`),
      type: 'eip1559',
    };

    sendTransaction(transactionRequest)
  }

  const {data, isPending, isSuccess, sendTransaction} = useSendTransaction();

  return (
    // <Wrapper title="useSendTransaction">
      <div className='py-2 mx-3 space-y-4'>
      {/* <div className="rounded bg-red-400 px-2 py-1 text-sm text-white">
        We recommend doing this on sepolia.
      </div> */}

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-300">Recipient Address</label>
        <input
          className="border rounded px-2 py-1 w-full"
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-300">Amount (ETH)</label>
        <input
          className="border rounded px-2 py-1 w-full"
          placeholder="0.0"
          type="number"
          step="0.001"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </div>

      <button
        className="rounded bg-slate-800 px-10 py-2 text-white transition-all hover:bg-slate-900 active:bg-slate-900 enabled:hover:cursor-pointer enabled:active:scale-90 disabled:opacity-80 w-full mt-2"
        onClick={() => handleSendTransaction()}
        disabled={!sendTransaction}
      >
        Send Crypto
      </button>
      
      {isPending && <div className="mt-4 text-yellow-400">Check wallet</div>}
      {isSuccess && <div className="mt-4 text-green-400 break-all">Transaction: {JSON.stringify(data)}</div>}
    
      </div>
    // </Wrapper>

  );
};

export default SendTransaction;
