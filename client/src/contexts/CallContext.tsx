import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRTVIClient, useRTVIClientTransportState } from '@pipecat-ai/client-react';

// Types
export type CallStatus = 'idle' | 'connecting' | 'waiting_for_agent' | 'connected' | 'disconnecting' | 'error';

interface ChallengeData {
  level: number;
  tool: string;
  weaveTraceUrl?: string;
}

interface ServerMessageEvent {
  type: string;
  payload: ChallengeData;
}

interface CallState {
  status: CallStatus;
  isMicEnabled: boolean;
  isCallActive: boolean;
  error: string | null;
  challengeCompleted: boolean;
  challengeData: ChallengeData | null;
}

interface CallContextType extends CallState {
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMic: () => void;
  resetChallengeState: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({ children }: { children: ReactNode }) {
  const client = useRTVIClient();
  const transportState = useRTVIClientTransportState();
  
  const [state, setState] = useState<CallState>({
    status: 'idle',
    isMicEnabled: true,
    isCallActive: false,
    error: null,
    challengeCompleted: false,
    challengeData: null,
  });

  // Update status based on transport state
  useEffect(() => {
    if (!client) return;
    
    let callStatus: CallStatus = 'idle';
    
    switch (transportState) {
      case 'connecting':
        callStatus = 'connecting';
        break;
      case 'connected':
        callStatus = 'waiting_for_agent';
        break;
      case 'ready':
        callStatus = 'connected';
        break;
      case 'disconnecting':
        callStatus = 'disconnecting';
        break;
      case 'disconnected':
        callStatus = 'idle';
        break;
      case 'error':
        callStatus = 'error';
        break;
    }
    
    setState(prev => ({
      ...prev,
      status: callStatus,
      isCallActive: transportState === 'ready', // Only active when fully ready
    }));
  }, [transportState, client]);

  // Listen for server messages
  useEffect(() => {
    if (!client) return;
    
    const handleServerMessage = (event: ServerMessageEvent) => {
      console.log('Server message received:', event);

      if (event.type === 'challenge_completed') {
        console.log('Challenge completed event received:', event.payload);
        
        setState(prev => ({
          ...prev,
          challengeCompleted: true,
          challengeData: event.payload,
        }));
      }
    };

    client.on('serverMessage', handleServerMessage);
    
    // Clean up
    return () => {
      client.off('serverMessage', handleServerMessage);
    };
  }, [client]);

  const startCall = async () => {
    if (!client) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: 'PipeCat client not initialized',
      }));
      return;
    }
    
    // Reset challenge state when starting a new call
    setState(prev => ({
      ...prev,
      challengeCompleted: false,
      challengeData: null,
    }));
    
    try {
      await client.connect();
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const endCall = async () => {
    if (!client) return;
    
    try {
      await client.disconnect();
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  // Toggle microphone
  // Note: This is a placeholder that updates the state but doesn't actually
  // control the microphone since RTVIClient doesn't expose a direct method
  // to toggle the microphone after initialization
  const toggleMic = () => {
    setState(prev => ({ ...prev, isMicEnabled: !prev.isMicEnabled }));
  };

  // Reset challenge state
  const resetChallengeState = () => {
    setState(prev => ({
      ...prev,
      challengeCompleted: false,
      challengeData: null,
    }));
  };

  const value = {
    ...state,
    startCall,
    endCall,
    toggleMic,
    resetChallengeState,
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
}

// Custom hook for using this context
export function useCall() {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
