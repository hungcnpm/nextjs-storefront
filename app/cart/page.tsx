"use client";

import styled from "styled-components";
import Center from "@/components/Center";
import Header from "@/components/header";
import Button from "@/components/Button";
import { use, useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/cartContext";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
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

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartItems, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const router=useRouter();
  const { data: session } = useSession();
  // 🔥 fetch product info theo cartItems
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

  // 👉 lấy quantity
  const getQuantity = (id) => {
    return cartItems.find((i) => i.productId === id)?.quantity || 0;
  };

  const moreOfThisProduct = (id) => addProduct(id);
  const lessOfThisProduct = (id) => removeProduct(id);

  // 👉 map product
  const productMap = {};
  products.forEach((p) => {
    productMap[p._id] = p;
  });

  // 👉 total
  let total = 0;
  cartItems.forEach((item) => {
    const product = productMap[item.productId];
    total += (product?.price || 0) * item.quantity;
  });

  async function checkout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        products: cartItems, // 🔥 gửi đúng format mới
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

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

          {/* CART */}
          <Box>
            <h2>Cart</h2>

            {!cartItems.length && <div>Your cart is empty</div>}

            {products.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>

                      <td>
                        <Button outline onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </Button>

                        <QuantityLabel>
                          {getQuantity(product._id)}
                        </QuantityLabel>

                        <Button primary onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </Button>
                      </td>

                      <td>
                        ${getQuantity(product._id) * product.price}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td></td>
                    <td><b>Total:</b></td>
                    <td><b>${total}</b></td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>

          {/* ORDER */}
          {!!cartItems.length && (
            <Box>
              <h2>Order information</h2>

              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

              <CityHolder>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" />
              </CityHolder>

              <Input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street Address" />
              <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />

              <Button block primary onClick={checkout}>
                Continue to payment
              </Button>
            </Box>
          )}

        </ColumnsWrapper>
      </Center>
    </>
  );
}


