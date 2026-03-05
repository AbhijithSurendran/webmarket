"use client"

import { useState } from "react"
import { updateAboutContent } from "@/app/actions/pages"
import { Loader2, CheckCircle } from "lucide-react"
import { PagesContent } from "@/lib/types"

export default function AboutPageForm({ data }: { data: PagesContent["about"] }) {
    const [title, setTitle] = useState(data.title || "")
    const [content, setContent] = useState(data.content || "")
    const [mission, setMission] = useState(data.mission || "")
    const [vision, setVision] = useState(data.vision || "")
    const [isPending, setIsPending] = useState(false)
    const [saved, setSaved] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setSaved(false)

        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", content)
        formData.append("mission", mission)
        formData.append("vision", vision)

        const result = await updateAboutContent(formData)
        setIsPending(false)

        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {saved && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                    <CheckCircle size={18} /> About page content saved successfully!
                </div>
            )}

            <div className="admin-card p-6 space-y-5">
                <div>
                    <label className="label">Page Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" />
                </div>
                <div>
                    <label className="label">Overview Content</label>
                    <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} required className="input-field resize-none" placeholder="Main description about your company..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100 mt-4">
                    <div>
                        <label className="label">Our Mission</label>
                        <textarea rows={4} value={mission} onChange={(e) => setMission(e.target.value)} className="input-field resize-none" placeholder="Company mission statement..." />
                    </div>
                    <div>
                        <label className="label">Our Vision</label>
                        <textarea rows={4} value={vision} onChange={(e) => setVision(e.target.value)} className="input-field resize-none" placeholder="Company vision statement..." />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save About Settings"}
            </button>
        </form>
    )
}
