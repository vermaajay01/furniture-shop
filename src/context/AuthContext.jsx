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
// ADMIN UID
// ======================================================

const ADMIN_UID =
  "LIgw6OZ6uaOB27EJiONu55tClUh1";

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

            if (!currentUser) {
              setProfile(null);
              setLoading(false);
              return;
            }

            // Admin does not need a customer profile.
            if (
              currentUser.uid ===
              ADMIN_UID
            ) {
              setProfile(null);
              setLoading(false);
              return;
            }

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
  // ROLE
  // ====================================================

  const isAdmin =
    !!user &&
    user.uid === ADMIN_UID;

  const isCustomer =
    !!user && !isAdmin;

  const role = !user
    ? "guest"
    : isAdmin
      ? "admin"
      : "customer";

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

    isLoggedIn:
      !!user,

    isAdmin,

    isCustomer,

    role,

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