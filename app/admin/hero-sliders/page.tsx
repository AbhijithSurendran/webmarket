import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { getDB } from "@/lib/db"
import { deleteHeroSlide } from "@/app/actions/cms"

export default async function HeroSlidersPage() {
    const db = await getDB();
    const slides: import("@/lib/types").HeroSlider[] = db.heroSliders || [];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Hero Sliders</h1>
                    <p className="text-gray-500 text-sm mt-1">{slides.length} slide{slides.length !== 1 ? "s" : ""}</p>
                </div>
                <Link href="/admin/hero-sliders/new" className="btn-primary text-sm py-2"><Plus size={16} /> New Slide</Link>
            </div>

            {slides.length === 0 ? (
                <div className="admin-card p-12 text-center">
                    <p className="text-gray-400 mb-4">No slides yet. Add your first hero slide.</p>
                    <Link href="/admin/hero-sliders/new" className="btn-primary text-sm"><Plus size={16} /> Add Slide</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {slides.map((slide) => (
                        <div key={slide.id} className="admin-card p-4 flex items-center gap-4">
                            <div className="h-16 w-24 relative bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                {slide.imageUrl ? (
                                    <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full text-xs text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="font-medium text-gray-900 truncate">{slide.title}</h3>
                                    {slide.isActive ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">Active</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">Inactive</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 truncate">{slide.description || "No description"}</p>
                                <p className="text-xs text-gray-300">Order: {slide.sortOrder}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <Link href={`/admin/hero-sliders/${slide.id}`} className="btn-ghost text-xs py-1.5 px-3"><Pencil size={13} /> Edit</Link>
                                <form action={deleteHeroSlide.bind(null, slide.id)}>
                                    <button type="submit" className="btn-danger text-xs py-1.5 px-3">
                                        <Trash2 size={13} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
