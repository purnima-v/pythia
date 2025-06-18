import React, { useState, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; // Type-only import for ReactNode
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added Link and useLocation
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationPopup from '../notifications/NotificationPopup';
import { mockMarkets } from '../../data/mockMarkets';
import type { Market } from '../pythia/MarketCard';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';

// Placeholder SVGs - replace with actual icons
const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);
const BellIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const XPIcon = () => <svg className="w-5 h-5 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

// Placeholder SVGs for Sun and Moon icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

interface LayoutProps {
  children: ReactNode;
}

export type Mode = 'pro' | 'novice'; // Renamed Theme to Mode
interface ModeContextType { // Renamed ThemeContextType to ModeContextType
  mode: Mode;
  toggleMode: () => void; // Renamed toggleTheme to toggleMode
}

export const ModeContext = createContext<ModeContextType | undefined>(undefined); // Renamed ThemeContext

export const useMode = () => { // Renamed useTheme to useMode
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

export default function Layout({ children }: LayoutProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [mode, setMode] = useState<Mode>('pro'); // Default to 'pro' mode
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, addNotification } = useNotifications();
  const location = useLocation(); // Get current location
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; question: string }>>([]);
  const navigate = useNavigate();
  const { authenticated, login, logout } = usePrivy();

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'pro' ? 'novice' : 'pro');
  };

  const filters = ['All', 'Crypto', 'Politics', 'Technology', 'Climate', 'Sports', 'Other'];

  // Theme-specific classes now based on mode ('pro' = Poseidon, 'novice' = Light)
  const bgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const navBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue/80 backdrop-blur-md' : 'bg-light-surface/80 backdrop-blur-md shadow-md';
  const navTextColor = mode === 'pro' ? 'text-poseidon-accent-white' : 'text-light-text-main';
  const logoTextColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';
  const searchBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue/70' : 'bg-light-bg';
  const searchPlaceholderColor = mode === 'pro' ? 'placeholder-poseidon-muted-text' : 'placeholder-light-text-muted';
  const searchRingColor = mode === 'pro' ? 'focus:ring-poseidon-accent-cyan' : 'focus:ring-light-accent-primary';
  const modeToggleIconHoverColor = mode === 'pro' ? 'hover:text-poseidon-accent-cyan' : 'hover:text-light-accent-primary'; 
  const bellIconColor = mode === 'pro' ? 'text-poseidon-muted-text hover:text-poseidon-accent-cyan' : 'text-light-text-muted hover:text-light-accent-primary';
  const xpContainerBg = mode === 'pro' ? 'bg-poseidon-deep-blue/70' : 'bg-gray-200/70';
  const xpTextColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const walletButtonBg = authenticated 
    ? mode === 'pro' 
      ? 'bg-poseidon-accent-cyan hover:bg-cyan-400' 
      : 'bg-light-accent-primary hover:bg-blue-600'
    : mode === 'pro'
      ? 'bg-poseidon-mid-blue hover:bg-poseidon-border'
      : 'bg-light-bg hover:bg-light-hover';
  const walletButtonText = authenticated
    ? mode === 'pro'
      ? 'text-poseidon-dark-blue'
      : 'text-white'
    : mode === 'pro'
      ? 'text-poseidon-light-text'
      : 'text-light-text-main';

  const filterBarBg = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-surface';
  const filterButtonBaseText = mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted';
  const filterButtonHoverText = mode === 'pro' ? 'hover:text-poseidon-accent-cyan' : 'hover:text-light-accent-primary';
  const filterActiveButtonBg = mode === 'pro' ? 'bg-poseidon-accent-cyan' : 'bg-light-accent-primary';
  const filterActiveButtonText = mode === 'pro' ? 'text-poseidon-deep-blue' : 'text-white';
  const footerBg = mode === 'pro' ? 'bg-poseidon-mid-blue/50' : 'bg-light-surface/50';
  const footerTextColor = mode === 'pro' ? 'text-poseidon-muted-text' : 'text-light-text-muted';

  // Add some dummy notifications when the component mounts
  React.useEffect(() => {
    const dummyNotifications = [
      {
        title: 'New Market Created',
        message: 'A new market "ETH/USD price prediction" has been created',
        type: 'info' as const,
      },
      {
        title: 'Market Resolved',
        message: 'Your prediction on "Will BTC reach $100k?" was correct!',
        type: 'success' as const,
      },
      {
        title: 'Portfolio Update',
        message: 'Your portfolio value has increased by 15%',
        type: 'success' as const,
      },
    ];

    dummyNotifications.forEach(notification => {
      addNotification(notification);
    });
  }, [addNotification]);

  // Update activeFilter based on URL query parameter for category
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    if (category) {
      // Capitalize first letter for matching with filter array
      setActiveFilter(category.charAt(0).toUpperCase() + category.slice(1));
    } else {
      setActiveFilter('All');
    }
  }, [location.search]);

  // Update search suggestions when markets change
  useEffect(() => {
    const suggestions = mockMarkets.map(market => ({
      id: market.id,
      question: market.shortDescription
    }));
    setSuggestions(suggestions);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (marketId: string) => {
    setShowSuggestions(false);
    navigate(`/market/${marketId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      <div className={`min-h-screen flex flex-col ${bgColor} ${textColor} font-sans transition-colors duration-300`}>
        {/* Top Navigation Bar */}
        <nav className={`sticky top-0 z-50 ${navBgColor} shadow-lg`}>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo and Main Links */}
              <div className="flex items-center">
                <Link to="/" className={`text-4xl font-bold ${logoTextColor} font-['Uncial Antiqua'] tracking-wider mr-12`}>Pythia</Link>
                <div className="hidden md:flex items-center space-x-8">
                  {/*<Link to="/" className={`text-sm font-medium ${navTextColor} hover:text-opacity-80 transition-colors font-['Readex Pro']`}>
                    Predict
                  </Link>*/}
                  <Link to="/portfolio" className={`text-sm font-medium ${navTextColor} hover:text-opacity-80 transition-colors font-['Readex Pro']`}>
                    Portfolio
                  </Link>
                  <Link to="/leaderboard" className={`text-sm font-medium ${navTextColor} hover:text-opacity-80 transition-colors font-['Readex Pro']`}>
                    Leaderboard
                  </Link>
                  <Link to="/oracle" className={`text-sm font-medium ${navTextColor} hover:text-opacity-80 transition-colors font-['Readex Pro']`}>
                    Oracle
                  </Link>
                  <Link to="/create-market" className={`text-sm font-medium ${navTextColor} hover:text-opacity-80 transition-colors font-['Readex Pro']`}>
                    Create Market
                  </Link>
                </div>
              </div>

              {/* Search, Icons, Wallet */}
              <div className="flex items-center space-x-6">
                {/* Search Bar */}
                <div className="search-container relative hidden sm:block">
                  <form onSubmit={handleSearchSubmit}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search markets..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => setShowSuggestions(true)}
                      className={`block w-[28rem] pl-10 pr-3 py-2.5 rounded-lg ${searchBgColor} ${textColor} ${searchPlaceholderColor} focus:ring-2 focus:ring-opacity-50 ${searchRingColor} focus:outline-none transition-colors text-sm font-sans`}
                  />
                  </form>
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className={`absolute z-50 w-full mt-1 py-1 rounded-lg shadow-lg ${searchBgColor} border ${mode === 'pro' ? 'border-poseidon-mid-blue' : 'border-gray-200'}`}>
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion.id)}
                          className={`w-full px-4 py-2 text-left hover:bg-opacity-10 ${
                            mode === 'pro' 
                              ? 'hover:bg-poseidon-accent-cyan text-poseidon-light-text' 
                              : 'hover:bg-light-accent-primary text-light-text-main'
                          } transition-colors text-sm font-sans`}
                        >
                          {suggestion.question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mode Toggle Button 
                <button
                  onClick={toggleMode}
                  className={`px-4 py-2 rounded-lg ${bgColor} ${modeToggleIconHoverColor} transition-colors font-medium text-sm font-sans`}
                  aria-label={mode === 'pro' ? 'Switch to Novice Mode' : 'Switch to Pro Mode'}
                >
                  {mode === 'pro' ? 'Novice' : 'Pro'}
                </button> */}

                {/* Bell Icon */}
                <button 
                  className={`p-2 rounded-full ${bgColor} ${bellIconColor} transition-colors relative`}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <BellIcon />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Sign In Button */}
                <button 
                  onClick={authenticated ? logout : login}
                  className={`${walletButtonBg} ${walletButtonText} px-5 py-2.5 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-sans`}
                >
                  {authenticated ? 'Disconnect' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Secondary Filter Tab Bar */}
        <div className={`${filterBarBg} shadow-sm sticky top-20 z-40`}>
          <div className="w-full">
            <div className="flex items-center justify-between py-2 overflow-x-auto">
              {filters.map((filter) => (
                <Link
                  to={filter === 'All' ? '/markets' : `/markets?category=${filter.toLowerCase()}`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 text-center px-2 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap font-sans
                    ${activeFilter === filter 
                      ? `${filterActiveButtonBg} ${filterActiveButtonText} shadow-sm rounded-lg mx-1`
                      : `${bgColor} ${filterButtonBaseText} ${filterButtonHoverText}`
                    }
                  `}
                >
                  {filter}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <main className="flex-grow w-full py-4 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className={`${footerBg} p-6 mt-auto`}>
          <div className="container mx-auto text-center">
            <p className={`text-sm ${footerTextColor}`}>&copy; {new Date().getFullYear()} Pythia. All rights reserved. Seek Wisely.</p>
          </div>
        </footer>

        {/* Notification Popup */}
        <NotificationPopup 
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
        />
      </div>
    </ModeContext.Provider>
  );
} 