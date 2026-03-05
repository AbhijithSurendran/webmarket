import Navbar from "@/components/public/Navbar"
import Footer from "@/components/public/Footer"
import { getDB } from "@/lib/db"

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Pass settings if necessary, for now we will hardcode or use basic page layout
    const db = await getDB()
    const contactInfo = db.pages.contact

    const footerSettings = {
        site_name: "WebMarket",
        footer_description: "Your trusted partner for quality products and professional services.",
        address: contactInfo.address,
        phone: contactInfo.phone,
        email: contactInfo.email
    }

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Navbar siteName="WebMarket" />
            <main className="flex-1 lg:pt-0 pt-0">{children}</main>
            <Footer settings={footerSettings} />
        </div>
    )
}
