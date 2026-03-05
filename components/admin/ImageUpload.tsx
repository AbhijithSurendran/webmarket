"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    label?: string
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState("")

    async function handleFile(file: File) {
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            setError("File must be under 5MB")
            return
        }

        setIsUploading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Upload failed")
            }

            onChange(data.url)
        } catch (err: any) {
            setError(err.message || "Upload failed. Please try again.")
            console.error(err)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-3">
            <span className="label block mb-1">{label}</span>

            {value ? (
                <div className="relative inline-block w-full">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all group">
                        <Image src={value} alt="Preview" fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" />

                        {/* Overlay that appears on hover to make close button more visible */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-red-50 hover:text-red-500 transition-colors opacity-90 hover:opacity-100 z-10"
                            aria-label="Remove image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${isUploading
                        ? "border-primary-300 bg-primary-50 cursor-wait"
                        : "border-gray-300 hover:border-primary-400 hover:bg-primary-50/50 cursor-pointer"
                        }`}
                >
                    {isUploading ? (
                        <>
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-1">
                                <Loader2 size={20} className="text-primary-600 animate-spin" />
                            </div>
                            <span className="text-sm font-medium text-primary-700">Uploading image…</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-1 group-hover:bg-white group-hover:shadow-sm transition-all">
                                <Upload size={22} className="text-gray-400" />
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-medium text-gray-700 block">Click to upload image</span>
                                <span className="text-xs text-gray-400 mt-1 block">PNG, JPG, WebP (max 5MB)</span>
                            </div>
                        </>
                    )}
                </button>
            )}

            <div className="flex items-center gap-2">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* URL Input as fallback */}
            <input
                type="text"
                placeholder="Paste an existing image URL or path here..."
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="input-field text-sm"
            />

            {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1.5 p-2 bg-red-50 rounded-lg border border-red-100">
                    <X size={14} className="flex-shrink-0" /> {error}
                </p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        handleFile(file);
                    }
                    // Reset value so same file can be selected again
                    e.target.value = "";
                }}
            />
        </div>
    )
}
