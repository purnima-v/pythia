'use client'
import React, { useEffect } from 'react'
import { redirect } from 'next/navigation'

import { ImportWalletButton } from '@/components'

export default function Home() {
  redirect('/auth/login')
}