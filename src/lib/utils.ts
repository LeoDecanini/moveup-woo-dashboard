import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const directionServer = false;

const directionHome = false;

export const ServerUrl = directionServer
  ? 'http://localhost:3000'
  : 'https://api.woo.moveup.digital';

export const HomeUrl = directionHome
  ? 'http://localhost:3001'
  : 'https://www.ezyprop.com';
