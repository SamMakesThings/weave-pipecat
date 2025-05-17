'use client';

import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';
import { RTVIClientProvider } from '@pipecat-ai/client-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useLevelNavigation } from './LevelNavigationContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export function RTVIProvider({ children }: PropsWithChildren) {
  const { currentLevelId } = useLevelNavigation();
  const [client, setClient] = useState<RTVIClient | null>(null);

  useEffect(() => {
    try {
      const transport = new DailyTransport();

      const rtviClient = new RTVIClient({
        transport,
        params: {
          baseUrl: API_BASE_URL,
          endpoints: {
            connect: '/connect',
          },
          // Pass the current level ID to the bot
          requestData: { 
            customData: {
              level: currentLevelId
            }
          },
        },
        enableMic: true,
        enableCam: false,
      });

      setClient(rtviClient);
    } catch (error) {
      console.error('Error initializing RTVIClient:', error);
    }
  }, [currentLevelId]); // Re-initialize when the level changes

  if (!client) {
    return null;
  }

  return <RTVIClientProvider client={client}>{children}</RTVIClientProvider>;
}
