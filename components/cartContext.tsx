"use client";

import { createContext, useEffect, useState, ReactNode } from "react";

type CartContextType = {
  cartProducts: string[];
  setCartProducts: React.Dispatch<React.SetStateAction<string[]>>;
  addProducts: (productId: string) => void;
  removeProducts: (productId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cartProducts: [],
  setCartProducts: () => {},
  addProducts: () => {},
  removeProducts: () => {},
  clearCart: () => {},

});

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState<string[]>([]);

  // 👉 lưu vào localStorage khi cart thay đổi
  useEffect(() => {
    if (cartProducts.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  // 👉 load cart từ localStorage khi mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartProducts(JSON.parse(storedCart));
    } 
  }, []);

  function addProducts(productId: string) {
    setCartProducts((prev) => [...prev, productId]);
  }
  function removeProducts(productId: string) {
    setCartProducts((prev) => {
      const index = prev.indexOf(productId);
      if (index > -1) {
        const newCart = [...prev];
        newCart.splice(index, 1);
        return newCart;
      }
    
      return prev;
    });
  }
  function clearCart() {
    setCartProducts([]);
    localStorage.removeItem("cart");
  }
  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addProducts, removeProducts, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}