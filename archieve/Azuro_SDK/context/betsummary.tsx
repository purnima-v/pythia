import { useContext, createContext, useState, useEffect } from 'react';
import { useBetsSummaryBySelection } from '@azuro-org/sdk';





export type BetSummaryContextValue = {
  isOpen: boolean
  setOpen: (value: boolean) => void
}

export const BetSummaryContext = createContext<BetSummaryContextValue | null>(null)

export const OpenSummary = () => {
  return useContext(BetSummaryContext) as BetSummaryContextValue
}




type Props = {
  children: React.ReactNode
}


export const BetSummaryProvider: React.FC<Props> = ({ children }) => {
    // const { items } = useBetsSummaryBySelection()
  const [ isOpen, setOpen ] = useState(false)

//   useEffect(() => {
//     if (items.length) {
//       setOpen(true)
//     }
//   }, [ items ])

  const value = {
    isOpen,
    setOpen,
  }

  return (
    <BetSummaryContext.Provider value={value}>
      {children}
    </BetSummaryContext.Provider>
  );
}
