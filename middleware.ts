import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that require admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Check if the route requires admin access
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    
    // If user is not authenticated, redirect to login
    if (!userId) {
      const signInUrl = new URL('/login', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check for admin role in session claims or public metadata
    // Clerk stores custom roles in sessionClaims.publicMetadata or sessionClaims.metadata
    const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
    const metadata = sessionClaims?.metadata as { role?: string } | undefined;
    const userRole = publicMetadata?.role || metadata?.role || (sessionClaims as { role?: string })?.role;

    // If user doesn't have admin role, redirect to home with error message
    if (userRole !== 'admin') {
      const homeUrl = new URL('/', req.url);
      homeUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(homeUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

