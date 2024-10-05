'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Icons } from '@/components/icons';
import { Button } from '@/components/plate-ui/button';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant='ghost'
      size='xs'
      onClick={handleClick}
      className='p-0 aspect-square h-8 w-full flex items-center justify-start px-3 hover:bg-primary/10'
    >
      <Icons.sun className='text-white h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' /> <span className={"ml-1 text-white dark:hidden"}>Tema claro</span>
      <Icons.moon
        className='text-white absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' /> <span className={"ml-1 text-white hidden dark:inline"}>Tema oscuro</span>
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
