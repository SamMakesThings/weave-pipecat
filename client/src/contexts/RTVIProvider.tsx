'use client';

import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';
import { RTVIClientProvider } from '@pipecat-ai/client-react';
import { PropsWithChildren, useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export function RTVIProvider({ children }: PropsWithChildren) {
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
          // You can pass custom data to the bot if needed
          requestData: { customData: 'weave-pipecat' },
        },
        enableMic: true,
        enableCam: false,
      });

      setClient(rtviClient);
    } catch (error) {
      console.error('Error initializing RTVIClient:', error);
    }
  }, []);

  if (!client) {
    return null;
  }

  return <RTVIClientProvider client={client}>{children}</RTVIClientProvider>;
}
