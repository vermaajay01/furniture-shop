import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

const CART_KEY = "hari_om_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_KEY);

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch {
      return [];
    }
  });

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
      const existing = previous.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          image: product.image || "",
          category:
            product.category || "Furniture",
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
          (item) => item.quantity > 0
        )
    );
  };

  // ======================================================
  // REMOVE
  // ======================================================

  const removeFromCart = (id) => {
    setCartItems((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  // ======================================================
  // CLEAR
  // ======================================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ======================================================
  // TOTALS
  // ======================================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        item.quantity,
    0
  );

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

export function useCart() {
  return useContext(CartContext);
}