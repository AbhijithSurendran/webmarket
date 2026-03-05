import type { Metadata } from "next"
import { getDB } from "@/lib/db"
import GalleryClientPage from "./GalleryClientPage"

export const metadata: Metadata = {
    title: "Our Gallery",
    description: "Take a visual tour of our workspace.",
}

export default async function GalleryPage() {
    const db = await getDB();
    const galleryItems = db.gallery;

    return <GalleryClientPage items={galleryItems} />
}
