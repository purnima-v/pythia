'use client'
import { createContext, useContext, useState } from 'react'

import { useAddress} from './addressContext'

type EmbeddedContextType = {
  showEmbedded: boolean
  setShowEmbedded: (value: boolean) => void
  toggleEmbeddedInfo: () => void
}

const EmbeddedContext = createContext<EmbeddedContextType | undefined>(undefined)


export function EmbeddedProvider({ children }: { children: React.ReactNode }) {
  const [showEmbedded, setShowEmbedded] = useState(false)

  const { handleAddressChange } = useAddress()
  

  const toggleEmbeddedInfo = () => {
    setShowEmbedded(!showEmbedded)
    handleAddressChange('', showEmbedded ? 'External' : 'Embedded')
  }

  return (
    <EmbeddedContext.Provider value={{ showEmbedded, setShowEmbedded, toggleEmbeddedInfo }}>
      {children}
    </EmbeddedContext.Provider>
  )
}

export function useEmbedded() {
  const context = useContext(EmbeddedContext)
  if (context === undefined) {
    throw new Error('useEmbedded must be used within an EmbeddedProvider')
  }
  return context
}