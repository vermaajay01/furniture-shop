import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { CartProvider } from "./context/CartContext";
import { OfferProvider } from "./context/OfferContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <OfferProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </OfferProvider>
  </React.StrictMode>
);