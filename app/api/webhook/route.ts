import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text(); // 🔥 phải là text
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      endpointSecret
    );
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // 👉 xử lý event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;

    if (orderId) {
      const client = await clientPromise;
      const db = client.db("ecommerce");

      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: "paid",
            paidAt: new Date(),
            paid: true,
          },
        }
      );

      console.log("✅ Order paid:", orderId);
    }
  }

  return NextResponse.json({ received: true });
}