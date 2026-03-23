"use client";

import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./cartContext";
import Link from "next/link";

const Wrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

export default function MiniCart() {
  const { cartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      if (!cartItems.length) return;

      const ids = cartItems.map((i) => i.productId);

      const res = await fetch("/api/cart-products", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      setProducts(data);
    }

    fetchProducts();
  }, [cartItems]);

  const getQty = (id) =>
    cartItems.find((i) => i.productId === id)?.quantity || 0;

  const total = cartItems.reduce((sum, item) => {
    const product = products.find(p => p._id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <Wrapper>
      {!products.length && <div>Cart empty</div>}

      {products.map((p) => (
        <Link
          href={`/products/${p._id}`}
          key={p._id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <img src={p.images[0]} width={50} />
            <div>
              <div>{p.title}</div>
              <div>x{getQty(p._id)}</div>
            </div>
          </div>
        </Link>
      ))}

      <hr />
      <div style={{ textAlign: "right" }}>
        <b>Total: ${total}</b>
      </div>
    </Wrapper>
  );
}
