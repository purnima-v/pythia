'use client'

import { useState, useEffect, useRef } from 'react';
import Web3Dashboard from './Web3Dashboard';

export default function Web3DashboardButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <div>
      <button 
        ref={buttonRef}
        onClick={() => {
          setIsOpen(true);
          setIsPressed(true);
          setTimeout(() => setIsPressed(false), 200);
        }}
        className={`px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
          isPressed ? 'opacity-80' : ''
        }`}
      >
        WALLET
      </button>
      
      <Web3Dashboard 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  );
}