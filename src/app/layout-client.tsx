// app/layout-client.tsx
'use client'

import { usePathname } from 'next/navigation'
import { FootBar, NavBar } from '@/components'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = pathname.startsWith('/auth')

  return (
    <>
      {!isAuthRoute && <NavBar />}
      <main>{children}</main>
      {!isAuthRoute && <FootBar />}
    </>
  )
}