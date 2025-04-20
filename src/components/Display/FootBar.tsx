'use client'
import React from 'react'


import { Betslip, BetsSummary } from '@/components'
import { CreateNewBet } from './Bets/CreateNewBet'

export function FootBar() {
  

  return (
    <div className="flex items-center justify-between px-10 py-2 bg-orange-400 w-full fixed bottom-0 ">

      <div className=''>
        <BetsSummary />
      </div>

      <div className=''>
        <CreateNewBet/>
      </div>
      
      <div className=''>
        <Betslip />
      </div>
    </div>
  )
}