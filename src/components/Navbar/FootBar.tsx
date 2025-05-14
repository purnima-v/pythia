'use client'
import React from 'react'

import { CreateNewBet } from '@/components'

export function FootBar() {
  

  return (
    <div className="flex items-center justify-center px-10 py-2 bg-orange-400 w-full fixed bottom-0 ">

      <div className=''>
        <CreateNewBet/>
      </div>
      
    </div>
  )
}