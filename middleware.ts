import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/completeProfile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  if (pathname === "/join-waitlist") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const { userId } = await auth(); 
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
