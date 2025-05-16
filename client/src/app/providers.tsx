'use client';

import { AppContextProvider } from '../contexts/AppContextProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
