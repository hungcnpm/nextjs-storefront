import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // ✅ dùng chuẩn

export async function POST(req: Request) {
  const { ids } = await req.json();

  if (!ids || !ids.length) {
    return Response.json([]);
  }

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const objectIds = ids.map((id: string) => new ObjectId(id)); // ✅ FIX

  const products = await db
    .collection("products")
    .find({
      _id: { $in: objectIds },
    })
    .toArray();

  return Response.json(products);
}