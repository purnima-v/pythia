import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/pythia/Layout';
import MarketsPage from './pages/MarketsPage';
import MarketDetailPage from './pages/MarketDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreateMarketPage from './pages/CreateMarketPage';
import OraclePage from './pages/OraclePage';
import PortfolioPage from './pages/PortfolioPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MarketsPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/market/:marketId" element={<MarketDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/create-market" element={<CreateMarketPage />} />
        <Route path="/oracle" element={<OraclePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
