const { setGlobalOptions } = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

const db = getFirestore();

setGlobalOptions({
  maxInstances: 10,
});

// ======================================================
// CREATE ORDER + DEDUCT STOCK
// ======================================================

exports.createOrder = onCall(
  async (request) => {
    const data = request.data;

    // ==================================================
    // VALIDATE REQUEST
    // ==================================================

    if (!data || typeof data !== "object") {
      throw new HttpsError(
        "invalid-argument",
        "Invalid order data."
      );
    }

    const customer = data.customer;
    const items = data.items;

    if (!customer || !items) {
      throw new HttpsError(
        "invalid-argument",
        "Customer and order items are required."
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "The order must contain at least one item."
      );
    }

    // ==================================================
    // CUSTOMER VALIDATION
    // ==================================================

    const customerName =
      String(customer.name || "").trim();

    const customerPhone =
      String(customer.phone || "").trim();

    const customerAddress =
      String(customer.address || "").trim();

    if (!customerName) {
      throw new HttpsError(
        "invalid-argument",
        "Customer name is required."
      );
    }

    if (!customerPhone) {
      throw new HttpsError(
        "invalid-argument",
        "Customer phone number is required."
      );
    }

    if (!customerAddress) {
      throw new HttpsError(
        "invalid-argument",
        "Customer address is required."
      );
    }

    // ==================================================
    // PREVENT DUPLICATE PRODUCT IDS
    // ==================================================

    const productIds = items.map(
      (item) => String(item.productId || "")
    );

    if (
      productIds.some(
        (productId) => !productId
      )
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Every order item must have a product ID."
      );
    }

    if (
      new Set(productIds).size !==
      productIds.length
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Duplicate products are not allowed in one order."
      );
    }

    // ==================================================
    // NORMALIZE ITEMS
    // ==================================================

    const normalizedItems = items.map(
      (item) => {
        const quantity = Number(
          item.quantity || 0
        );

        const price = Number(
          item.price || 0
        );

        const originalPrice = Number(
          item.originalPrice ??
            price
        );

        const discountPercent =
          Number(
            item.discountPercent || 0
          );

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Product quantity must be a positive whole number."
          );
        }

        if (
          !Number.isFinite(price) ||
          price < 0
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Invalid product price."
          );
        }

        return {
          productId: String(
            item.productId
          ),

          name: String(
            item.name || ""
          ),

          category:
            String(
              item.category ||
                "Furniture"
            ),

          material:
            String(
              item.material || ""
            ),

          image:
            String(
              item.image || ""
            ),

          price,

          originalPrice,

          discountPercent,

          quantity,

          itemTotal:
            price * quantity,
        };
      }
    );

    // ==================================================
    // TRANSACTION
    // ==================================================

    try {
      const result =
        await db.runTransaction(
          async (transaction) => {
            const productRefs =
              normalizedItems.map(
                (item) =>
                  db.collection(
                    "products"
                  ).doc(
                    item.productId
                  )
              );

            // ==================================================
            // READ ALL PRODUCTS FIRST
            // Firestore transactions require reads
            // before writes.
            // ==================================================

            const productSnapshots =
              [];

            for (
              const productRef of productRefs
            ) {
              const snapshot =
                await transaction.get(
                  productRef
                );

              productSnapshots.push(
                snapshot
              );
            }

            // ==================================================
            // CHECK STOCK
            // ==================================================

            const finalItems =
              normalizedItems.map(
                (item, index) => {
                  const snapshot =
                    productSnapshots[
                      index
                    ];

                  if (
                    !snapshot.exists
                  ) {
                    throw new HttpsError(
                      "not-found",
                      `${item.name} is no longer available.`
                    );
                  }

                  const productData =
                    snapshot.data();

                  const currentStock =
                    Math.max(
                      0,
                      Number(
                        productData.stockQuantity ??
                          0
                      )
                    );

                  if (
                    item.quantity >
                    currentStock
                  ) {
                    throw new HttpsError(
                      "failed-precondition",
                      `Only ${currentStock} ${
                        currentStock === 1
                          ? "item"
                          : "items"
                      } of ${
                        productData.name ||
                        item.name
                      } are currently available.`
                    );
                  }

                  return {
                    ...item,

                    // IMPORTANT:
                    // Use the latest database
                    // product information.
                    name:
                      productData.name ||
                      item.name,

                    category:
                      productData.category ||
                      item.category,

                    material:
                      productData.material ||
                      item.material,

                    image:
                      productData.image ||
                      item.image,

                    stockBefore:
                      currentStock,

                    stockAfter:
                      currentStock -
                      item.quantity,
                  };
                }
              );

            // ==================================================
            // CALCULATE TOTAL
            // ==================================================

            const total =
              finalItems.reduce(
                (sum, item) =>
                  sum +
                  item.price *
                    item.quantity,
                0
              );

            // ==================================================
            // DEDUCT STOCK
            // ==================================================

            finalItems.forEach(
              (item, index) => {
                const productRef =
                  productRefs[
                    index
                  ];

                transaction.update(
                  productRef,
                  {
                    stockQuantity:
                      item.stockAfter,

                    updatedAt:
                      FieldValue.serverTimestamp(),
                  }
                );
              }
            );

            // ==================================================
            // CREATE ORDER
            // ==================================================

            const orderRef =
              db.collection(
                "orders"
              ).doc();

            const orderData = {
              customer: {
                name:
                  customerName,

                phone:
                  customerPhone,

                address:
                  customerAddress,
              },

              items: finalItems,

              total,

              status: "new",

              source: "website",

              createdAt:
                FieldValue.serverTimestamp(),
            };

            transaction.create(
              orderRef,
              orderData
            );

            return {
              orderId:
                orderRef.id,

              total,

              items:
                finalItems,
            };
          }
        );

      return {
        success: true,

        orderId:
          result.orderId,

        total:
          result.total,

        items:
          result.items,
      };
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      if (
        error instanceof
        HttpsError
      ) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        "Unable to create the order. Please try again."
      );
    }
  }
);