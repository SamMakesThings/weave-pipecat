import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type CallStatus = 'idle' | 'connecting' | 'connected' | 'disconnecting' | 'error';

interface CallState {
  status: CallStatus;
  isMicEnabled: boolean;
  isCallActive: boolean;
  error: string | null;
}

interface CallContextType extends CallState {
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMic: () => void;
}

// Create context
const CallContext = createContext<CallContextType | undefined>(undefined);

// Provider component
export function CallProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CallState>({
    status: 'idle',
    isMicEnabled: true,
    isCallActive: false,
    error: null,
  });

  // Start a call
  // In a real app, this would connect to a voice service
  const startCall = async () => {
    try {
      setState(prev => ({ ...prev, status: 'connecting' }));
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        status: 'connected',
        isCallActive: true,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  // End a call
  const endCall = async () => {
    try {
      setState(prev => ({ ...prev, status: 'disconnecting' }));
      
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setState(prev => ({
        ...prev,
        status: 'idle',
        isCallActive: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    setState(prev => ({ ...prev, isMicEnabled: !prev.isMicEnabled }));
  };

  const value = {
    ...state,
    startCall,
    endCall,
    toggleMic,
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
