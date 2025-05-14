'use client'

import { useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { sepolia } from 'viem/chains';
import { createWalletClient, custom, type Hex } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { ChainSelector } from '@/components/Wallet/Dashboard/ChainSelector';
// import { ConnectWalletButton } from '@/components/PRIVY/wallet/ConnectWalletButton';
import { ImportWalletButton } from '@/components/Wallet/Dashboard/ImportWalletButton';
import { WalletSelector } from '@/components/Wallet/Dashboard/WalletSelector';
import Balance from '@/components/PRIVY/Balance';
import Signer from '@/components/PRIVY/Signer';
import SendTransaction from '@/components/PRIVY/SendTransaction';
import Transaction from '@/components/PRIVY/Transaction';
import Web3DashboardButton from '@/components/Wallet/Web3DashboardButton';

// export default function HomePage() {
//   const { wallets } = useWallets();
//   const [selectedWalletAddress, setSelectedWalletAddress] = useState("");
//   const [selectedChain, setSelectedChain] = useState<typeof sepolia>(sepolia);
//   const { address, isConnected, isConnecting, isDisconnected } = useAccount();
//   const { disconnect } = useDisconnect();

//   const onSendTransaction = async () => {
//     if (!wallets.length) {
//       console.error("No wallet connected");
//       return;
//     }

//     const sendTo = "0x5A3b5A0b3540d1041a21F96E55003D23379220C1";

//     try {
//       const wallet = wallets.find((wallet) => wallet.address === selectedWalletAddress);
//       if (!wallet) throw new Error("Selected wallet not found");

//       const provider = await wallet.getEthereumProvider();
//       const walletClient = createWalletClient({
//         account: wallet.address as Hex,
//         chain: selectedChain,
//         transport: custom(provider),
//       });

//       const hash = await walletClient.sendTransaction({
//         to: sendTo,
//         value: BigInt(0.001 * 10 ** 18),
//       });

//       console.log('Transaction hash:', hash);
//       return hash;
//     } catch (error) {
//       console.error('Transaction failed:', error);
//       throw error;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0a0e17] p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">Web3 Dashboard</h1>
//           <div className="flex items-center space-x-3">
//             <div className="px-4 py-2 rounded-full bg-[#1e293b] text-white text-sm border border-[#334155]">
//               {isConnecting && <span className="text-yellow-400 font-medium">🟡 Connecting...</span>}
//               {isConnected && <span className="text-green-400 font-medium">🟢 Connected</span>}
//               {isDisconnected && <span className="text-red-400 font-medium">🔴 Disconnected</span>}
//             </div>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Wallet Management Column */}
//           <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] overflow-hidden hover:shadow-xl transition-shadow duration-300">
//             <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-[#334155]">
//               <h2 className="text-xl font-semibold text-white">Wallet Management</h2>
//             </div>
//             <div className="p-6 space-y-5">
//               <div className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex justify-center items-center">
//                 <ConnectWalletButton />
//               </div>
//               <div className="pt-2">
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Select Network</label>
//                 <ChainSelector onChainChange={setSelectedChain} />
//               </div>
//               <div className="pt-2">
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Select Wallet</label>
//                 <WalletSelector 
//                   wallets={wallets}
//                   selectedWalletAddress={selectedWalletAddress}
//                   onWalletSelect={setSelectedWalletAddress}
//                 />
//               </div>
//               {/* <button 
//                 onClick={onSendTransaction}
//                 disabled={!selectedWalletAddress}
//                 className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-purple-600"
//               >
//                 Send Transaction
//               </button> */}
//               <div className="pt-2">
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Import Wallet</label>
//                 <div className="bg-[#2d3748] hover:bg-[#374151] rounded-lg p-4 cursor-pointer transition-colors duration-200 border border-[#4b5563] hover:border-[#6b7280]">
//                   <ImportWalletButton />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Wallet Information Column */}
//           <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] overflow-hidden hover:shadow-xl transition-shadow duration-300">
//             <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-[#334155]">
//               <h2 className="text-xl font-semibold text-white">Wallet Information</h2>
//             </div>
//             <div className="p-6 space-y-5">
//               {isConnected && address ? (
//                 <>
//                   <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563]">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-sm text-gray-300">Connected Address</span>
//                     </div>
//                     <div className="font-mono text-sm text-white break-all bg-[#1a202c] p-3 rounded border border-[#4b5563]">
//                       {address}
//                     </div>
//                   </div>
//                   <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200">
//                     <Balance />
//                   </div>
//                   <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200">
//                     <Signer />
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-64 text-center">
//                   <div className="w-16 h-16 rounded-full bg-[#2d3748] flex items-center justify-center mb-4 border border-[#4b5563]">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <p className="text-gray-300 mb-2">No Wallet Connected</p>
//                   <p className="text-sm text-gray-400">Connect a wallet to view your balance and information</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Transactions Column */}
//           <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] overflow-hidden hover:shadow-xl transition-shadow duration-300">
//             <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-[#334155]">
//               <h2 className="text-xl font-semibold text-white">Transactions</h2>
//             </div>
//             <div className="p-6 space-y-5">
//               <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200">
//                 <SendTransaction />
//               </div>
//               {isConnected && (
//                 <button
//                   onClick={() => disconnect()}
//                   className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
//                 >
//                   Disconnect Wallet
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0a0e17] p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text mb-8">
        Web3 Dashboard Demo
      </h1>
      
      
      
      <p className="mt-6 text-gray-400 max-w-md text-center">
        Click the button above to open the Web3 Dashboard popup. You can connect your wallet, view your balance, and send transactions.
      </p>
    </div>
  );
}