"use client";
import Sidebar from "@/components/navigation/sidebar";
import React, { useState } from "react";

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [test, setTest] = useState(true);

  return (
    <main>
      {test ? (
        <Sidebar>{children}</Sidebar>
      ) : (
        <>
          <h1>autenticacion</h1>
        </>
      )}
    </main>
  );
};
