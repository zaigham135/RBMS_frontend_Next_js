import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/auth/callback", "/forgot-password"];

// Role-to-path mapping
const rolePathMap: Record<string, string[]> = {
  ADMIN: ["/admin"],
  MANAGER: ["/manager"],
  EMPLOYEE: ["/employee"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow root
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Check for token in cookies (we'll store in cookie for middleware access)
  const token = request.cookies.get("tm_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  for (const [role, paths] of Object.entries(rolePathMap)) {
    if (paths.some((p) => pathname.startsWith(p))) {
      const cookieRole = request.cookies.get("tm_role")?.value;
      if (cookieRole !== role) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
