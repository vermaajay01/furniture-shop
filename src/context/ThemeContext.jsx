import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const ThemeContext =
  createContext(null);

// ======================================================
// AVAILABLE THEMES
// ======================================================

export const themes = {
  "classic-maroon": {
    name: "Classic Maroon",

    primary: "#8B2E2E",
    primaryDark: "#6B1E1E",
    background: "#F8F1E7",
    surface: "#FFFFFF",
    secondaryBackground: "#EDE0D2",
    text: "#2B1714",
    gold: "#E0B66B",
    lightAccent: "#F5E4E4",
  },

  "forest-green": {
    name: "Forest Green",

    primary: "#3E7658",
    primaryDark: "#315C46",
    background: "#F3F6F1",
    surface: "#FFFFFF",
    secondaryBackground: "#E2EBDD",
    text: "#17251C",
    gold: "#C2A15A",
    lightAccent: "#E4EEE7",
  },

  "royal-navy": {
    name: "Royal Navy",

    primary: "#31577F",
    primaryDark: "#243B5A",
    background: "#F3F5F8",
    surface: "#FFFFFF",
    secondaryBackground: "#E1E7EF",
    text: "#17202B",
    gold: "#C7A65A",
    lightAccent: "#E5EBF3",
  },

  "walnut-brown": {
    name: "Walnut Brown",

    primary: "#765039",
    primaryDark: "#5A3928",
    background: "#F7F1EA",
    surface: "#FFFFFF",
    secondaryBackground: "#E9DDD0",
    text: "#2B1D15",
    gold: "#C19A63",
    lightAccent: "#EFE3D7",
  },

  "modern-charcoal": {
    name: "Modern Charcoal",

    primary: "#464D57",
    primaryDark: "#30343B",
    background: "#F2F3F4",
    surface: "#FFFFFF",
    secondaryBackground: "#E1E3E6",
    text: "#202328",
    gold: "#C5A66A",
    lightAccent: "#E7E7E5",
  },
};

// ======================================================
// PROVIDER
// ======================================================

export function ThemeProvider({
  children,
}) {
  const [themeId, setThemeId] =
    useState("classic-maroon");

  // ======================================================
  // LOAD THEME FROM FIRESTORE
  // ======================================================

  useEffect(() => {
    const settingsRef = doc(
      db,
      "settings",
      "website"
    );

    const unsubscribe =
      onSnapshot(
        settingsRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            return;
          }

          const data =
            snapshot.data();

          const savedTheme =
            data.themeId;

          if (
            savedTheme &&
            themes[savedTheme]
          ) {
            setThemeId(
              savedTheme
            );
          } else {
            setThemeId(
              "classic-maroon"
            );
          }
        },
        (error) => {
          console.error(
            "Unable to load website theme:",
            error
          );

          setThemeId(
            "classic-maroon"
          );
        }
      );

    return () => unsubscribe();
  }, []);

  // ======================================================
  // APPLY THEME
  // ======================================================

  useEffect(() => {
    const selectedTheme =
      themes[themeId] ||
      themes["classic-maroon"];

    const root =
      document.documentElement;

    root.setAttribute(
      "data-theme",
      themeId
    );

    root.style.setProperty(
      "--theme-primary",
      selectedTheme.primary
    );

    root.style.setProperty(
      "--theme-primary-dark",
      selectedTheme.primaryDark
    );

    root.style.setProperty(
      "--theme-background",
      selectedTheme.background
    );

    root.style.setProperty(
      "--theme-surface",
      selectedTheme.surface
    );

    root.style.setProperty(
      "--theme-secondary-background",
      selectedTheme.secondaryBackground
    );

    root.style.setProperty(
      "--theme-text",
      selectedTheme.text
    );

    root.style.setProperty(
      "--theme-gold",
      selectedTheme.gold
    );

    root.style.setProperty(
      "--theme-light-accent",
      selectedTheme.lightAccent
    );

    root.style.setProperty(
      "--theme-primary-rgb",
      hexToRgb(
        selectedTheme.primary
      )
    );

    root.style.setProperty(
      "--theme-primary-dark-rgb",
      hexToRgb(
        selectedTheme.primaryDark
      )
    );
  }, [themeId]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme:
          themes[themeId] ||
          themes["classic-maroon"],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ======================================================
// HEX → RGB
// ======================================================

function hexToRgb(hex) {
  const value =
    hex.replace("#", "");

  const bigint =
    parseInt(value, 16);

  const red =
    (bigint >> 16) & 255;

  const green =
    (bigint >> 8) & 255;

  const blue =
    bigint & 255;

  return `${red}, ${green}, ${blue}`;
}

// ======================================================
// HOOK
// ======================================================

export function useTheme() {
  return useContext(
    ThemeContext
  );
}