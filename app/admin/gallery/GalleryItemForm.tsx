"use client"

import { useState } from "react"
import { addGalleryImage } from "@/app/actions/gallery"
import ImageUpload from "@/components/admin/ImageUpload"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GalleryItemForm() {
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState("")
    const [caption, setCaption] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!imageUrl) {
            setError("Please upload an image first.")
            return
        }

        setIsPending(true)
        setError("")

        const formData = new FormData()
        formData.append("url", imageUrl)
        if (caption) formData.append("caption", caption)

        const result = await addGalleryImage(formData)

        if (result.success) {
            router.push("/admin/gallery")
            router.refresh()
        } else {
            setError(result.error || "An error occurred while saving the image.")
            setIsPending(false)
        }
    }

    return (
        <div className="p-6 lg:p-8 max-w-xl">
            <div className="flex items-center gap-3 mb-8">
                <Link href="/admin/gallery" className="btn-ghost p-2 text-gray-400 hover:text-gray-900"><ArrowLeft size={18} /></Link>
                <h1 className="text-2xl font-heading font-bold text-gray-900">Add Gallery Image</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-card p-6 space-y-6">
                <div>
                    <h2 className="font-semibold text-gray-900 mb-4">Upload Image <span className="text-red-500">*</span></h2>
                    <ImageUpload value={imageUrl} onChange={setImageUrl} label="Gallery Image" />
                </div>

                <div>
                    <label className="label">Caption (Optional)</label>
                    <input
                        name="caption"
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="input-field"
                        placeholder="A short description of the image"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button type="submit" disabled={isPending || !imageUrl} className="btn-primary shadow-md hover:shadow-lg transition-all">
                        {isPending ? <><Loader2 size={16} className="animate-spin" /> Uploading…</> : "Upload Image"}
                    </button>
                    <Link href="/admin/gallery" className="btn-ghost">Cancel</Link>
                </div>
            </form>
        </div>
    )
}
