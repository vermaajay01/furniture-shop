
import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
// SESSION SETTINGS
// ======================================================

const INACTIVITY_LIMIT =
 60 * 60 * 1000; // 1 hour
 

const ACTIVITY_STORAGE_KEY =
  "hariOmLastActivity";

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

  const lastActivityRef =
    useRef(null);

  const activeUidRef =
    useRef(null);

  const initialAuthCheckRef =
    useRef(true);

  const logoutInProgressRef =
    useRef(false);

  // ====================================================
  // STORAGE KEY FOR CURRENT USER
  // ====================================================

  const getActivityKey = (uid) =>
    `${ACTIVITY_STORAGE_KEY}_${uid}`;

  // ====================================================
  // UPDATE USER ACTIVITY
  // ====================================================

  const updateActivity = () => {
    if (!auth.currentUser) return;

    const now = Date.now();

    lastActivityRef.current = now;

    try {
      localStorage.setItem(
        getActivityKey(
          auth.currentUser.uid
        ),
        String(now)
      );
    } catch (error) {
      console.error(
        "Unable to save activity:",
        error
      );
    }
  };

  // ====================================================
  // AUTOMATIC LOGOUT
  // ====================================================

  const automaticLogout = async () => {
    if (logoutInProgressRef.current) {
      return;
    }

    logoutInProgressRef.current = true;

    const currentUser =
      auth.currentUser;

    const destination =
      currentUser?.uid === ADMIN_UID
        ? "/admin"
        : "/login";

    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Automatic logout failed:",
        error
      );
    } finally {
      window.location.assign(
        destination
      );
    }
  };

  // ====================================================
  // AUTH STATE LISTENER
  // ====================================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          try {
            // ------------------------------------------
            // USER LOGGED OUT
            // ------------------------------------------

            if (!currentUser) {
              const previousUid =
                activeUidRef.current;

              if (previousUid) {
                localStorage.removeItem(
                  getActivityKey(
                    previousUid
                  )
                );
              }

              activeUidRef.current = null;
              lastActivityRef.current = null;

              setUser(null);
              setProfile(null);
              setLoading(false);

              return;
            }

            // ------------------------------------------
            // USER LOGGED IN
            // ------------------------------------------

            setUser(currentUser);

            const activityKey =
              getActivityKey(
                currentUser.uid
              );

            let lastActivity = null;

            // New login or account switch:
            // Start a fresh session.
            const isNewSession =
              !initialAuthCheckRef.current &&
              activeUidRef.current !==
                currentUser.uid;

            try {
              if (isNewSession) {
                lastActivity = Date.now();

                localStorage.setItem(
                  activityKey,
                  String(lastActivity)
                );
              } else {
                const storedActivity =
                  localStorage.getItem(
                    activityKey
                  );

                lastActivity =
                  storedActivity
                    ? Number(storedActivity)
                    : null;

                // First login after installing
                // this session system.
                if (
                  !lastActivity ||
                  !Number.isFinite(
                    lastActivity
                  )
                ) {
                  lastActivity = Date.now();

                  localStorage.setItem(
                    activityKey,
                    String(lastActivity)
                  );
                }
              }
            } catch (error) {
              console.error(
                "Session storage error:",
                error
              );

              lastActivity = Date.now();
            }

            initialAuthCheckRef.current = false;

            activeUidRef.current =
              currentUser.uid;

            lastActivityRef.current =
              lastActivity;

            // ------------------------------------------
            // CHECK SESSION EXPIRY
            // ------------------------------------------

            if (
              Date.now() - lastActivity >=
              INACTIVITY_LIMIT
            ) {
              await automaticLogout();
              return;
            }

            // ------------------------------------------
            // ADMIN PROFILE
            // ------------------------------------------

            if (
              currentUser.uid ===
              ADMIN_UID
            ) {
              setProfile(null);
              setLoading(false);
              return;
            }

            // ------------------------------------------
            // CUSTOMER PROFILE
            // ------------------------------------------

            const profileRef =
              doc(
                db,
                "customers",
                currentUser.uid
              );

            const profileSnapshot =
              await getDoc(profileRef);

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
              "Loading authentication failed:",
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
  // ACTIVITY TRACKING
  // ====================================================

  useEffect(() => {
    if (!user) return;

    let lastSaved = 0;

    const handleActivity = () => {
      if (!auth.currentUser) return;

      const now = Date.now();

      lastActivityRef.current = now;

      // Avoid excessive localStorage writes.
      if (now - lastSaved >= 15000) {
        lastSaved = now;
        updateActivity();
      }
    };

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel",
    ];

    events.forEach((event) => {
      window.addEventListener(
        event,
        handleActivity,
        { passive: true }
      );
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(
          event,
          handleActivity
        );
      });
    };
  }, [user]);

  // ====================================================
  // CROSS-TAB ACTIVITY SYNC
  // ====================================================

  useEffect(() => {
    const handleStorage = (event) => {
      if (!user) return;

      if (
        event.key !==
        getActivityKey(user.uid)
      ) {
        return;
      }

      const timestamp =
        Number(event.newValue);

      if (
        timestamp &&
        Number.isFinite(timestamp)
      ) {
        lastActivityRef.current =
          timestamp;
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [user]);

  // ====================================================
  // CHECK INACTIVITY EVERY 5 SECONDS
  // ====================================================

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const lastActivity =
        lastActivityRef.current;

      if (!lastActivity) return;

      const inactiveDuration =
        Date.now() - lastActivity;

      if (
        inactiveDuration >=
        INACTIVITY_LIMIT
      ) {
        automaticLogout();
      }
    }, 5000);

    return () =>
      clearInterval(interval);
  }, [user]);

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
  // MANUAL LOGOUT
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
