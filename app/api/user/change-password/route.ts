import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
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

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

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

    // 🔐 check password cũ
    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        { message: "Mật khẩu cũ không đúng" },
        { status: 400 }
      );
    }

    // 🔒 hash password mới
    const hashed = await bcrypt.hash(newPassword, 10);

    // 🚀 update password
    await db.collection("users").updateOne(
      { _id: new ObjectId(token.id) },
      {
        $set: {
          password: hashed,
        },
      }
    );

    return NextResponse.json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Change password failed" },
      { status: 500 }
    );
  }
}