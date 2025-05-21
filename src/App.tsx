import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/pythia/Layout';
import MarketsPage from './pages/MarketsPage';
import MarketDetailPage from './pages/MarketDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreateMarketPage from './pages/CreateMarketPage';
import OraclePage from './pages/OraclePage';
import PortfolioPage from './pages/PortfolioPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ResolvedMarketPage from './pages/ResolvedMarketPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from 'react-toastify';

import { WagmiConfig, WagmiProvider } from 'wagmi';
import { config } from './wagmi.config'; 

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}> {/* ✅ Wrap entire app */}
      <NotificationProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<MarketsPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/market/:marketId" element={<MarketDetailPage />} />
            <Route path="/market/:marketId/resolved" element={<ResolvedMarketPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/create-market" element={<CreateMarketPage />} />
            <Route path="/oracle" element={<OraclePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </Layout>
      </NotificationProvider>
    </WagmiProvider>
  );
};

export default App;
