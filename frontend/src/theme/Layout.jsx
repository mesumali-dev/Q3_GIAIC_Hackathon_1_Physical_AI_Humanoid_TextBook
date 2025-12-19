import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import { AuthProvider } from '../components/auth/AuthContext';

export default function Layout(props) {
  return (
    <AuthProvider>
      <OriginalLayout {...props} />
    </AuthProvider>
  );
}