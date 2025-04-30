'use client'
import React from 'react'
import { ActiveLink } from './ActiveLink'

import { LiveSwitcher, SelectAppChain } from '@/components'
import { ConnectWalletButton } from './connectWallet'
import { CreateNewBet } from './Bets/CreateNewBet'

import * as Logo from '@/assets/logo.png'
import { LogoutButton } from '../Signup/logout-button'
import Web3DashboardButton from '../PRIVY/Web3DashboardButton'

export function NavBar() {
  const links = [
    { href: '/home', label: 'Home' },
    { href: '/events/top', label: 'Events', regex: '^/events(/|$)' }, // Regex for /events/*
    { href: '/bets', label: 'Bets' },
  ]

  return (
    <div className="flex items-center bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/30 w-full h-16 px-6 shadow-lg">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="flex items-center mr-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
              <img src={Logo.default.src} alt="Logo" className="w-10 h-10 object-cover shadow-sm relative z-10" />
            </div>
            <span className="ml-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 text-xl">Pythia</span>
          </div>
          
          <nav className="flex space-x-1">
            {links.map(({ href, label, regex }) => {
              return (
                <ActiveLink
                  key={href}
                  href={href}
                  regex={regex}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-800/50 rounded-md transition-colors duration-200 font-medium"
                  activeClassName="font-bold !text-white bg-gradient-to-r from-purple-700 to-pink-600 shadow-md"
                >
                  {label}
                </ActiveLink>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Web3DashboardButton/>
          
          <div className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700/70 rounded-md transition-colors duration-200 shadow-sm border border-purple-500/20">
            <LiveSwitcher />
          </div>
          
          <div className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700/70 rounded-md transition-colors duration-200 shadow-sm border border-purple-500/20">
            <SelectAppChain />
          </div>

          <div className="ml-2">
            <LogoutButton/>
          </div>
        </div>
      </div>
    </div>
  )
}