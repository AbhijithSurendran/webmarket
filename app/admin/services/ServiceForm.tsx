"use client"

import { useState } from "react"
import { createService, updateService } from "@/app/actions/services"
import ImageUpload from "@/components/admin/ImageUpload"
import SlugInput from "@/components/admin/SlugInput"
import RichTextEditor from "@/components/admin/RichTextEditor"
import type { Service } from "@/lib/types"
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ServiceForm({ item }: { item?: Service }) {
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState(item?.image || "")
    const [slug, setSlug] = useState(item?.slug || "")
    const [title, setTitle] = useState(item?.title || "")
    const [description, setDescription] = useState(item?.description || "")
    const [benefits, setBenefits] = useState<string[]>(item?.benefits || [])
    const [newBenefit, setNewBenefit] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setError("")

        const formData = new FormData()
        formData.append("title", title)
        formData.append("slug", slug)
        formData.append("description", description)
        if (imageUrl) formData.append("image", imageUrl)
        formData.append("benefits", benefits.join(",")) // The server action expects a comma-separated string

        let result
        if (item) {
            formData.append("id", item.id)
            result = await updateService(formData)
        } else {
            result = await createService(formData)
        }

        if (result.success) {
            router.push("/admin/services")
            router.refresh()
        } else {
            setError(result.error || "An error occurred while saving the service.")
            setIsPending(false)
        }
    }

    const addBenefit = () => {
        if (newBenefit.trim()) {
            setBenefits([...benefits, newBenefit.trim()])
            setNewBenefit("")
        }
    }

    const removeBenefit = (index: number) => {
        setBenefits(benefits.filter((_, i) => i !== index))
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <Link href="/admin/services" className="btn-ghost p-2"><ArrowLeft size={18} /></Link>
                <h1 className="text-2xl font-heading font-bold text-gray-900">{item ? "Edit Service" : "New Service"}</h1>
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
                            <h2 className="font-semibold text-gray-900 mb-4">Basic Details</h2>
                            {item && <input type="hidden" name="id" value={item.id} />}
                            <div>
                                <label className="label">Title <span className="text-red-500">*</span></label>
                                <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" placeholder="Service title" />
                            </div>
                            <SlugInput value={slug} onChange={setSlug} sourceValue={title} />
                            <div>
                                <label className="label">Description <span className="text-red-500">*</span></label>
                                <RichTextEditor value={description} onChange={setDescription} />
                            </div>
                        </div>

                        {/* Benefits List */}
                        <div className="admin-card p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Service Benefits</h2>
                            <p className="text-sm text-gray-500 mb-4">List the key benefits or reasons to choose this service.</p>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                                    className="input-field flex-1"
                                    placeholder="Add a new benefit..."
                                />
                                <button type="button" onClick={addBenefit} className="btn-secondary whitespace-nowrap px-4">
                                    <Plus size={18} /> Add
                                </button>
                            </div>

                            {benefits.length > 0 ? (
                                <ul className="space-y-2">
                                    {benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg group">
                                            <span className="text-sm text-gray-700">{benefit}</span>
                                            <button type="button" onClick={() => removeBenefit(i)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center py-4 border border-dashed border-gray-200 rounded-xl">No benefits added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="admin-card p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Service Image</h2>
                            <ImageUpload value={imageUrl} onChange={setImageUrl} label="Upload Image" />
                        </div>

                        <div className="admin-card p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Publish</h2>
                            <p className="text-sm text-gray-500 mb-6">Make sure all service details are correct before saving.</p>
                            <button type="submit" disabled={isPending} className="btn-primary w-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                {isPending ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : (item ? "Update Service" : "Save Service")}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
