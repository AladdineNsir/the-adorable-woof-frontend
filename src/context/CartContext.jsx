import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { resolveAssetUrl } from "../config/api";
import { useAuth } from "./AuthContext";

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
      const savedCart = localStorage.getItem(cartKey);

      if (savedCart) {
        setCart(JSON.parse(savedCart));
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

  // ============================================
  // Ajouter au panier
  // ============================================
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
    const productId =
      product.id ||
      product._id ||
      "";

    setCart((prevCart) => {
      // Clé unique produit + options
      const cartItemId =
        `${productId}-${size}-${color?.name || ""}-${customization.petName}-${customization.phoneNumber}`;

      const existingItemIndex =
        prevCart.findIndex(
          (item) =>
            item.cartItemId === cartItemId
        );

      // Surcoût personnalisation
      let extraCost = 0;

      if (customization.petName) {
        extraCost += 5;
      }

      if (customization.phoneNumber) {
        extraCost += 5;
      }

      const basePrice =
        product.price + extraCost;

      // Produit déjà présent
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];

        newCart[existingItemIndex].quantity +=
          quantity;

        return newCart;
      }

      // Nouveau produit
      return [
        ...prevCart,
        {
          cartItemId,

          product: productId,

          name: product.name,

          image:
            product.image ||
            resolveAssetUrl(
              product.images?.[0]
            ),

          price: basePrice,

          selectedSize: size,

          selectedColor:
            color?.name,

          colorCode:
            color?.code,

          customization,

          quantity,
        },
      ];
    });

    triggerToast(
      `${product.name} ajouté au panier`
    );
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
        item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
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