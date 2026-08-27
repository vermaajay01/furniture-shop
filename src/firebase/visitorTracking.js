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

const VISITOR_ID_KEY =
  "hari_om_visitor_id";

// ======================================================
// DEVICE DETECTION
// ======================================================

function getDeviceType() {
  const width = window.innerWidth;

  if (width <= 767) {
    return "Mobile";
  }

  if (width <= 1024) {
    return "Tablet";
  }

  return "Desktop";
}

// ======================================================
// BROWSER DETECTION
// ======================================================

function getBrowser() {
  const userAgent =
    navigator.userAgent;

  if (
    userAgent.includes("Edg/")
  ) {
    return "Microsoft Edge";
  }

  if (
    userAgent.includes("OPR/") ||
    userAgent.includes("Opera")
  ) {
    return "Opera";
  }

  if (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg/")
  ) {
    return "Google Chrome";
  }

  if (
    userAgent.includes("Firefox")
  ) {
    return "Mozilla Firefox";
  }

  if (
    userAgent.includes("Safari") &&
    !userAgent.includes("Chrome")
  ) {
    return "Safari";
  }

  return "Other";
}

// ======================================================
// GET VISITOR ID
// ======================================================

function getVisitorId() {
  let visitorId =
    localStorage.getItem(
      VISITOR_ID_KEY
    );

  if (!visitorId) {
    visitorId =
      crypto.randomUUID();

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

  const year =
    now.getFullYear();

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

    const deviceType =
      getDeviceType();

    const browser =
      getBrowser();

    const visitorsRef =
      collection(
        db,
        "visitors"
      );

    // ====================================================
    // FIND EXISTING UNIQUE VISITOR
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
      const existingVisitor =
        snapshot.docs[0];

      await updateDoc(
        existingVisitor.ref,
        {
          deviceType:
            deviceType,

          browser:
            browser,

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

        deviceType:
          deviceType,

        browser:
          browser,

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