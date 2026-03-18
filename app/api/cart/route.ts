import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerce");

    const { ids } = await req.json();
    const objectIds = ids.map((id: string) => new ObjectId(id));
    const products = await db
      .collection("products")
      .find({ _id: { $in: objectIds } })
      .toArray();

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}