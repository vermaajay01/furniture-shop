import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";

const WishlistContext =
  createContext(null);

export function WishlistProvider({
  children,
}) {
  const { user } = useAuth();

  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD CUSTOMER WISHLIST
  // ======================================================

  useEffect(() => {
    let active = true;

    const loadWishlist = async () => {
      if (!user) {
        if (active) {
          setWishlist([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        const snapshot =
          await getDocs(
            collection(
              db,
              "users",
              user.uid,
              "wishlist"
            )
          );

        const items =
          snapshot.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          );

        if (active) {
          setWishlist(items);
        }
      } catch (error) {
        console.error(
          "Unable to load wishlist:",
          error
        );

        if (active) {
          setWishlist([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      active = false;
    };
  }, [user]);

  // ======================================================
  // CHECK WISHLIST
  // ======================================================

  const isInWishlist = (
    productId
  ) => {
    return wishlist.some(
      (item) => item.id === productId
    );
  };

  // ======================================================
  // ADD / REMOVE
  // ======================================================

  const toggleWishlist = async (
    product
  ) => {
    if (!user) {
      alert(
        "Please login to use your wishlist."
      );
      return false;
    }

    if (!product?.id) {
      return false;
    }

    const wishlistRef = doc(
      db,
      "users",
      user.uid,
      "wishlist",
      product.id
    );

    try {
      if (isInWishlist(product.id)) {
        await deleteDoc(
          wishlistRef
        );

        setWishlist((previous) =>
          previous.filter(
            (item) =>
              item.id !== product.id
          )
        );

        return false;
      }

      const wishlistItem = {
        productId:
          product.id,

        name:
          product.name || "",

        price:
          Number(product.price || 0),

        image:
          product.image || "",

        category:
          product.category || "",

        material:
          product.material || "",

        available:
          product.available !== false,

        addedAt:
          new Date().toISOString(),
      };

      await setDoc(
        wishlistRef,
        wishlistItem
      );

      setWishlist((previous) => [
        ...previous,
        {
          id: product.id,
          ...wishlistItem,
        },
      ]);

      return true;
    } catch (error) {
      console.error(
        "Wishlist update failed:",
        error
      );

      alert(
        "Unable to update wishlist."
      );

      return false;
    }
  };

  const removeFromWishlist =
    async (productId) => {
      if (!user || !productId) {
        return;
      }

      try {
        await deleteDoc(
          doc(
            db,
            "users",
            user.uid,
            "wishlist",
            productId
          )
        );

        setWishlist((previous) =>
          previous.filter(
            (item) =>
              item.id !== productId
          )
        );
      } catch (error) {
        console.error(
          "Unable to remove wishlist item:",
          error
        );
      }
    };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}
