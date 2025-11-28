// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Rotas protegidas
  const protectedRoutes = ["/dashboard", "/profile", "/learn"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirecionar se não autenticado em rota protegida
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // REMOVIDO: Redirecionamento automático de rotas públicas quando autenticado
  // Isso estava causando loops de redirecionamento
  // As páginas individuais podem fazer essa verificação se necessário

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
