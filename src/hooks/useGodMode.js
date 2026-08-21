'use client';
import { useState, useEffect, useCallback } from 'react';
import { getCustomDisasters, getSimulatedRequests } from '../lib/god-mode';

export function useGodMode() {
  const [customDisasters, setCustomDisasters] = useState([]);
  const [simulatedRequests, setSimulatedRequests] = useState([]);

  const refresh = useCallback(() => {
    setCustomDisasters(getCustomDisasters());
    setSimulatedRequests(getSimulatedRequests());
  }, []);

  useEffect(() => {
    refresh();
    
    const handler = () => refresh();
    window.addEventListener('sankalp_disaster_update', handler);
    window.addEventListener('storage', handler);
    
    return () => {
      window.removeEventListener('sankalp_disaster_update', handler);
      window.removeEventListener('storage', handler);
    };
  }, [refresh]);

  return { customDisasters, simulatedRequests, refresh };
}
