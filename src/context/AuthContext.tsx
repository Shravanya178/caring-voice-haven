
import React, { createContext, useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

type User = firebase.User | null;

interface AuthContextProps {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      // This is a placeholder. In a real app, you would implement
      // the complete phone authentication flow with verification code
      const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
      // Return the confirmation result to be used later for verification
      return confirmationResult;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    signOut,
    sendPasswordResetEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
