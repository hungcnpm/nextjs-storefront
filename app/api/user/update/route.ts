import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, gender, image } = body;

    const client = await clientPromise;
    const db = client.db("ecommerce");

    // 🔍 tìm user
    const user = await db.collection("users").findOne({
      _id: new ObjectId(token.id),
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 🧠 chỉ cho set gender 1 lần
    const updateData: any = {
      name,
      image, // tạm thời null
    };

    if (!user.gender && gender) {
      // validate gender
      if (!["male", "female", "other"].includes(gender)) {
        return NextResponse.json(
          { message: "Invalid gender" },
          { status: 400 }
        );
      }

      updateData.gender = gender;
    }

    // 🚀 update
    await db.collection("users").updateOne(
      { _id: new ObjectId(token.id) },
      { $set: updateData }
    );

    return NextResponse.json({
      message: "Update success",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}