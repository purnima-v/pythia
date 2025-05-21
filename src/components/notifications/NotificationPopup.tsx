import React from 'react';
import { useMode } from '../pythia/Layout';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export default function NotificationPopup({ isOpen, onClose, notifications }: NotificationPopupProps) {
  const { mode } = useMode();

  if (!isOpen) return null;

  const bgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-white';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-gray-900';
  const borderColor = mode === 'pro' ? 'border-poseidon-border' : 'border-gray-200';
  const hoverBgColor = mode === 'pro' ? 'hover:bg-poseidon-deep-blue' : 'hover:bg-gray-50';

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div 
        className={`absolute right-0 top-16 w-80 rounded-lg shadow-lg ${bgColor} border ${borderColor} overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-poseidon-border">
          <h3 className={`text-lg font-semibold ${textColor}`}>Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 border-b ${borderColor} ${hoverBgColor} transition-colors`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${textColor}`}>{notification.title}</h4>
                    <p className={`text-sm mt-1 ${mode === 'pro' ? 'text-poseidon-muted-text' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                  </div>
                  <span className={`text-xs ${mode === 'pro' ? 'text-poseidon-muted-text' : 'text-gray-500'}`}>
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-poseidon-muted-text">
              No notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 