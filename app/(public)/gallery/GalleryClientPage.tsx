"use client"

import { useState } from "react"
import Image from "next/image"
import PageHeader from "@/components/ui/PageHeader"
import PageContainer from "@/components/ui/PageContainer"
import type { GalleryImage } from "@/lib/types"

interface GalleryClientProps {
    items: GalleryImage[]
}

export default function GalleryClientPage({ items }: GalleryClientProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    return (
        <>
            <PageHeader
                title="Our Gallery"
                description="Take a visual tour of our facilities, team events, and major milestones."
            />

            <PageContainer className="bg-white">
                {items.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No images found in the gallery.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => setLightboxIndex(index)}
                                className="relative h-64 overflow-hidden rounded-xl group cursor-pointer"
                                aria-label={item.alt || `Gallery image ${index + 1}`}
                            >
                                <Image
                                    src={item.url}
                                    alt={item.alt || `Gallery ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                        View Image
                                    </span>
                                </div>
                                {item.alt && (
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <p className="text-white text-sm font-medium line-clamp-2">{item.alt}</p>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </PageContainer>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center"
                        onClick={() => setLightboxIndex(null)}
                        aria-label="Close lightbox"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>

                    {items.length > 1 && (
                        <>
                            <button
                                className="absolute left-6 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full w-14 h-14 flex items-center justify-center"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setLightboxIndex((i) => (i === null || i === 0 ? items.length - 1 : i - 1))
                                }}
                                aria-label="Previous image"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button
                                className="absolute right-6 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full w-14 h-14 flex items-center justify-center"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setLightboxIndex((i) => (i === null || i === items.length - 1 ? 0 : i + 1))
                                }}
                                aria-label="Next image"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </>
                    )}

                    <div
                        className="relative w-full max-w-6xl h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={items[lightboxIndex].url}
                            alt={items[lightboxIndex].alt || "Gallery Image"}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </div>
                    {items[lightboxIndex].alt && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-2xl w-full px-4 text-center">
                            <p className="text-white text-base bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl inline-block border border-white/10">
                                {items[lightboxIndex].alt}
                            </p>
                        </div>
                    )}

                    <div className="absolute top-6 left-6 text-white/50 text-sm font-medium tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/10">
                        {lightboxIndex + 1} / {items.length}
                    </div>
                </div>
            )}
        </>
    )
}
