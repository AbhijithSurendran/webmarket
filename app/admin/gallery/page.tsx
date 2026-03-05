import Link from "next/link"
import Image from "next/image"
import { getDB } from "@/lib/db"
import { deleteGalleryImage } from "@/app/actions/gallery"
import { Plus, Trash2 } from "lucide-react"

export default async function GalleryAdminPage() {
    const db = await getDB();
    const items = db.gallery || [];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Gallery</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your {items.length} gallery image{items.length !== 1 ? "s" : ""}</p>
                </div>
                <Link href="/admin/gallery/new" className="btn-primary text-sm py-2.5 px-5 shadow-md hover:shadow-lg transition-all">
                    <Plus size={16} /> Add Image
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="admin-card p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">No gallery images yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">Upload images to showcase your work, products, or team.</p>
                    <Link href="/admin/gallery/new" className="btn-primary text-sm">
                        <Plus size={16} /> Upload First Image
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="admin-card overflow-hidden group hover:border-primary-100 transition-colors">
                            <div className="relative aspect-square bg-gray-100 border-b border-gray-100">
                                <Image src={item.url} alt={item.caption || "Gallery image"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" />
                            </div>
                            <div className="p-3">
                                {item.caption ? (
                                    <p className="text-sm font-medium text-gray-900 truncate mb-1" title={item.caption}>{item.caption}</p>
                                ) : (
                                    <p className="text-sm italic text-gray-400 mb-1">No caption</p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <form action={async () => { "use server"; await deleteGalleryImage(item.id) }}>
                                        <button type="submit" className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors" title="Delete image">
                                            <Trash2 size={14} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
