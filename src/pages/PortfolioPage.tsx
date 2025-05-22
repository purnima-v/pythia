import React, { useState } from 'react';
import { useMode } from '../components/pythia/Layout';
import { Link } from 'react-router-dom'; // For linking to market detail pages
import { useAccount } from 'wagmi';
import { PAIR_ABI } from '../contracts/ABIs';
import { readContract } from 'viem/actions';
import { config } from '../wagmi.config';
import { toast } from '../components/ui/toast.tsx';

//const [payout, setPayout]= useState(0);

//const {address} = useAccount();

interface PortfolioPosition {
  id: string;
  marketId: string; // To link to the market detail page
  marketQuestion: string;
  stake: string;
  avgPrice: string;
  currentValue: string;
  potentialReturn: string;
  status: 'Active' | 'Resolved';
  outcome?: string; // If resolved
  pnl?: string; // Profit/Loss, if resolved
}

const mockPortfolioData: PortfolioPosition[] = [
  {
    id: 'p1',
    marketId: '1',
    marketQuestion: 'ETH/USD price by EOD on July 30, 2024?',
    stake: '100 USD',
    avgPrice: '0.65 (implies 65% chance)',
    currentValue: '110 USD',
    potentialReturn: '153.85 USD',
    status: 'Active',
  },
  {
    id: 'p2',
    marketId: '4',
    marketQuestion: 'Candidate A\'s popular vote % in 2024 US Election?',
    stake: '250 USD',
    avgPrice: '0.44 (implies 44% chance)',
    currentValue: '240 USD',
    potentialReturn: '568.18 USD',
    status: 'Active',
  },
  {
    id: 'p3',
    marketId: '2',
    marketQuestion: 'Average global temperature anomaly for 2025?',
    stake: '80 USD',
    avgPrice: '0.55 (implies 55% chance)',
    currentValue: '-',
    potentialReturn: '-',
    status: 'Resolved',
    outcome: '1.2°C',
    pnl: '+20.00 USD'
  },
  {
    id: 'p4',
    marketId: 'm_resolved_2', // Placeholder ID for another resolved market
    marketQuestion: 'Another Old Market: Z to occur before Q1 end?',
    stake: '75 USD',
    avgPrice: '0.30',
    currentValue: '-',
    potentialReturn: '-',
    status: 'Resolved',
    outcome: 'No',
    pnl: '-75.00 USD'
  },
];

const summaryStats = {
  totalInvested: '350 USD (Active)',
  currentPortfolioValue: '350 USD (Active)',
  totalPnl: '-62.50 USD (All Time)',
  activePositions: 2,
  resolvedPositions: 2,
};

/*const handleClaimPayout = async (marketId: string) => {a
  console.log('Claiming payout for market:', marketId);
  try {
    const ids = await readContract(config, {
      address: marketId as `0x${string}`,
      abi: PAIR_ABI,
      functionName: 'traderToPositionIDs',
      args: [address]
    });

    const firstIdBig = ids[0];

    const tempPayout = await readContract(config, {
      address: marketId as `0x${string}`,
      abi: PAIR_ABI,
      functionName: 'settlePosition',
      args: [firstIdBig, address]
    })
    setPayout(tempPayout);

    console.log('Payout:', payout);

  } catch (error) {
    console.error('Error claiming payout:', error);
  }
};
*/

export default function PortfolioPage() {
  const { mode } = useMode();

  // Modal state for claim payout
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimMarket, setClaimMarket] = useState<string | null>(null);
  const [claimMarketQuestion, setClaimMarketQuestion] = useState<string | null>(null);

  // Mode-specific styles
  const bgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-surface';
  const cardBorderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const headerTextColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';
  const mutedTextColor = mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted';
  const accentColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';
  const positivePnlColor = mode === 'pro' ? 'text-green-400' : 'text-green-600';
  const negativePnlColor = mode === 'pro' ? 'text-red-400' : 'text-red-600';

  const activeMarkets = mockPortfolioData.filter(p => p.status === 'Active');
  const resolvedMarkets = mockPortfolioData.filter(p => p.status === 'Resolved');

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${bgColor} ${textColor} min-h-full font-['Readex Pro']`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 text-center ${headerTextColor}`}>My Portfolio</h1>

        {/* Summary Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8`}>
          {Object.entries(summaryStats).map(([key, value]) => (
            <div key={key} className={`p-4 rounded-lg shadow-lg ${cardBgColor} border ${cardBorderColor}`}>
              <p className={`text-sm capitalize ${mutedTextColor}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className={`text-xl font-semibold ${accentColor}`}>{String(value)}</p>
            </div>
          ))}
        </div>

        {/* Active Positions */}
        <div className="mb-10">
          <h2 className={`text-2xl font-semibold mb-6 ${headerTextColor}`}>Active Positions ({activeMarkets.length})</h2>
          {activeMarkets.length > 0 ? (
            <div className="space-y-4">
              {activeMarkets.map((position) => (
                <div key={position.id} className={`p-4 rounded-lg shadow-md ${cardBgColor} border ${cardBorderColor}`}>
                  <Link to={`/market/${position.marketId}`} className={`text-lg font-semibold hover:underline ${textColor}`}>
                    {position.marketQuestion}
                  </Link>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
                    <div><span className={mutedTextColor}>Stake:</span> {position.stake}</div>
                    <div><span className={mutedTextColor}>Avg. Price:</span> {position.avgPrice}</div>
                    <div><span className={mutedTextColor}>Current Value:</span> {position.currentValue}</div>
                    <div><span className={mutedTextColor}>Potential Return:</span> {position.potentialReturn}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${cardBgColor} border ${cardBorderColor} p-4 rounded-md`}>No active positions.</p>
          )}
        </div>

        {/* Resolved Positions */}
        <div>
          <h2 className={`text-2xl font-semibold mb-6 ${headerTextColor}`}>Resolved Positions ({resolvedMarkets.length})</h2>
          {resolvedMarkets.length > 0 ? (
            <div className="space-y-4">
              {resolvedMarkets.map((position) => (
                <div key={position.id} className={`p-4 rounded-lg shadow-md ${cardBgColor} border ${cardBorderColor} flex items-center justify-between`}>
                  <div>
                    <Link to={`/market/${position.marketId}`} className={`text-lg font-semibold hover:underline ${textColor}`}>
                      {position.marketQuestion}
                    </Link>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
                      <div><span className={mutedTextColor}>Stake:</span> {position.stake}</div>
                      <div><span className={mutedTextColor}>Outcome:</span> {position.outcome}</div>
                      <div><span className={mutedTextColor}>P&L:</span> 
                        <span className={`${position.pnl?.startsWith('+') ? positivePnlColor : negativePnlColor} font-semibold`}>
                          {position.pnl}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded bg-blue-600 text-white ml-4 whitespace-nowrap"
                    onClick={() => {
                      setClaimMarket(position.marketId);
                      setClaimMarketQuestion(position.marketQuestion);
                      setShowClaimModal(true);
                    }}
                  >
                    Claim Payout
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${cardBgColor} border ${cardBorderColor} p-4 rounded-md`}>No resolved positions.</p>
          )}
        </div>

        {/* Claim Payout Modal */}
        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`bg-white dark:bg-poseidon-mid-blue rounded-lg shadow-lg p-6 max-w-md w-full`}>
              <h3 className="text-lg font-semibold mb-4">Confirm Claim Payout</h3>
              <p className="mb-4">Are you sure you want to claim your payout for:<br /><span className="font-semibold">{claimMarketQuestion}</span>?</p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={() => setShowClaimModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setShowClaimModal(false);
                    toast({
                      title: 'Success',
                      description: 'Payout claimed!'
                    });
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
} 