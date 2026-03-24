import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const { pathname } = req.nextUrl;

  // 🔒 danh sách route cần login
  const protectedPaths = ["/user", "/orders", "/checkout"];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // ❌ chưa login → đá về login
  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${pathname}`, req.url)
    );
  }

  // 🔥 đã login mà vào login → đá về home
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// 🔥 chỉ apply cho các route này
export const config = {
  matcher: [
    "/user/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/login",
  ],
};