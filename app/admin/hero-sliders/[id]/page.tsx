import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import HeroSlideForm from "../HeroSlideForm"
import { getDB } from "@/lib/db"

export default async function EditHeroSliderPage({ params }: { params: { id: string } }) {
    const db = await getDB();
    const slider = db.heroSliders?.find(s => s.id === params.id) || null;

    if (!slider) {
        return (
            <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl mx-auto mt-12">
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">Slide Not Found</h2>
                <p className="text-gray-500 mb-6">The slide you are trying to edit does not exist.</p>
                <Link href="/admin/hero-sliders" className="btn-primary inline-block">
                    Back to Sliders
                </Link>
            </div>
        )
    }

    return <HeroSlideForm slide={slider} />
}
