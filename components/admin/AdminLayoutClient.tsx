"use client"

import { usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === "/admin/login"

    if (isLoginPage) {
        return <main className="min-h-screen bg-gray-50">{children}</main>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            {/* Content area offset for sidebar */}
            <div className="lg:pl-64">
                <main className="pt-14 lg:pt-0 min-h-screen">{children}</main>
            </div>
        </div>
    )
}
