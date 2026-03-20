"use client";

import Link from "next/link";
import { useContext, useEffect } from "react";
import  Button  from "@/components/Button";
import Center from "@/components/Center";
import { CartContext } from "@/components/cartContext";
export default function SuccessPage() {
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart(); // clear giỏ hàng sau khi thanh toán thành công
  }, []);

  return (
    <Center>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        
        {/* Icon */}
        <div className="text-green-500 text-6xl mb-4">✔</div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-gray-500 max-w-md mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/products">
            <Button outline>Continue Shopping</Button>
          </Link>

          <Link href="/">
            <Button primary>Go Home</Button>
          </Link>
        </div>
      </div>
    </Center>
  );
}