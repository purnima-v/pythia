'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy, gnosis, polygon, chiliz, spicy } from 'wagmi/chains'
import { WagmiProvider } from 'wagmi'
import { AzuroSDKProvider, LiveProvider } from '@azuro-org/sdk'
import { ChainId } from '@azuro-org/toolkit';
import { PrivyProvider } from '@privy-io/react-auth';

import { BetProvider } from '@/components/Display/Bets/betContext'
import { BetslipProvider } from '@/components/Azuro_SDK/context/betslip'
import { BetSummaryProvider } from '@/components/Azuro_SDK/context/betsummary'
import { Address } from 'viem';

import 'dotenv'

// const appid = process.env.privyAppID
// const clientid = process.env.privyClientIDWeb

const appid = "cm9u706yj05nhju0mk8pl5f5j"
const clientid = "client-WY5iwwDdSAXhYAyiyAD3NqRkScEgJu8TAfLpk9RWW2vuK"

const { wallets } = getDefaultWallets()

const chains = [
  polygonAmoy,
  gnosis,
  polygon,
  chiliz,
  spicy,
] as const

const wagmiConfig = getDefaultConfig({
  appName: 'Pythia',
  projectId: '2f82a1608c73932cfc64ff51aa38a87b',
  wallets,
  chains,
  ssr: false,
})

const queryClient = new QueryClient()

type ProvidersProps = {
  children: React.ReactNode
  initialChainId?: string
  initialLiveState?: boolean
}


export function Providers(props: ProvidersProps) {
  const { children, initialChainId, initialLiveState } = props

  const chainId = initialChainId &&
                  chains.find(chain => chain.id === +initialChainId) ? +initialChainId as ChainId : polygonAmoy.id

  // console.log(clientid)
  // console.log(appid)

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AzuroSDKProvider initialChainId={chainId} isBatchBetWithSameGameEnabled affiliate={process.env.NEXT_PUBLIC_AFFILIATE_ADDRESS as Address}>
            <BetslipProvider>
              <BetSummaryProvider>
                <BetProvider>
                  <LiveProvider initialLiveState={initialLiveState}>
                    <PrivyProvider
                      appId={appid!}
                      clientId={clientid!}
                      config={{
                        // Create embedded wallets for users who don't have a wallet
                        embeddedWallets: {
                          createOnLogin: 'users-without-wallets'
                        }
                      }}
                    >
                      {children}
                    </PrivyProvider>
                  </LiveProvider>
                </BetProvider>
              </BetSummaryProvider>
            </BetslipProvider>
          </AzuroSDKProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
