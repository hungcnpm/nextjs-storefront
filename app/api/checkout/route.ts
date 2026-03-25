import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { cartItems, paymentMethod, address } = body;

    if (!cartItems || !cartItems.length) {
      return NextResponse.json(
        { error: "Missing cart items" },
        { status: 400 }
      );
    }

    // ✅ validate payment
    if (!["cod", "stripe"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    // ✅ address từ DB
    let finalAddress = address;

    if (!finalAddress) {
      finalAddress = await db.collection("addresses").findOne({
        userEmail,
        isDefault: true,
      });
    }
    
    if (!finalAddress) {
      return NextResponse.json(
        { error: "No address found" },
        { status: 400 }
      );
    }

    const objectIds = cartItems.map(
      (item: any) => new ObjectId(item.productId)
    );

    const productsInfo = await db
      .collection("products")
      .find({ _id: { $in: objectIds } })
      .toArray();

    const items: any[] = [];
    const line_items: any[] = [];
    let total = 0;

    for (const cartItem of cartItems) {
      const product = productsInfo.find(
        p => p._id.toString() === cartItem.productId
      );

      if (!product) continue;

      const quantity = cartItem.quantity;
      const subtotal = product.price * quantity;

      total += subtotal;

      items.push({
        productId: cartItem.productId,
        title: product.title,
        price: product.price,
        quantity,
        subtotal,
      });

      line_items.push({
        quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
          },
          unit_amount: product.price * 100,
        },
      });
    }

    const result = await db.collection("orders").insertOne({
      userEmail,

      address: {
        name: finalAddress.name,
        phone: finalAddress.phone,
        detail: finalAddress.detail,
        ward: finalAddress.ward,
        district: finalAddress.district,
        city: finalAddress.city,
      },

      items,
      total,
      paymentMethod,
      paid: false, // ✅ FIX
      status: "pending",
      createdAt: new Date(),
    });

    const orderId = result.insertedId.toString();

    // ✅ COD
    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        orderId,
      });
    }

    // ✅ STRIPE
    const stripeSession = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      customer_email: session.user.email,
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
      metadata: {
        orderId,
      },
    });

    return NextResponse.json({
      url: stripeSession.url,
    });

  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}