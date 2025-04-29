'use client'
import React, { useEffect } from 'react'
import { redirect } from 'next/navigation'

import { ImportWalletButton } from '@/components'
import router from 'next/router'

export default function Home() {
  router.push('/auth/login')
}