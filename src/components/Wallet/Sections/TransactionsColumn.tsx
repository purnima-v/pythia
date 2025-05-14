'use client'

import SendTransaction from '@/components/PRIVY/SendTransaction';

interface TransactionsColumnProps {
  isConnected: boolean;
  disconnect: () => void;
}

export default function TransactionsColumn({
  isConnected,
  disconnect,
}: TransactionsColumnProps) {
  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-[#334155]">
        <h2 className="text-xl font-semibold text-white">Transactions + (friend stuff)</h2>
      </div>
      <div className="p-6 space-y-5">
        <div className="bg-[#2d3748] rounded-lg p-4 border border-[#4b5563] hover:border-[#6b7280] transition-colors duration-200">
          <SendTransaction />
        </div>
        {isConnected && (
          <button
            onClick={disconnect}
            className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            Disconnect Wallet
          </button>
        )}
      </div>
    </div>
  );
}