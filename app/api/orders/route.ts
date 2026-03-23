import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const orders = await db
    .collection("orders")
    .find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(orders);
}