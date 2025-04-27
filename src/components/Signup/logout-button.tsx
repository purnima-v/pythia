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
      router.push('/auth/login');
    },
  });

  // Collapsed: icon‑only ghost button
  
  return (
    <Button
      variant="destructive" 
      size="sm"
      onClick={logout}
      className={cn(
        'p-2',
        'rounded-md',
        'flex items-center justify-center',
        'text-black',
        'bg-gray-300',
        'hover:bg-card-hover hover:cursor-pointer',
        'transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sidebar-foreground'
      )}
    >
      <LogOutIcon className="w-5 h-5 text-card-foreground" />
      <span className="font-medium">Logout</span>
    </Button>
  )
  
}