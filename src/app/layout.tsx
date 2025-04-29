import type { Metadata } from "next";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

import { Providers } from '../app/Providers';

import { cookies } from 'next/headers'
import { FootBar, NavBar } from '@/components'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()

  const initialChainId = cookieStore.get('appChainId')?.value
  const initialLiveState = JSON.parse(cookieStore.get('live')?.value || 'false')

  // console.log('initialChainId', initialChainId)

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <Providers>
            <NavBar />

            <main>
              {children}  
            </main>
          
            <FootBar/>
          </Providers>
      </body>
    </html>
  );
}
