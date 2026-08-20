import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OfferBanner from "../components/OfferBanner";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar />

      {/* ==================================================
          OFFER BANNER / OFFER CAROUSEL
          Appears directly below navbar
      ================================================== */}

      <OfferBanner />

      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <main className="flex-1 pt-[82px]">
        <Outlet />
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />

    </div>
  );
}

export default MainLayout;