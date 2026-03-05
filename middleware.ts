import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
    const isLoginRoute = request.nextUrl.pathname === "/admin/login"

    // Simple cookie-based authentication for the custom CMS
    const authToken = request.cookies.get("admin_session")?.value

    if (isAdminRoute && !isLoginRoute && !authToken) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin/login"
        if (request.nextUrl.pathname !== "/admin") {
            url.searchParams.set("redirectTo", request.nextUrl.pathname)
        }
        return NextResponse.redirect(url)
    }

    if (isLoginRoute && authToken) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
