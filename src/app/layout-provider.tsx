'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/platform-user-context';

import Sidebar from '@/components/navigation/sidebar';
import MoveUpLoader from '@/components/shared/moveup-loader';

export const LayoutProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const {completeUser} = useAuth()

  return (
      <main>
        {completeUser ? (
          <Sidebar>{children}</Sidebar>
        ) : (
          <>
            <div className="min-h-svh grid place-items-center">
              <MoveUpLoader/>
            </div>
          </>
        )}
      </main>

  );
};
