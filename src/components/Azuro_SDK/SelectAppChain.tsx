'use client'
import { useChain } from '@azuro-org/sdk';
import { type ChainId } from '@azuro-org/toolkit';
import { optimism, optimismSepolia } from 'viem/chains';

export function SelectAppChain() {
  const { appChain, setAppChainId } = useChain()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAppChainId(+event.target.value as ChainId)
  }

  return (
    <select className='mr-4 cursor-pointer' value={appChain.id} onChange={handleChange}>
      <option value={optimism.id}>{optimism.name}</option>
      {/* <option value={optimismSepolia.id}>{optimismSepolia.name}</option> */}
      {/* <option value={polygon.id}>{polygon.name}</option>
      <option value={chiliz.id}>{chiliz.name}</option>
      <option value={spicy.id}>{spicy.name}</option> */}
    </select>
  )
}
