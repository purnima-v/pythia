import React from 'react';
import { useMode } from '../components/pythia/Layout';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  predictionsMade: number;
  accuracy: string;
  netPnl?: string; // Optional Profit and Loss
}

const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'OracleMaximus', xp: 12580, predictionsMade: 150, accuracy: '75%', netPnl: '+$5,230' },
  { rank: 2, name: 'FutureSightFred', xp: 11200, predictionsMade: 120, accuracy: '72%', netPnl: '+$4,100' },
  { rank: 3, name: 'CryptoClairvoyant', xp: 10500, predictionsMade: 95, accuracy: '78%', netPnl: '+$3,500' },
  { rank: 4, name: 'MarketMavenMary', xp: 9800, predictionsMade: 180, accuracy: '68%', netPnl: '+$2,800' },
  { rank: 5, name: 'PredictorPaul', xp: 9250, predictionsMade: 110, accuracy: '70%', netPnl: '+$2,150' },
  { rank: 6, name: 'SeerSarah', xp: 8600, predictionsMade: 80, accuracy: '81%', netPnl: '+$1,900' },
  { rank: 7, name: 'DivinerDave', xp: 7900, predictionsMade: 130, accuracy: '65%', netPnl: '+$1,500' },
  { rank: 8, name: 'PrognosticatorPat', xp: 7150, predictionsMade: 100, accuracy: '69%', netPnl: '+$1,200' },
  { rank: 9, name: 'AugurAlice', xp: 6800, predictionsMade: 90, accuracy: '73%', netPnl: '+$950' },
  { rank: 10, name: 'VisionaryVince', xp: 6200, predictionsMade: 70, accuracy: '77%', netPnl: '+$700' },
];

export default function LeaderboardPage() {
  const { mode } = useMode();

  const bgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-surface';
  const cardBorderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const headerTextColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';
  const tableHeaderBg = mode === 'pro' ? 'bg-poseidon-deep-blue/50' : 'bg-slate-100';
  const rankColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';
  const nameColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-slate-700';
  const xpColor = mode === 'pro' ? 'text-yellow-400' : 'text-amber-500';

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${bgColor} ${textColor} min-h-full font-['Readex Pro']`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 text-center ${headerTextColor}`}>Leaderboard</h1>
        
        <div className={`shadow-xl rounded-lg overflow-hidden ${cardBgColor} border ${cardBorderColor}`}>
          <table className="min-w-full divide-y divide-gray-200/30">
            <thead className={`${tableHeaderBg}`}>
              <tr>
                <th scope="col" className={`px-4 py-3.5 text-left text-sm font-semibold ${textColor}`}>Rank</th>
                <th scope="col" className={`px-4 py-3.5 text-left text-sm font-semibold ${textColor}`}>Name</th>
                <th scope="col" className={`px-4 py-3.5 text-left text-sm font-semibold ${textColor}`}>XP</th>
                <th scope="col" className={`hidden sm:table-cell px-4 py-3.5 text-left text-sm font-semibold ${textColor}`}>Predictions</th>
                <th scope="col" className={`hidden md:table-cell px-4 py-3.5 text-left text-sm font-semibold ${textColor}`}>Accuracy</th>
                <th scope="col" className={`hidden lg:table-cell px-4 py-3.5 text-left text-sm font-semibold ${textColor}`}>Net P&L</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${cardBorderColor}`}>
              {mockLeaderboardData.map((user) => (
                <tr key={user.rank} className={`${mode === 'pro' ? 'hover:bg-poseidon-deep-blue/30' : 'hover:bg-slate-50'} transition-colors`}>
                  <td className={`whitespace-nowrap px-4 py-4 text-lg font-bold ${rankColor}`}>{user.rank}</td>
                  <td className={`whitespace-nowrap px-4 py-4 text-sm font-medium ${nameColor}`}>{user.name}</td>
                  <td className={`whitespace-nowrap px-4 py-4 text-sm ${xpColor} font-semibold`}>{user.xp.toLocaleString()}</td>
                  <td className={`hidden sm:table-cell whitespace-nowrap px-4 py-4 text-sm ${textColor}`}>{user.predictionsMade}</td>
                  <td className={`hidden md:table-cell whitespace-nowrap px-4 py-4 text-sm ${textColor}`}>{user.accuracy}</td>
                  <td className={`hidden lg:table-cell whitespace-nowrap px-4 py-4 text-sm ${user.netPnl && user.netPnl.startsWith('+') ? (mode === 'pro' ? 'text-green-400' : 'text-green-600') : (mode === 'pro' ? 'text-red-400' : 'text-red-600')}`}>
                    {user.netPnl || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 