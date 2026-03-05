import Link from "next/link"
import Image from "next/image"
import { getDB } from "@/lib/db"
import { deleteBlog } from "@/app/actions/blogs"
import { formatDate } from "@/lib/utils"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default async function BlogsAdminPage() {
    const db = await getDB();
    const items = db.blogs || [];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your {items.length} blog post{items.length !== 1 ? "s" : ""}</p>
                </div>
                <Link href="/admin/blogs/new" className="btn-primary text-sm py-2.5 px-5 shadow-md hover:shadow-lg transition-all">
                    <Plus size={16} /> New Post
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="admin-card p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">No blog posts yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">Share your thoughts and news by creating your first blog post.</p>
                    <Link href="/admin/blogs/new" className="btn-primary text-sm">
                        <Plus size={16} /> Write First Post
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="admin-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary-100 transition-colors group">
                            {item.image ? (
                                <div className="relative w-full sm:w-28 h-48 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm border border-gray-200">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 112px" />
                                </div>
                            ) : (
                                <div className="hidden sm:flex w-28 h-20 rounded-xl bg-gray-50 border border-gray-200 items-center justify-center text-gray-300 flex-shrink-0">
                                    <Image size={24} />
                                </div>
                            )}

                            <div className="flex-1 min-w-0 py-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-1 mb-2">{item.excerpt}</p>
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{item.author || "Admin"}</span>
                                    <span>•</span>
                                    <span>{formatDate(item.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex sm:flex-col gap-2 flex-shrink-0 mt-4 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/blogs/${item.id}`} className="btn-ghost flex-1 sm:flex-none justify-center text-xs py-2 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm text-gray-700">
                                    <Pencil size={14} className="mr-1.5" /> Edit
                                </Link>
                                <form action={async () => { "use server"; await deleteBlog(item.id) }} className="flex-1 sm:flex-none">
                                    <button type="submit" className="w-full btn-ghost justify-center text-xs py-2 px-4 bg-white border border-red-100 hover:border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm text-red-600 transition-colors">
                                        <Trash2 size={14} className="mr-1.5" /> Delete
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
