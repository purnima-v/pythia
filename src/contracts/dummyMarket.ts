// src/contracts/dummyPredictionMarket.ts

export const dummyAbi = [
    {
      "inputs": [
        { "name": "marketId", "type": "string" },
        { "name": "mean", "type": "uint256" },
        { "name": "stdDev", "type": "uint256" },
        { "name": "collateral", "type": "uint256" }
      ],
      "name": "placeBet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ] as const;
  
export const dummyAddress = "0x000000000000000000000000000000000000eren";
