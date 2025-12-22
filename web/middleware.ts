import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const adminRoutes = ['/admin'];
const protectedRoutes = ['/profile', '/documents'];

export function middleware(request: NextRequest) {
  // NOTE: Authentication is handled in layout.tsx files using useAuth()
  // Middleware is disabled because Firebase Auth uses client-side session management
  // Protection is in place via:
  // - /app/profile/layout.tsx - checks user, redirects to /login if not authenticated
  // - /app/admin/layout.tsx - checks user, redirects to /login if not authenticated

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/documents/:path*'],
};
