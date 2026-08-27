import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const OfferContext =
  createContext(null);

export function OfferProvider({
  children,
}) {
  const [offers, setOffers] =
    useState([]);

  const [loadingOffers, setLoadingOffers] =
    useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoadingOffers(true);

        const snapshot =
          await getDocs(
            collection(
              db,
              "offers"
            )
          );

        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const activeOffers =
          snapshot.docs
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }))
            .filter((offer) => {
              const discountPercent =
                Number(
                  offer.discountPercent ||
                    0
                );

              return (
                offer.active === true &&
                discountPercent > 0 &&
                today >=
                  offer.startDate &&
                today <=
                  offer.endDate
              );
            });

        setOffers(
          activeOffers
        );
      } catch (error) {
        console.error(
          "Unable to load offers:",
          error
        );

        setOffers([]);
      } finally {
        setLoadingOffers(false);
      }
    };

    loadOffers();
  }, []);

  // First active offer.
  // This preserves the current ProductCard
  // behaviour of using one active offer.

  const activeOffer =
    offers.length > 0
      ? offers[0]
      : null;

  return (
    <OfferContext.Provider
      value={{
        offers,
        activeOffer,
        loadingOffers,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
}

export function useOffers() {
  return useContext(
    OfferContext
  );
}