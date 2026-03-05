"use client"

import { useState } from "react"
import { updateHomeContent } from "@/app/actions/pages"
import { Loader2, CheckCircle } from "lucide-react"
import { PagesContent } from "@/lib/types"

export default function HomePageForm({ data }: { data: PagesContent["home"] }) {
    const [heroTitle, setHeroTitle] = useState(data.heroTitle || "")
    const [heroSubtitle, setHeroSubtitle] = useState(data.heroSubtitle || "")
    const [heroCta, setHeroCta] = useState(data.heroCta || "")
    const [isPending, setIsPending] = useState(false)
    const [saved, setSaved] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setSaved(false)

        const formData = new FormData()
        formData.append("heroTitle", heroTitle)
        formData.append("heroSubtitle", heroSubtitle)
        formData.append("heroCta", heroCta)

        const result = await updateHomeContent(formData)
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
                    <CheckCircle size={18} /> Home page content saved successfully!
                </div>
            )}

            <div className="admin-card p-6 space-y-5">
                <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-2">Hero Section</h3>
                <div>
                    <label className="label">Hero Title</label>
                    <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} required className="input-field" placeholder="Main headline" />
                </div>
                <div>
                    <label className="label">Hero Subtitle</label>
                    <textarea rows={3} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} required className="input-field resize-none" placeholder="Supporting text under headline" />
                </div>
                <div>
                    <label className="label">Button Text (CTA)</label>
                    <input type="text" value={heroCta} onChange={(e) => setHeroCta(e.target.value)} required className="input-field" placeholder="E.g. Get Started" />
                </div>
            </div>

            <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save Home Settings"}
            </button>
        </form>
    )
}
