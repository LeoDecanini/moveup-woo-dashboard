'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/platform-user-context';
import { WordpressProvider } from '@/context/wordpress-context';

import Sidebar from '@/components/navigation/sidebar';

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [test, setTest] = useState(true);

  return (
    <AuthProvider>
      <WordpressProvider>
      <main>
        {test ? (
          <Sidebar>{children}</Sidebar>
        ) : (
          <>
            <h1>autenticacion</h1>
          </>
        )}
      </main>
          </WordpressProvider>
    </AuthProvider>
  );
};
