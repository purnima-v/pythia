/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Readex Pro"', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      colors: {
        // Figma colors (can be kept or removed based on your needs)
        'figma-banner-blue': '#0D1FA2',
        'figma-panel-bg': '#0044FF',
        'figma-panel-border': '#031EAD',
        'figma-card-bg': '#14174D',

        // Comment out or remove the "New Pythia UI Theme Colors"
        // 'pythia-header-bg': '#3A7CA5',
        // 'pythia-header-text': '#FFFFFF',
        // 'pythia-page-bg': '#2A5C83',
        // 'pythia-card-bg': '#1E486D',
        // 'pythia-filter-bar-bg': '#5E87A8',
        // 'pythia-filter-text': '#D1E3F0',
        // 'pythia-filter-active-bg': '#A4D4EE',
        // 'pythia-filter-active-text': '#1E486D',
        // 'pythia-search-bg': '#2A5C83',
        // 'pythia-search-placeholder': '#A4D4EE',
        // 'pythia-text-light': '#E1F5FE',
        // 'pythia-text-dark': '#0A1929',
        // 'pythia-accent-light-blue': '#A4D4EE',
        // 'pythia-border-subtle': '#4A7091',
        // 'pythia-chart-line-main': '#A4D4EE',
        // 'pythia-chart-fill': '#3A7CA5',
        // 'pythia-chart-axis-label': '#A4D4EE',

        // Restoring Poseidon Theme Colors
        'poseidon-deep-blue': '#0B1F3A',      // Main background - dark navy
        'poseidon-mid-blue': '#112E57',       // Card/surface background - slightly lighter navy
        'poseidon-light-text': '#E1F5FE',    // Light cyan-tinted white for text
        'poseidon-accent-cyan': '#67E8F9',   // Bright cyan for accents, lines (cyan-300)
        'poseidon-accent-white': '#FFFFFF',  // Pure white for strong text/title accents
        'poseidon-muted-text': '#9CB3C9',   // Softer, desaturated light blue for muted text
        'poseidon-border': '#234A7A',       // A brighter blue for borders against dark surfaces
        
        // Chart colors for Poseidon theme (ensure these are defined correctly)
        'poseidon-chart-line': '#67E8F9',          
        'poseidon-chart-fill-from': '#2E7BAA',   // Made lighter
        'poseidon-chart-fill-to': '#1A5A8A',     // Made lighter (was fading to deep page bg)

        // New Light Mode Theme Colors
        'light-bg': '#F0F9FF',             // sky-50 / very light blue-gray
        'light-surface': '#FFFFFF',         // white (for cards, nav)
        'light-text-main': '#1E293B',      // slate-800 (dark text)
        'light-text-muted': '#64748B',     // slate-500 (medium gray text)
        'light-accent-primary': '#3B82F6',  // blue-500 (standard vibrant blue)
        'light-accent-secondary': '#0EA5E9',// sky-500 (brighter cyan/blue)
        'light-border': '#E2E8F0',         // slate-200 (light gray border)
        'light-chart-line': '#3B82F6',      // blue-500
        'light-chart-fill-from': '#93C5FD',  // blue-300 (lighter blue for gradient)
        'light-chart-fill-to': '#BFDBFE',    // blue-200 (very light blue for gradient end)
      }
    },
  },
  plugins: [],
}
