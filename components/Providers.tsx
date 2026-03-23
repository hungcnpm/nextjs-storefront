"use client";

import { SessionProvider } from "next-auth/react";
import { CartContextProvider } from "@/components/cartContext";
import { Toaster } from "react-hot-toast";
export default function Providers({ children }: any) {
  return (
    <SessionProvider>
      <CartContextProvider>
        {children}
        <Toaster position="top-right" />
      </CartContextProvider>
    </SessionProvider>
  );
}