import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { app } from "./firebase";

// ======================================================
// ADMIN UID
// ======================================================

export const ADMIN_UID =
  "LIgw6OZ6uaOB27EJiONu55tClUh1";

// ======================================================
// FIREBASE AUTH
// ======================================================

const auth = getAuth(app);

// ======================================================
// ADMIN LOGIN
// ======================================================

export const adminLogin = async (
  email,
  password
) => {
  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  // Only the authorized UID can access admin
  if (
    result.user.uid !== ADMIN_UID
  ) {
    await signOut(auth);

    const error = new Error(
      "This account is not authorized to access the admin panel."
    );

    error.code = "auth/not-admin";

    throw error;
  }

  return result;
};

// ======================================================
// ADMIN LOGOUT
// ======================================================

export const adminLogout = async () => {
  await signOut(auth);
};

// ======================================================
// AUTH STATE LISTENER
// ======================================================

export const listenToAuthState = (
  callback
) => {
  return onAuthStateChanged(
    auth,
    callback
  );
};

// ======================================================
// CHECK ADMIN
// ======================================================

export const isAdmin = (user) => {
  return Boolean(
    user &&
      user.uid === ADMIN_UID
  );
};

// ======================================================
// GET CURRENT ADMIN
// ======================================================

export const getCurrentAdmin = () => {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  if (!isAdmin(user)) {
    return null;
  }

  return user;
};

// ======================================================
// EXPORT AUTH
// ======================================================

export { auth };