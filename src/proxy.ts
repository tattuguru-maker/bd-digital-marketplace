import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/orders(.*)",
  "/wishlist(.*)",
  "/notifications(.*)",
  "/admin(.*)",
  "/sell/apply(.*)",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (!isProtectedRoute(request)) return;

  if (!(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(
      request,
      `/login?next=${encodeURIComponent(request.nextUrl.pathname)}`,
    );
  }
});

export const config = {
  // Don't run on static assets / image optimisation / file requests.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
