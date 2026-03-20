"use client";
import { useContext } from "react";
import { CartContext } from "@/components/cartContext";
import Button from "./Button";

export default function AddToCartButton({ product }: any) {
  const { addProducts } = useContext(CartContext);

  return (
    <Button primary onClick={() => addProducts(product._id)}>
      Add to cart
    </Button>
  );
}