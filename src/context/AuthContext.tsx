import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { RoleId } from '../data/roles';

export type AuthState = 'unauthenticated' | 'authenticating' | 'authenticated' | 'error';

interface User {
  roleId: RoleId;
  token?: string;
  name?: string;
}

interface AuthContextType {
  authState: AuthState;
  user: User | null;
  error: string | null;
  login: (roleId: RoleId, email: string, password: string) => Promise<void>;
  signup: (roleId: RoleId, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to interact with mock DB in local storage
const getMockDb = () => {
  const db = localStorage.getItem('ner_logistics_mock_db');
  return db ? JSON.parse(db) : {};
};

const saveMockDb = (db: any) => {
  localStorage.setItem('ner_logistics_mock_db', JSON.stringify(db));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (roleId: RoleId, email: string, password: string) => {
    setAuthState('authenticating');
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const db = getMockDb();
    const userRecord = db[email];

    if (!userRecord) {
      setAuthState('error');
      setError('Account not found. Please sign up first.');
    } else if (userRecord.password !== password) {
      setAuthState('error');
      setError('Incorrect email or password.');
    } else {
      setAuthState('authenticated');
      setUser({ roleId, name: userRecord.name || 'User', token: 'mock-token-123' });
    }
  };

  const signup = async (roleId: RoleId, email: string, password: string) => {
    setAuthState('authenticating');
    setError(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const db = getMockDb();
    if (db[email]) {
      setAuthState('error');
      setError('An account with this email already exists. Please log in.');
      return;
    }

    // Save to mock database
    db[email] = { password, roleId, name: email.split('@')[0] };
    saveMockDb(db);

    // Automatically log the user in
    setAuthState('authenticated');
    setUser({ roleId, name: db[email].name, token: 'mock-token-123' });
  };

  const logout = () => {
    setAuthState('unauthenticated');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ authState, user, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
