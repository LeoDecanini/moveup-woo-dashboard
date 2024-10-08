'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/context/platform-user-context';
import { WordpressProvider } from '@/context/wordpress-context';
import { WoocommerceProvider } from '@/context/woocommerce-context';
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
        <WoocommerceProvider>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </WoocommerceProvider>
      </WordpressProvider>
    </AuthProvider>
  );
};
