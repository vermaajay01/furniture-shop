import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

const CART_KEY = "hari_om_cart";

export function CartProvider({
  children,
}) {
  const [cartItems, setCartItems] =
    useState(() => {
      try {
        const savedCart =
          localStorage.getItem(
            CART_KEY
          );

        const parsedCart = savedCart
          ? JSON.parse(savedCart)
          : [];

        // ==================================================
        // CLEAN OLD / INVALID CART DATA
        // ==================================================

        if (!Array.isArray(parsedCart)) {
          return [];
        }

        return parsedCart.map((item) => ({
          ...item,

          quantity: Math.max(
            1,
            Number(
              item.quantity || 1
            )
          ),

          stockQuantity: Math.max(
            0,
            Number(
              item.stockQuantity ?? 0
            )
          ),
        }));
      } catch {
        return [];
      }
    });

  // ======================================================
  // SAVE CART TO LOCAL STORAGE
  // ======================================================

  useEffect(() => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // ======================================================
  // GET STOCK
  // ======================================================

  const getStockQuantity = (
    product
  ) => {
    return Math.max(
      0,
      Number(
        product?.stockQuantity ?? 0
      )
    );
  };

  // ======================================================
  // ADD TO CART
  // ======================================================

  const addToCart = (product) => {
    setCartItems((previous) => {
      const stockQuantity =
        getStockQuantity(product);

      // ==================================================
      // OUT OF STOCK
      // ==================================================

      if (stockQuantity <= 0) {
        return previous;
      }

      const existing =
        previous.find(
          (item) =>
            item.id === product.id
        );

      // ==================================================
      // EXISTING PRODUCT
      // ==================================================

      if (existing) {
        // Don't allow quantity above stock.
        if (
          existing.quantity >=
          stockQuantity
        ) {
          return previous;
        }

        return previous.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,

                  quantity:
                    Math.min(
                      item.quantity + 1,
                      stockQuantity
                    ),

                  // Keep latest stock
                  stockQuantity:
                    stockQuantity,

                  // Keep offer information
                  originalPrice:
                    Number(
                      product.originalPrice ??
                        item.originalPrice ??
                        product.price ??
                        0
                    ),

                  discountPercent:
                    Number(
                      product.discountPercent ??
                        item.discountPercent ??
                        0
                    ),

                  // Latest selling price
                  price:
                    Number(
                      product.price ??
                        item.price ??
                        0
                    ),
                }
              : item
        );
      }

      // ==================================================
      // NEW PRODUCT
      // ==================================================

      const currentPrice =
        Number(
          product.price || 0
        );

      const originalPrice =
        Number(
          product.originalPrice ??
            currentPrice
        );

      const discountPercent =
        Number(
          product.discountPercent ||
            0
        );

      return [
        ...previous,

        {
          id: product.id,

          name:
            product.name,

          // Current selling price
          price:
            currentPrice,

          // Original price
          originalPrice:
            originalPrice,

          // Discount percentage
          discountPercent:
            discountPercent,

          image:
            product.image || "",

          category:
            product.category ||
            "Furniture",

          material:
            product.material || "",

          // Current available stock
          stockQuantity:
            stockQuantity,

          quantity: 1,
        },
      ];
    });
  };

  // ======================================================
  // INCREASE QUANTITY
  // ======================================================

  const increaseQuantity = (id) => {
    setCartItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const stockQuantity =
          Math.max(
            0,
            Number(
              item.stockQuantity ?? 0
            )
          );

        // Already at maximum stock
        if (
          item.quantity >=
          stockQuantity
        ) {
          return item;
        }

        return {
          ...item,

          quantity:
            Math.min(
              item.quantity + 1,
              stockQuantity
            ),
        };
      })
    );
  };

  // ======================================================
  // DECREASE QUANTITY
  // ======================================================

  const decreaseQuantity = (id) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? {
                ...item,

                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  // ======================================================
  // CAN ADD MORE?
  // ======================================================

  const canAddMore = (id) => {
    const item =
      cartItems.find(
        (cartItem) =>
          cartItem.id === id
      );

    if (!item) {
      return true;
    }

    const stockQuantity =
      Math.max(
        0,
        Number(
          item.stockQuantity ?? 0
        )
      );

    return (
      stockQuantity > 0 &&
      item.quantity <
        stockQuantity
    );
  };

  // ======================================================
  // GET AVAILABLE STOCK
  // ======================================================

  const getAvailableStock = (id) => {
    const item =
      cartItems.find(
        (cartItem) =>
          cartItem.id === id
      );

    if (!item) {
      return 0;
    }

    return Math.max(
      0,
      Number(
        item.stockQuantity ?? 0
      )
    );
  };

  // ======================================================
  // REMOVE PRODUCT
  // ======================================================

  const removeFromCart = (id) => {
    setCartItems((previous) =>
      previous.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // ======================================================
  // CLEAR CART
  // ======================================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ======================================================
  // CART COUNT
  // ======================================================

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  // ======================================================
  // CART TOTAL
  // ======================================================

  // IMPORTANT:
  // item.price is the current selling price.
  //
  // Therefore, when an offer exists,
  // the discounted price is used here.

  const cartTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  // ======================================================
  // PROVIDER
  // ======================================================

  return (
    <CartContext.Provider
      value={{
        cartItems,

        cartCount,

        cartTotal,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        canAddMore,

        getAvailableStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ========================================================
// USE CART
// ========================================================

export function useCart() {
  return useContext(
    CartContext
  );
}