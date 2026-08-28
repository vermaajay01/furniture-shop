import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  useWishlist,
} from "../../context/WishlistContext";

function Wishlist() {
  const {
    wishlist,
    loading,
    removeFromWishlist,
  } = useWishlist();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E7]">
        <div className="flex items-center gap-3 text-[#6B1E1E]">
          <Loader2
            size={24}
            className="animate-spin"
          />
          Loading wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#F8F1E7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#B8863B]">
            Customer Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
            My Wishlist
          </h1>

          <p className="mt-2 text-gray-500">
            Save furniture you love for later.
          </p>
        </div>

        {!wishlist.length ? (
          <div className="mt-8 bg-white px-6 py-16 text-center shadow-sm">
            <Heart
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-xl font-bold text-[#6B1E1E]">
              Your Wishlist is Empty
            </h2>

            <p className="mt-2 text-gray-500">
              Save your favourite furniture here.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 bg-[#6B1E1E] px-6 py-3 font-semibold text-white hover:bg-[#8B2E2E]"
            >
              <ShoppingBag size={18} />
              Explore Furniture
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden bg-white shadow-sm"
              >
                <Link to={`/product/${item.id}`}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "Furniture"}
                      className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-gray-100">
                      <Heart
                        size={35}
                        className="text-gray-300"
                      />
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <Link
                    to={`/product/${item.id}`}
                    className="font-semibold text-[#2B1714] hover:text-[#8B2E2E]"
                  >
                    {item.name || "Furniture"}
                  </Link>

                  <p className="mt-2 text-xl font-bold text-[#8B2E2E]">
                    ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  {item.material && (
                    <p className="mt-1 text-xs text-gray-400">
                      {item.material}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(
                        item.id
                      )
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;
