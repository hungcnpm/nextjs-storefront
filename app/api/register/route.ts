import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, name, email, password, gender } =
      await req.json();

    // ❗ gender không bắt buộc 
    if (!username || !name || !email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    // check email
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // check username
    const existingUsername = await db
      .collection("users")
      .findOne({ username });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      name,
      email,
      password: hashedPassword,
      role: "user",
      image: "/default_image.jpg", 
      gender: gender || null, // 🔥 KEY POINT
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    return NextResponse.json({ message: "User created" });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { username, name, email, password } = await req.json();

//     if (!username || !name || !email || !password) {
//       return NextResponse.json(
//         { error: "Missing fields" },
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db("ecommerce");

//     // check email tồn tại
//     const existingUser = await db.collection("users").findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email already exists" },
//         { status: 400 }
//       );
//     } 
//     // check username tồn tại
//     const existingUsername = await db.collection("users").findOne({ username });
//     if (existingUsername) {
//       return NextResponse.json(
//         { error: "Username already exists" },
//         { status: 400 }
//       );
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = {
//       username,
//       name,
//       email,
//       password: hashedPassword,
//       role: "user", // ✅ mặc định
//       image: "/default_image.jpg", // ✅ mặc định
//       createdAt: new Date(),
//     };

//     await db.collection("users").insertOne(newUser);

//     return NextResponse.json({ message: "User created" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }