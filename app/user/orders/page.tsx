"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import Headers from "@/components/header";

const Wrapper = styled.div`
  max-width: 800px;
  margin: 40px auto;
`;

const OrderCard = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;

  if (!session) return <div>Please login</div>;

  return (
    <>
    <Wrapper>
      <h1>Your Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
        <OrderCard key={order._id}>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total:</b> ${order.total}</p>

          <div>
            {order.items.map((item: any, i: number) => (
              <Item key={i}>
                <span>{item.title} x {item.quantity}</span>
                <span>${item.subtotal}</span>
              </Item>
            ))}
          </div>
        </OrderCard>
      ))}
    </Wrapper>
    </>
  );
}