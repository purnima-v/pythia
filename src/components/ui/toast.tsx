import { useState, useEffect } from 'react';

interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export function toast({ title, description, variant = 'default' }: ToastProps) {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
    variant === 'destructive' ? 'bg-red-500' : 'bg-green-500'
  } text-white`;
  
  toast.innerHTML = `
    <h3 class="font-bold">${title}</h3>
    <p class="text-sm">${description}</p>
  `;
  
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
} 