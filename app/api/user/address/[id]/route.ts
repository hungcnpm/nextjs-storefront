import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    name,
    phone,
    detail, // ✅ dùng luôn
    ward,
    district,
    city,
    isDefault,
  } = body;

  const client = await clientPromise;
  const db = client.db("ecommerce");

  try {
    // reset default
    if (isDefault) {
      await db.collection("addresses").updateMany(
        { userEmail: session.user.email },
        { $set: { isDefault: false } }
      );
    }

    const result = await db.collection("addresses").updateOne(
      {
        _id: new ObjectId(id),
        userEmail: session.user.email,
      },
      {
        $set: {
          name,
          phone,
          detail, // ✅ không build lại
          city,
          district,
          ward,
          isDefault: !!isDefault,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}