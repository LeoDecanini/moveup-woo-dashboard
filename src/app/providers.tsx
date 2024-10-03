'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/context/platform-user-context';
import { WordpressProvider } from '@/context/wordpress-context';
import { LayoutProvider } from './layout-provider' 

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [test, setTest] = useState(true);

  return (
    <AuthProvider>
      <WordpressProvider>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </WordpressProvider>
    </AuthProvider>
  );
};
