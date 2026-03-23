import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const cart = await db.collection("carts").findOne({
    userEmail: session.user.email,
  });

  return Response.json(cart || { items: [] });
}

// ➕ ADD
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const cart = await db.collection("carts").findOne({
    userEmail: session.user.email,
  });

  if (!cart) {
    await db.collection("carts").insertOne({
      userEmail: session.user.email,
      items: [{ productId, quantity: 1 }],
    });
  } else {
    const exists = cart.items.find((i) => i.productId === productId);

    if (exists) {
      await db.collection("carts").updateOne(
        { userEmail: session.user.email, "items.productId": productId },
        { $inc: { "items.$.quantity": 1 } }
      );
    } else {
      await db.collection("carts").updateOne(
        { userEmail: session.user.email },
        { $push: { items: { productId, quantity: 1 } } }
      );
    }
  }

  return Response.json({ success: true });
}

// ➖ REMOVE 1
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const cart = await db.collection("carts").findOne({
    userEmail: session.user.email,
  });

  const item = cart?.items.find((i) => i.productId === productId);

  if (!item) return Response.json({ success: true });

  if (item.quantity === 1) {
    await db.collection("carts").updateOne(
      { userEmail: session.user.email },
      { $pull: { items: { productId } } }
    );
  } else {
    await db.collection("carts").updateOne(
      { userEmail: session.user.email, "items.productId": productId },
      { $inc: { "items.$.quantity": -1 } }
    );
  }

  return Response.json({ success: true });
}

// 🗑 CLEAR
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("ecommerce");

  await db.collection("carts").deleteOne({
    userEmail: session.user.email,
  });

  return Response.json({ success: true });
}
// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// export async function POST(req: Request) {
//   try {
//     const client = await clientPromise;
//     const db = client.db("ecommerce");

//     const { ids } = await req.json();
//     const objectIds = ids.map((id: string) => new ObjectId(id));
//     const products = await db
//       .collection("products")
//       .find({ _id: { $in: objectIds } })
//       .toArray();

//     return NextResponse.json(products);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }