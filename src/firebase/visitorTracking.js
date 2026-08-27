import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// ======================================================
// STORAGE KEYS
// ======================================================

const VISITOR_ID_KEY = "hari_om_visitor_id";

// ======================================================
// GET VISITOR ID
// ======================================================

function getVisitorId() {
  let visitorId = localStorage.getItem(
    VISITOR_ID_KEY
  );

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem(
      VISITOR_ID_KEY,
      visitorId
    );
  }

  return visitorId;
}

// ======================================================
// GET TODAY
// ======================================================

function getToday() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ======================================================
// TRACK VISITOR
// ======================================================

export async function trackVisitor() {
  try {
    const visitorId =
      getVisitorId();

    const today =
      getToday();

    const visitorsRef =
      collection(
        db,
        "visitors"
      );

    // ====================================================
    // FIND EXISTING VISITOR
    // ====================================================

    const visitorQuery =
      query(
        visitorsRef,
        where(
          "visitorId",
          "==",
          visitorId
        )
      );

    const snapshot =
      await getDocs(
        visitorQuery
      );

    // ====================================================
    // EXISTING VISITOR
    // ====================================================

    if (!snapshot.empty) {
      // Use the first existing record.
      // This also keeps compatibility with
      // your old visitor documents.

      const existingVisitor =
        snapshot.docs[0];

      await updateDoc(
        existingVisitor.ref,
        {
          lastVisitDate:
            today,

          lastVisitAt:
            serverTimestamp(),
        }
      );

      return;
    }

    // ====================================================
    // NEW UNIQUE VISITOR
    // ====================================================

    await addDoc(
      visitorsRef,
      {
        visitorId:
          visitorId,

        firstVisitDate:
          today,

        lastVisitDate:
          today,

        createdAt:
          serverTimestamp(),

        lastVisitAt:
          serverTimestamp(),
      }
    );

  } catch (error) {
    console.error(
      "Visitor tracking failed:",
      error
    );
  }
}