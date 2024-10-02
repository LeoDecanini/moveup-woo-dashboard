'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/platform-user-context';

import Sidebar from '@/components/navigation/sidebar';

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [test, setTest] = useState(true);

  return (
    <AuthProvider>
      <main>
        {test ? (
          <Sidebar>{children}</Sidebar>
        ) : (
          <>
            <h1>autenticacion</h1>
          </>
        )}
      </main>
    </AuthProvider>
  );
};
