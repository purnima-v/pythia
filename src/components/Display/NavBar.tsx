'use client'
import React from 'react'
import { ActiveLink } from './ActiveLink'

import { LiveSwitcher, SelectAppChain } from '@/components'
import { ConnectWalletButton } from './connectWallet'
import { CreateNewBet } from './CreateNewBet'

import * as Logo from '@/assets/logo.png'

export function NavBar() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/events/top', label: 'Events', regex: '^/events(/|$)' }, // Regex for /events/*
    { href: '/bets', label: 'Bets' },
  ]

  return (
    <div className="flex items-center border-b border-orange-200 bg-yellow-800 w-full h-full min-h-25">
      <img src={Logo.default.src} alt="Logo" className="w-25 h-25" />

      
      <nav className="ml-10 flex space-x-4">
        {links.map(({ href, label, regex }) => {
          return (
            <ActiveLink
              key={href}
              href={href}
              regex={regex}
              className="underline hover:text-yellow-300 py-2 px-2 rounded"
              activeClassName="font-bold !text-green-600 bg-gray-700"
            >
              {label}
            </ActiveLink>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center">
        <LiveSwitcher />
        <SelectAppChain />
        <ConnectWalletButton />
      </div>
    </div>
  )
}