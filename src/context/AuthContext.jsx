import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/firebase";

// ======================================================
// AUTH CONTEXT
// ======================================================

const AuthContext =
  createContext(null);

// ======================================================
// PROVIDER
// ======================================================

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ====================================================
  // AUTH STATE
  // ====================================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          try {
            setUser(currentUser);

            if (currentUser) {
              const profileRef =
                doc(
                  db,
                  "customers",
                  currentUser.uid
                );

              const profileSnapshot =
                await getDoc(
                  profileRef
                );

              if (
                profileSnapshot.exists()
              ) {
                setProfile(
                  profileSnapshot.data()
                );
              } else {
                setProfile(null);
              }
            } else {
              setProfile(null);
            }
          } catch (error) {
            console.error(
              "Loading customer profile failed:",
              error
            );

            setProfile(null);
          } finally {
            setLoading(false);
          }
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = async () => {
    await signOut(auth);
  };

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = {
    user,
    profile,
    loading,
    isLoggedIn: !!user,
    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// HOOK
// ======================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}