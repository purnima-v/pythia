import React from 'react';
import { useAccount, useContractWrite } from 'wagmi';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "exampleFunction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const ContractWriteExample = () => {
  const { address } = useAccount();

  const { write, isLoading, isSuccess, error } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'exampleFunction',
  });

  return (
    <div>
      <div>Connected address: {address}</div>
      <button onClick={() => write?.()} disabled={isLoading}>
        Call Contract Function
      </button>
      {isSuccess && <div>Transaction sent!</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default ContractWriteExample; 