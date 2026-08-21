'use client';
import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'sankalp_user_role';
const EVENT_NAME = 'sankalp_auth_change';

export const ROLES = {
  CITIZEN: 'citizen',
  NGO: 'ngo',
  VOLUNTEER: 'volunteer',
  DC: 'dc',
};

export const ROLE_LABELS = {
  citizen: 'Citizen',
  ngo: 'NGO Admin',
  volunteer: 'Volunteer',
  dc: 'District Collector',
};

export function useAuth() {
  const [role, setRole] = useState(null);

  const refresh = useCallback(() => {
    if (typeof window !== 'undefined') {
      setRole(sessionStorage.getItem(AUTH_KEY) || null);
    }
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }, [refresh]);

  const login = useCallback((newRole) => {
    sessionStorage.setItem(AUTH_KEY, newRole);
    setRole(newRole);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setRole(null);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }, []);

  const isLoggedIn = role !== null;

  return { role, isLoggedIn, login, logout };
}
