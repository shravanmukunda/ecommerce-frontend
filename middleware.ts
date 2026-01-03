import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that require admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 🔍 TEMP DEBUG (remove after it works)
  console.log('--- ADMIN DEBUG START ---');
  console.log('URL:', req.nextUrl.pathname);
  console.log('userId:', userId);
  console.log('sessionClaims:', JSON.stringify(sessionClaims, null, 2));
  console.log('--- ADMIN DEBUG END ---');

  if (isAdminRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // IMPORTANT: support both camelCase & snake_case
    const role =
      (sessionClaims as any)?.publicMetadata?.role ||
      (sessionClaims as any)?.public_metadata?.role;

    console.log('ROLE CHECK:', role);

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
