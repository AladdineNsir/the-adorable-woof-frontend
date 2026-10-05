import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { resolveAssetUrl } from "../config/api";
import { isToyItem } from "../utils/productType";
import { useAuth } from "./AuthContext";
import { trackAddToCart } from "../analytics/analytics";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({
    message: "",
    visible: false,
  });

  // ============================================
  // Générer une clé unique pour chaque utilisateur
  // ============================================
  const getCartKey = () => {
    if (!user) {
      return "velora_cart_guest";
    }

    const userId =
      user.id ||
      user._id ||
      user.userId ||
      user.email;

    return `velora_cart_user_${userId}`;
  };

  // ============================================
  // Charger le panier du user actuel
  // ============================================
  useEffect(() => {
    if (authLoading) return;

    const cartKey = getCartKey();

    try {
      const parseCart = (key) => {
        const value = localStorage.getItem(key);
        if (!value) return [];
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      };

      const savedCart = parseCart(cartKey);

      if (user) {
        const guestCart = parseCart("velora_cart_guest");
        const mergedCart = [...savedCart];

        guestCart.forEach((guestItem) => {
          const existingIndex = mergedCart.findIndex(
            (item) => item.cartItemId === guestItem.cartItemId
          );

          if (existingIndex === -1) {
            mergedCart.push(guestItem);
          } else {
            mergedCart[existingIndex] = {
              ...mergedCart[existingIndex],
              quantity:
                mergedCart[existingIndex].quantity + guestItem.quantity,
            };
          }
        });

        localStorage.setItem(cartKey, JSON.stringify(mergedCart));
        localStorage.removeItem("velora_cart_guest");
        setCart(mergedCart);
        return;
      }

      if (savedCart) {
        setCart(savedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Erreur chargement panier:", error);
      setCart([]);
    }
  }, [user, authLoading]);

  // ============================================
  // Sauvegarder le panier du user actuel
  // ============================================
  useEffect(() => {
    if (authLoading) return;

    const cartKey = getCartKey();

    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Erreur sauvegarde panier:", error);
    }
  }, [cart, user, authLoading]);

  // ============================================
  // Toast
  // ============================================
  useEffect(() => {
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      setToast({
        message: "",
        visible: false,
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast.visible]);

  const triggerToast = (message) => {
    setToast({
      message,
      visible: true,
    });
  };

  const addToCart = (
    product,
    quantity,
    size,
    color,
    customization = {
      petName: "",
      phoneNumber: "",
    }
  ) => {
    const productId = product.id || product._id || "";

    setCart((prevCart) => {
      const cartItemId = `${productId}-${size}-${color?.name || ""}-${customization.petName}-${customization.phoneNumber}`;
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      let extraCost = 0;
      if (customization.petName) extraCost += 5;
      if (customization.phoneNumber) extraCost += 5;

      const basePrice = Number(product.price || 0) + extraCost;

      if (existingItemIndex > -1) {
        return prevCart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...prevCart,
        {
          cartItemId,
          product: productId,
          name: product.name,
          image: product.image || resolveAssetUrl(product.images?.[0]),
          price: basePrice,
          selectedSize: size,
          selectedColor: color?.name,
          colorCode: color?.code,
          isToy: isToyItem(product),
          subCategory: product.subCategory,
          customization,
          quantity,
          type: "product",
        },
      ];
    });

    triggerToast(`${product.name} ajouté au panier`);
    trackAddToCart(product, quantity);
  };

  const addPackToCart = (pack, size, quantity = 1) => {
    const key = `${pack._id || pack.id}-${size}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === key && item.type === "pack");

      if (existingItemIndex > -1) {
        return prevCart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...prevCart,
        {
          cartItemId: key,
          name: pack.name,
          image: pack.image || resolveAssetUrl(pack.image),
          price: Number(pack.pricePreview?.final || pack.price || 0),
          selectedSize: size,
          selectedColor: "Standard",
          quantity,
          type: "pack",
          packId: pack._id || pack.id,
          packSlug: pack.slug,
          components: pack.components || [],
          product: null,
          customization: { petName: "", phoneNumber: "" },
        },
      ];
    });

    triggerToast(`${pack.name} ajouté au panier`);
  };

  // ============================================
  // Supprimer
  // ============================================
  const removeFromCart = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          item.cartItemId !== cartItemId
      )
    );
  };

  // ============================================
  // Modifier quantité
  // ============================================
  const updateQuantity = (
    cartItemId,
    newQty
  ) => {
    if (newQty < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: newQty,
            }
          : item
      )
    );
  };

  // ============================================
  // Vider panier
  // ============================================
  const clearCart = () => {
    setCart([]);
  };

  // ============================================
  // Nombre produits
  // ============================================
  const getItemsCount = () => {
    return cart.reduce(
      (acc, item) =>
        acc + item.quantity,
      0
    );
  };

  // ============================================
  // Total
  // ============================================
  const getCartTotal = () => {
    return cart.reduce(
      (acc, item) =>
        acc +
        (item.type === "pack" ? Math.floor(Number(item.price || 0)) : Number(item.price || 0)) * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addPackToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemsCount,
        getCartTotal,
        toast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);