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

        return savedCart
          ? JSON.parse(savedCart)
          : [];
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
  // ADD TO CART
  // ======================================================

  const addToCart = (product) => {
    setCartItems((previous) => {
      const existing =
        previous.find(
          (item) =>
            item.id === product.id
        );

      // ==================================================
      // EXISTING PRODUCT
      // ==================================================

      if (existing) {
        return previous.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,

                  // Keep existing product
                  // information

                  quantity:
                    item.quantity + 1,

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

                  // Use latest selling price
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

          // Original price before discount
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

          quantity: 1,
        },
      ];
    });
  };

  // ======================================================
  // UPDATE QUANTITY
  // ======================================================

  const increaseQuantity = (id) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

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