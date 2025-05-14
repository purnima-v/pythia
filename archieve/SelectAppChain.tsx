'use client'
import { type ChainId } from '@azuro-org/toolkit';
import { optimism, optimismSepolia } from 'viem/chains';
import { useSwitchChain, useChainId } from 'wagmi';

export function SelectAppChain() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value)
    switchChain({ chainId: +event.target.value as ChainId })
  }

  return (
    <select className='mr-4 cursor-pointer' value={chainId} onChange={handleChange}>
      <option value={optimism.id}>{optimism.name}</option>
      <option value={optimismSepolia.id}>{optimismSepolia.name}</option>
      {/* <option value={polygon.id}>{polygon.name}</option>
      <option value={chiliz.id}>{chiliz.name}</option>
      <option value={spicy.id}>{spicy.name}</option> */}
    </select>
  )
}
