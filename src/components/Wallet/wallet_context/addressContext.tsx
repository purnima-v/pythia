'use client'
import { createContext, useContext, useState } from 'react'

type WalletType = "Embedded" | "External"

type AddressContextType = {
    selectedAddress: string
    walletType: WalletType
    handleAddressChange: (address: string, newWalletType: WalletType) => void
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)


export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [selectedAddress, setSelectedAddress] = useState('')
  const [walletType, setWalletType] = useState('External')

  const handleAddressChange = (address: string, newWalletType: WalletType) => {
    setSelectedAddress(address)
    setWalletType(newWalletType)
  }
  

  return (
    <AddressContext.Provider value={{ 
      selectedAddress, 
      walletType: walletType as WalletType, 
      handleAddressChange
    }}>
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress() {
  const context = useContext(AddressContext)
  if (context === undefined) {
    throw new Error('useEmbedded must be used within an EmbeddedProvider')
  }
  return context
}