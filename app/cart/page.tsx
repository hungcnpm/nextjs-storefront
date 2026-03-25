"use client";

import styled from "styled-components";
import Center from "@/components/Center";
import Header from "@/components/header";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/cartContext";
import Table from "@/components/Table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 80px;
  height: 80px;
  padding: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  border-radius: 10px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 10px;
`;

export default function CartPage() {
  const { cartItems, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }

    async function fetchProducts() {
      if (!cartItems.length) {
        setProducts([]);
        return;
      }

      if (success) {
        clearCart();
      }

      const ids = cartItems.map((i) => i.productId);

      const res = await fetch("/api/cart-products", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      setProducts(data);
    }

    fetchProducts();
  }, [cartItems, success]);

  const getQuantity = (id) => {
    return cartItems.find((i) => i.productId === id)?.quantity || 0;
  };

  const moreOfThisProduct = (id) => addProduct(id);
  const lessOfThisProduct = (id) => removeProduct(id);

  // ✅ remove toàn bộ sản phẩm
  const removeAllOfThisProduct = (id) => {
    const quantity = getQuantity(id);
    for (let i = 0; i < quantity; i++) {
      removeProduct(id);
    }
  };

  const productMap = {};
  products.forEach((p) => {
    productMap[p._id] = p;
  });

  let total = 0;
  cartItems.forEach((item) => {
    const product = productMap[item.productId];
    total += (product?.price || 0) * item.quantity;
  });

  if (success) {
    return (
      <>
        <Header />
        <Center>
          <Box>
            <h1>Thanks for your order!</h1>
          </Box>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>

          <Box>
            <h2>Cart</h2>

            {!cartItems.length && <div>Your cart is empty</div>}

            {products.length > 0 && (
              <>
                <Table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total Price</th> {/* ✅ new */}
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => {
                      const quantity = getQuantity(product._id);
                      const totalPrice = quantity * product.price;

                      return (
                        <tr key={product._id}>
                          <ProductInfoCell>
                            <ProductImageBox>
                              <img src={product.images[0]} />
                            </ProductImageBox>
                            {product.title}
                          </ProductInfoCell>

                          {/* Price */}
                          <td>${product.price}</td>

                          {/* Quantity */}
                          <td>
                            <Button outline onClick={() => lessOfThisProduct(product._id)}>
                              -
                            </Button>

                            <QuantityLabel>
                              {quantity}
                            </QuantityLabel>

                            <Button primary onClick={() => moreOfThisProduct(product._id)}>
                              +
                            </Button>
                          </td>

                          {/* ✅ Total price per product */}
                          <td>${totalPrice}</td>

                          {/* Action */}
                          <td>
                            <Button
                              onClick={() => removeAllOfThisProduct(product._id)}
                              style={{ backgroundColor: "red", color: "white" }}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td></td>
                      <td></td>
                      <td><b>Total:</b></td>
                      <td><b>${total}</b></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>

                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <Link href="/checkout">
                    <Button primary>
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Box>

        </ColumnsWrapper>
      </Center>
    </>
  );
}