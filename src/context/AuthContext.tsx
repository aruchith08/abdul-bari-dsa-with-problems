import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = () => {
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const clearAuthError = () => setAuthError(null);

function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in your Firebase Console yet. Please enable "Email/Password" under Firebase Console > Authentication > Sign-in method.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Switch to "Sign In" above.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not in your Firebase Authorized Domains list.';
    default:
      return error.message?.replace(/^Firebase:\s*/, '') || 'Authentication failed.';
  }
}

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(formatAuthError(error));
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setAuthError(null);
      await signInWithEmailAndPassword(auth, email, pass);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email Sign-In Error:', error);
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      setAuthError(null);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email Sign-Up Error:', error);
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
