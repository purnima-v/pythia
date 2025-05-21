import React, { createContext, useContext, useState } from 'react';

export interface Position {
  id: string;
  marketId: string;
  marketQuestion: string;
  stake: string;
  mean: number;
  stdDev: number;
  status: 'Active' | 'Resolved';
  // Add other fields as needed
}

const PositionsContext = createContext<{
  positions: Position[];
  addPosition: (pos: Position) => void;
}>({
  positions: [],
  addPosition: () => {},
});

export const usePositions = () => useContext(PositionsContext);

export const PositionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [positions, setPositions] = useState<Position[]>([]);

  const addPosition = (pos: Position) => setPositions(prev => [...prev, pos]);

  return (
    <PositionsContext.Provider value={{ positions, addPosition }}>
      {children}
    </PositionsContext.Provider>
  );
};