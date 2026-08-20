import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OfferBanner from "../components/OfferBanner";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* ==================================================
          FIXED NAVBAR
      ================================================== */}

      <Navbar />

      {/* ==================================================
          CONTENT AREA
          Navbar height = 82px
      ================================================== */}

      <div className="pt-[82px]">

        {/* OFFER BANNER */}

        <OfferBanner />

        {/* PAGE CONTENT */}

        <main className="flex-1">
          <Outlet />
        </main>

      </div>

      <Footer />

    </div>
  );
}

export default MainLayout;