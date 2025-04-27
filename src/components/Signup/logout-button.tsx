// src/components/ui/LogoutButton.tsx
'use client'


import { useRouter } from 'next/navigation'
import { Button } from '@/lib/ui/button'
import { LogOutIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { useLogout } from '@privy-io/react-auth';


export function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter()

  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User successfully logged out');
      // Redirect to landing page or perform other post-logout actions
    },
  });

  // Collapsed: icon‑only ghost button
  if (collapsed) {
    return (
      <Button
        variant="destructive" 
        size="sm"
        onClick={logout}
        className={cn(
          'p-2',                            // tighter padding for icon
          'rounded-md',                     // pill corners
          'flex items-center justify-center', // center icon
          'bg-transparent',                 // ghost background
          'hover:bg-card-hover',            // hover state
          'transition-colors',              // smooth transition
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sidebar-foreground'
        )}
      >
        <LogOutIcon className="w-5 h-5 text-card-foreground" />
        <span className="font-medium">Logout</span>
      </Button>
    )
  }
}