import { getToken } from "next-auth/jwt";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const addresses = await db
    .collection("addresses")
    .find({ userId: new ObjectId(token.id) })
    .sort({ isDefault: -1, createdAt: -1 })
    .toArray();

  return NextResponse.json(addresses);
}

// ➕ Thêm địa chỉ
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

  const token = await getToken({ req });
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();

  if (body.isDefault) {
    await db.collection("addresses").   updateMany(
      { userId: new ObjectId(token.id) },
      { $set: { isDefault: false } }
    );
  }

  await db.collection("addresses").insertOne({
    ...body,
    userEmail: session.user.email,
    userId: new ObjectId(token.id),
    isDefault: body.isDefault || false,
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "Created" });
}

// ⭐ Set default
export async function PUT(req: Request) {
  const token = await getToken({ req });
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  await db.collection("addresses").updateMany(
    { userId: new ObjectId(token.id) },
    { $set: { isDefault: false } }
  );

  await db.collection("addresses").updateOne(
    { _id: new ObjectId(id) },
    { $set: { isDefault: true } }
  );

  return NextResponse.json({ message: "Updated" });
}

// ❌ Xoá
export async function DELETE(req: Request) {
  const token = await getToken({ req });
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  await db.collection("addresses").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({ message: "Deleted" });
}