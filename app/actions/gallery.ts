"use server";

import { revalidatePath } from "next/cache";
import { getDB, saveDB, generateId } from "@/lib/db";
import { GalleryImage } from "@/lib/types";

export async function getGalleryImages(): Promise<GalleryImage[]> {
    const db = await getDB();
    return db.gallery.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addGalleryImage(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const url = formData.get("url") as string;
        const caption = formData.get("caption") as string;

        if (!url) {
            return { success: false, error: "Image URL is required" };
        }

        const db = await getDB();

        const newImage: GalleryImage = {
            id: generateId(),
            url,
            caption,
            createdAt: new Date().toISOString()
        };

        db.gallery.push(newImage);
        await saveDB(db);

        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");

        return { success: true };
    } catch (error) {
        console.error("Error adding gallery image:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function deleteGalleryImage(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();
        const initialLength = db.gallery.length;
        db.gallery = db.gallery.filter(img => img.id !== id);

        if (db.gallery.length === initialLength) {
            return { success: false, error: "Image not found" };
        }

        await saveDB(db);
        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");

        return { success: true };
    } catch (error) {
        console.error("Error deleting gallery image:", error);
        return { success: false, error: "Internal server error" };
    }
}
