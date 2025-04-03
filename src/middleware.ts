import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Especificar qué rutas deben ser protegidas
const isProtectedRoute = createRouteMatcher("/")

export default clerkMiddleware(
  async (auth, req) => {
    // Verificar si la solicitud coincide con la ruta protegida (Ruta raíz "/")
    if (isProtectedRoute(req)) {
      await auth.protect() // Verificar si el usuario esté autenticado, caso contrario se le redirige al login
    }
  },
  {
    signInUrl: "/sign-in", // Redirige si el usuario no está registrado
    signUpUrl: "/sign-up", // Redirige si el usuario necesita registrarse
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}