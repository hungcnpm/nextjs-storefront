"use client";

import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/cartContext";
import Button from "@/components/Button";
import Header from "@/components/header";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AddressListModal from "@/components/AddressListModal";

// #region styles
const Wrapper = styled.div`
  max-width: 900px;
  margin: 40px auto;
`;

const Box = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ee4d2d;
  font-weight: 600;
  margin-bottom: 10px;
`;

const AddressRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddressInfo = styled.div`
  font-size: 14px;
`;

const DefaultTag = styled.span`
  border: 1px solid #ee4d2d;
  color: #ee4d2d;
  font-size: 12px;
  padding: 2px 6px;
  margin-left: 8px;
`;

const ChangeBtn = styled.span`
  color: #1677ff;
  cursor: pointer;
  font-size: 14px;
`;

const ProductHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  font-size: 13px;
  color: #888;
  margin: 10px 0;
`;

const ProductItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #eee;
`;

const ProductLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 1px solid #eee;
`;

const Total = styled.div`
  text-align: right;
  font-weight: bold;
  margin-top: 10px;
`;

const PaymentOption = styled.label`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;
// #endregion style

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const router = useRouter();
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

  useEffect(() => {
    async function fetchAddress() {
      const res = await fetch("/api/user/address");
      const data = await res.json();
      setAddress(data?.[0]);
    }

    fetchAddress();
  }, []);

  function getQuantity(id) {
    return cartItems.find((i) => i.productId === id)?.quantity || 0;
  }

  let total = 0;
  products.forEach((p) => {
    total += p.price * getQuantity(p._id);
  });

  async function handleOrder() {
    if (!cartItems.length) return;

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        address,
        cartItems,
        paymentMethod,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Checkout failed");
      return;
    }

    if (paymentMethod === "stripe") {
      if (data.url) {
        window.location.href = data.url;
      }
    }

    if (paymentMethod === "cod") {
      clearCart();
      router.push("/user/orders");
      toast.success("Order placed (COD)");
    }
  }

  return (
    <>
      <Header />
      <Wrapper>

        <Box>
          <AddressHeader>📍 Delivery Address</AddressHeader>

          {address && (
            <AddressRow>
              <AddressInfo>
                <b>{address.name} {address.phone}</b> 
                {address.detail}, {address.ward}, {address.district}, {address.city}
                {address.isDefault && <DefaultTag>Default</DefaultTag>}
              </AddressInfo>

              <ChangeBtn onClick= {() => setShowAddressModal(true)}>Change</ChangeBtn>
            </AddressRow>
          )}
           {showAddressModal && (
            <AddressListModal
                onClose={() => setShowAddressModal(false)}
                onSelect={(addr: any) => setAddress(addr)}
            />
            )}
        </Box>

        <Box>
          <h3>Products Ordered</h3>

          <ProductHeader>   
            <div>Product</div>
            <div>Unit Price</div>
            <div>Amount</div>
            <div>Item Subtotal</div>
          </ProductHeader>

          {products.map((p) => {
            const quantity = getQuantity(p._id);
            const subtotal = quantity * p.price;

            return (
              <ProductItem key={p._id}>
                <ProductLeft>
                  <ProductImage src={p.images[0]} />
                  <div>{p.title}</div>
                </ProductLeft>

                <div>${p.price}</div>
                <div>{quantity}</div>
                <div>${subtotal}</div>
              </ProductItem>
            );
          })}

          <Total>Total: ${total}</Total>
        </Box>

        <Box>
          <h3>Payment Method</h3>

          <PaymentOption>
            <input
              type="radio"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </PaymentOption>

          <PaymentOption>
            <input
              type="radio"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            Stripe
          </PaymentOption>

          <Button primary block style={{ marginTop: "20px" }} onClick={handleOrder}>
            Place Order
          </Button>
        </Box>
       
      </Wrapper>
    </>
  );
}