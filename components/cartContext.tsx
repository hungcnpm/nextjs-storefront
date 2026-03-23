"use client";

import { createContext, useEffect, useState, ReactNode } from "react";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  fetchCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addProduct: () => {},
  removeProduct: () => {},
  clearCart: () => {},
  fetchCart: () => {},
});

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ fetch cart từ server
  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCartItems(data.items || []);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ add product
  async function addProduct(productId: string) {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    fetchCart();
  }

  // ✅ remove 1 quantity
  async function removeProduct(productId: string) {
    await fetch("/api/cart", {
      method: "PUT",
      body: JSON.stringify({ productId }),
    });
    fetchCart();
  }

  // ✅ clear cart
  async function clearCart() {
    await fetch("/api/cart", {
      method: "DELETE",
    });
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addProduct, removeProduct, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
