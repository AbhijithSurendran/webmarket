import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
    cookies().delete("admin_session")
    return redirect("/admin/login")
}
