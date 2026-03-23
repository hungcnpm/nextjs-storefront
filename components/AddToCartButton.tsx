"use client";
import { useContext } from "react";
import { CartContext } from "@/components/cartContext";
import Button from "./Button";

export default function AddToCartButton({ product }: any) {
  const { addProduct } = useContext(CartContext);

  return (
    <Button primary onClick={() => 
      addProduct(product._id)
    }>
      Add to cart
    </Button>
  );
}