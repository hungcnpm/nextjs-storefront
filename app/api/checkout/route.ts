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
const userEmail = session?.user?.email || null;

try {
const body = await req.json();

const {
  name,
  email,
  city,
  postalCode,
  streetAddress,
  country,
  products, // 👉 [{ productId, quantity }]
} = body;

if (!products || !products.length) {
  return NextResponse.json(
    { error: "Missing products" },
    { status: 400 }
  );
}

const client = await clientPromise;
const db = client.db("ecommerce");

// 👉 lấy productIds
const objectIds = products.map(
  (item: any) => new ObjectId(item.productId)
);

const productsInfo = await db
  .collection("products")
  .find({ _id: { $in: objectIds } })
  .toArray();

const items: any[] = [];
const line_items: any[] = [];
let total = 0;

for (const cartItem of products) {
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
  name,
  email,
  userEmail,
  city,
  postalCode,
  streetAddress,
  country,
  items,
  total,
  status: "pending",
  paid: false,
  createdAt: new Date(),
});

const orderId = result.insertedId.toString();

const stripeSession = await stripe.checkout.sessions.create({
  line_items,
  mode: "payment",
  customer_email: email,
  success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
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

// import clientPromise from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";
// import Stripe from "stripe";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);
//   const userEmail = session?.user?.email || null;
//   try {
//     const body = await req.json();
    
//     const {
//       name,
//       email,
//       city,
//       postalCode,
//       streetAddress,
//       country,
//       products,
//     } = body;

//     if (!products) {
//       return NextResponse.json(
//         { error: "Missing products" },
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db("ecommerce");

//     // 👉 xử lý cart
//     const productIds = products.split(",");
//     const uniqueIds = [...new Set(productIds)];

//     const objectIds = uniqueIds
//       .filter(id => ObjectId.isValid(id))
//       .map(id => new ObjectId(id));

//     const productsInfo = await db
//       .collection("products")
//       .find({ _id: { $in: objectIds } })
//       .toArray();

//     // 👉 build items + stripe line_items
//     const items: any[] = [];
//     const line_items: any[] = [];

//     let total = 0;

//     for (const productId of uniqueIds) {
//       const product = productsInfo.find(
//         p => p._id.toString() === productId
//       );

//       const quantity =
//         productIds.filter(id => id === productId).length;

//       if (!product || quantity <= 0) continue;

//       const subtotal = product.price * quantity;
//       total += subtotal;

//       // 👉 lưu DB
//       items.push({
//         productId,
//         title: product.title,
//         price: product.price,
//         quantity,
//         subtotal,
//       });

//       // 👉 Stripe format
//       line_items.push({
//         quantity,
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.title,
//           },
//           unit_amount: product.price * 100, // ⚠️ cents
//         },
//       });
//     }

//     // 👉 tạo order trước
//     const result = await db.collection("orders").insertOne({
//       name,
//       email,
//       userEmail,
//       city,
//       postalCode,
//       streetAddress,
//       country,
//       items,
//       total,
//       status: "pending",
//       paid: false,
//       createdAt: new Date(),
//     });

//     const orderId = result.insertedId.toString();

//     // 👉 tạo Stripe session
//     const session = await stripe.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       customer_email: email,

//       success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
//       metadata: {
//         orderId: orderId,   
//       }
//     });

//     // 👉 trả URL để frontend redirect
//     return NextResponse.json({
//       url: session.url,
//     });

//   } catch (err: any) {
//     console.error("CHECKOUT ERROR:", err.message);
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     );
//   }
// }