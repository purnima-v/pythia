'use client'
import React, { useEffect } from 'react'

import { ActiveLink, LiveSwitcher, SelectAppChain } from '@/components'
import { reconnect } from '@wagmi/core'
import { useConfig } from 'wagmi'

import { ConnectWalletButton } from './connectWallet'

import * as Logo from '@/assets/logo.png'



export function NavBar() {
  const config = useConfig()

  useEffect(() => {
    ;(async () => {
      try {
        await reconnect(config)
      }
      catch {}
    })()
  }, [])

  return (
    <header className="flex items-center  border-b border-orange-200 bg-yellow-800 w-full">
      
      <img src={Logo.default.src} alt="Logo" className="w-25 h-25" />
      
      <div className="flex ml-10 text-black text-bold text-sm font-semibold px-3.5">
        {[
          { href: '/events/top', regex: '^\\/events\\/[^/]+?$', label: 'Events' },
          { href: '/bets', regex: '^\\/bets', label: 'Bets' },
          // Uncomment and add more items as needed
          // { href: '/wave', regex: '^\\/wave', label: 'Azuro Wave' },
        ].map(({ href, regex, label }, index) => (
            <ActiveLink
            key={index}
            className="hover:text-black transition ml-4 first:ml-0 bg-yellow-500 rounded-lg px-2 underline"
            activeClassName="!text-black font-semibold !cursor-default"
            href={href}
            regex={regex}
            >
            {label}
            </ActiveLink>
        ))}
      </div>
      
      <div className="ml-auto flex items-center">
        <LiveSwitcher />
        <SelectAppChain />

        <ConnectWalletButton />
          
      </div>
    </header>
  )
}
