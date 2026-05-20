'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './AuthContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F172A',
            color: '#fff',
            borderRadius: '12px',
            padding: '14px 18px',
          },
        }}
      />
    </AuthProvider>
  );
}
