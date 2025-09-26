import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res: response });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const { pathname, searchParams } = request.nextUrl;

  if (!session && pathname.startsWith("/dashboard")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    if (!searchParams.has("redirectedFrom")) {
      redirectUrl.searchParams.set("redirectedFrom", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (session && (pathname === "/login" || pathname === "/")) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"]
};
