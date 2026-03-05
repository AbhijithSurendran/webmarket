"use client"

import { useState } from "react"
import { createBlog, updateBlog } from "@/app/actions/blogs"
import ImageUpload from "@/components/admin/ImageUpload"
import SlugInput from "@/components/admin/SlugInput"
import RichTextEditor from "@/components/admin/RichTextEditor"
import type { Blog } from "@/lib/types"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BlogForm({ item }: { item?: Blog }) {
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState(item?.image || "")
    const [slug, setSlug] = useState(item?.slug || "")
    const [title, setTitle] = useState(item?.title || "")
    const [excerpt, setExcerpt] = useState(item?.excerpt || "")
    const [content, setContent] = useState(item?.content || "")
    const [author, setAuthor] = useState(item?.author || "Admin")
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setError("")

        const formData = new FormData()
        formData.append("title", title)
        formData.append("slug", slug)
        formData.append("excerpt", excerpt)
        formData.append("content", content)
        formData.append("author", author)
        if (imageUrl) formData.append("image", imageUrl)

        let result
        if (item) {
            result = await updateBlog(item.id, formData)
        } else {
            result = await createBlog(formData)
        }

        if (result.success) {
            router.push("/admin/blogs")
            router.refresh()
        } else {
            setError(result.error || "An error occurred while saving the blog post.")
            setIsPending(false)
        }
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <Link href="/admin/blogs" className="btn-ghost p-2"><ArrowLeft size={18} /></Link>
                <h1 className="text-2xl font-heading font-bold text-gray-900">{item ? "Edit Blog Post" : "New Blog Post"}</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="admin-card p-6 space-y-5">
                            <h2 className="font-semibold text-gray-900 mb-4">Post Details</h2>
                            <div>
                                <label className="label">Title <span className="text-red-500">*</span></label>
                                <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" placeholder="Blog post title" />
                            </div>
                            <SlugInput value={slug} onChange={setSlug} sourceValue={title} />
                            <div>
                                <label className="label">Excerpt</label>
                                <textarea name="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="input-field resize-none" placeholder="A short summary of the post..." />
                            </div>
                            <div>
                                <label className="label">Content <span className="text-red-500">*</span></label>
                                <RichTextEditor value={content} onChange={setContent} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="admin-card p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Publishing</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Author</label>
                                    <input name="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="input-field" placeholder="Author name" />
                                </div>
                                <div className="pt-2">
                                    <p className="text-sm text-gray-500 mb-4">Ready to publish this post?</p>
                                    <button type="submit" disabled={isPending} className="btn-primary w-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                        {isPending ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : (item ? "Update Post" : "Publish Post")}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="admin-card p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Cover Image</h2>
                            <ImageUpload value={imageUrl} onChange={setImageUrl} label="Upload Image" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
