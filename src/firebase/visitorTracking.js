import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";

import { db } from "./firebase";

// ======================================================
// STORAGE KEY
// ======================================================

const VISITOR_ID_KEY =
  "hari_om_visitor_id";

// ======================================================
// LOCATION API
//
// IP-based location is approximate and may be affected by
// VPNs, mobile networks, proxies, or ISP routing.
// ======================================================

const LOCATION_API =
  "https://ipapi.co/json/";

// ======================================================
// GET DEVICE TYPE
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
// GET BROWSER
// ======================================================

function getBrowser() {
  const userAgent =
    navigator.userAgent;

  if (userAgent.includes("Edg/")) {
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

  if (userAgent.includes("Firefox")) {
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
// GET OPERATING SYSTEM
// ======================================================

function getOperatingSystem() {
  const userAgent =
    navigator.userAgent;

  if (/Windows NT/i.test(userAgent)) {
    return "Windows";
  }

  if (/Android/i.test(userAgent)) {
    return "Android";
  }

  if (
    /iPhone|iPad|iPod/i.test(
      userAgent
    )
  ) {
    return "iOS";
  }

  if (/Mac OS X/i.test(userAgent)) {
    return "macOS";
  }

  if (/Linux/i.test(userAgent)) {
    return "Linux";
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
// GET DATE
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
// GET TRAFFIC SOURCE
// ======================================================

function getTrafficSource() {
  const referrer =
    document.referrer;

  if (!referrer) {
    return "Direct";
  }

  try {
    const url =
      new URL(referrer);

    const currentHost =
      window.location.hostname;

    if (
      url.hostname ===
      currentHost
    ) {
      return "Internal";
    }

    return url.hostname;
  } catch {
    return "Other";
  }
}

// ======================================================
// GET APPROXIMATE LOCATION
// ======================================================

async function getVisitorLocation() {
  try {
    const response =
      await fetch(
        LOCATION_API,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json",
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        `Location request failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    return {
      city:
        data.city || "Unknown",

      region:
        data.region || "Unknown",

      country:
        data.country_name ||
        data.country ||
        "Unknown",

      countryCode:
        data.country_code ||
        "",

      timezone:
        data.timezone || "",
    };
  } catch (error) {
    console.warn(
      "Visitor location unavailable:",
      error
    );

    return {
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      countryCode: "",
      timezone: "",
    };
  }
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

    const operatingSystem =
      getOperatingSystem();

    const screenResolution =
      `${window.screen.width}x${window.screen.height}`;

    const currentPage =
      window.location.pathname;

    const trafficSource =
      getTrafficSource();

    // ==================================================
    // LOCATION
    // ==================================================

    const location =
      await getVisitorLocation();

    // ==================================================
    // DAILY USER DOCUMENT
    //
    // One anonymous user gets one document per day.
    // ==================================================

    const documentId =
      `${visitorId}_${today}`;

    const visitorRef = doc(
      db,
      "visitorAnalytics",
      documentId
    );

    const visitorSnapshot =
      await getDoc(visitorRef);

    // ==================================================
    // EXISTING USER TODAY
    // ==================================================

    if (visitorSnapshot.exists()) {
      await setDoc(
        visitorRef,
        {
          lastVisitAt:
            serverTimestamp(),

          lastPage:
            currentPage,

          visitCount:
            increment(1),

          // Refresh approximate location
          city:
            location.city,

          region:
            location.region,

          country:
            location.country,

          countryCode:
            location.countryCode,

          timezone:
            location.timezone,
        },
        {
          merge: true,
        }
      );

      return;
    }

    // ==================================================
    // NEW USER TODAY
    // ==================================================

    await setDoc(
      visitorRef,
      {
        visitorId:
          visitorId,

        date:
          today,

        deviceType:
          deviceType,

        browser:
          browser,

        operatingSystem:
          operatingSystem,

        screenResolution:
          screenResolution,

        firstPage:
          currentPage,

        lastPage:
          currentPage,

        trafficSource:
          trafficSource,

        city:
          location.city,

        region:
          location.region,

        country:
          location.country,

        countryCode:
          location.countryCode,

        timezone:
          location.timezone,

        firstVisitAt:
          serverTimestamp(),

        lastVisitAt:
          serverTimestamp(),

        visitCount:
          1,
      }
    );

  } catch (error) {
    console.error(
      "Visitor analytics failed:",
      error
    );
  }
}