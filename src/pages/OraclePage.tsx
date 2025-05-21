import React from 'react';
import { useMode } from '../components/pythia/Layout';

// Placeholder data - can be expanded based on actual oracle functionality
interface OracleActivity {
  id: string;
  marketQuestion: string;
  resolvedOutcome: string;
  resolutionDate: string;
  dataSource: string;
}

const mockOracleActivity: OracleActivity[] = [
  { id: 'o1', marketQuestion: 'ETH/USD price by EOD on July 15, 2024?', resolvedOutcome: '3450 USD', resolutionDate: '2024-07-15', dataSource: 'Kraken API' },
  { id: 'o2', marketQuestion: 'Will Candidate A win the debate on July 10?', resolvedOutcome: 'Yes', resolutionDate: '2024-07-11', dataSource: 'Official Poll Aggregator' },
  { id: 'o3', marketQuestion: 'Average global temperature anomaly for June 2024?', resolvedOutcome: '+1.45°C', resolutionDate: '2024-07-05', dataSource: 'NOAA/NASA Data' },
  { id: 'o4', marketQuestion: 'Rotten Tomatoes score for \'New Summer Blockbuster\' on release week?', resolvedOutcome: '78%', resolutionDate: '2024-06-20', dataSource: 'RottenTomatoes.com' },
];

export default function OraclePage() {
  const { mode } = useMode();

  // Mode-specific styles
  const bgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-surface';
  const cardBorderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-light-border';
  const headerTextColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';
  const mutedTextColor = mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted';
  const accentColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${bgColor} ${textColor} min-h-full font-['Readex Pro']`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 text-center ${headerTextColor}`}>Oracle Hub</h1>

        <div className={`p-6 sm:p-8 rounded-lg shadow-xl ${cardBgColor} border ${cardBorderColor} mb-8`}>
          <h2 className={`text-2xl font-semibold mb-4 ${accentColor}`}>About Pythia Oracles</h2>
          <p className="mb-2">
            Pythia utilizes a decentralized network of oracles to ensure fair and accurate market resolution. 
            Our oracles are responsible for reporting real-world outcomes for prediction markets.
          </p>
          <p className="mb-2">
            Resolution is based on pre-defined data sources specified at market creation. Transparency and 
            verifiability are key to maintaining trust in the platform.
          </p>
          <p className={`${mutedTextColor} text-sm`}>
            Interested in becoming an oracle? More information will be available soon.
          </p>
        </div>

        <div className={`p-6 sm:p-8 rounded-lg shadow-xl ${cardBgColor} border ${cardBorderColor}`}>
          <h2 className={`text-2xl font-semibold mb-6 ${accentColor}`}>Recent Oracle Activity</h2>
          {mockOracleActivity.length > 0 ? (
            <div className="space-y-6">
              {mockOracleActivity.map((activity) => (
                <div key={activity.id} className={`p-4 rounded-md border ${mode === 'pro' ? 'border-poseidon-border/50 bg-poseidon-deep-blue/30' : 'border-light-border bg-slate-50'}`}>
                  <h3 className={`text-lg font-semibold ${textColor}`}>{activity.marketQuestion}</h3>
                  <p className={`text-sm ${mutedTextColor} mt-1`}>Resolved Outcome: <span className={`${accentColor} font-medium`}>{activity.resolvedOutcome}</span></p>
                  <p className={`text-xs ${mutedTextColor} mt-2`}>Resolved on: {new Date(activity.resolutionDate).toLocaleDateString()} | Source: {activity.dataSource}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent oracle activity to display.</p>
          )}
        </div>

      </div>
    </div>
  );
} 