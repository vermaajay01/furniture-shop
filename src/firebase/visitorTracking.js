import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// ======================================================
// STORAGE KEYS
// ======================================================

const VISITOR_ID_KEY = "hari_om_visitor_id";
const VISITOR_DATE_KEY = "hari_om_visitor_date";

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
    const visitorId = getVisitorId();
    const today = getToday();

    // Check local browser record first
    const lastVisit = localStorage.getItem(
      VISITOR_DATE_KEY
    );

    // Already counted today
    if (lastVisit === today) {
      return;
    }

    const visitorsRef = collection(
      db,
      "visitors"
    );

    // Check Firestore as well
    const visitorQuery = query(
      visitorsRef,
      where(
        "visitorId",
        "==",
        visitorId
      ),
      where(
        "date",
        "==",
        today
      )
    );

    const snapshot =
      await getDocs(visitorQuery);

    // Create visitor record
    if (snapshot.empty) {
      await addDoc(visitorsRef, {
        visitorId: visitorId,
        date: today,
        createdAt: serverTimestamp(),
      });
    }

    // Remember today's visit
    localStorage.setItem(
      VISITOR_DATE_KEY,
      today
    );

  } catch (error) {
    console.error(
      "Visitor tracking failed:",
      error
    );
  }
}