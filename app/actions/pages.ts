"use server";

import { revalidatePath } from "next/cache";
import { getDB, saveDB } from "@/lib/db";
import { PagesContent } from "@/lib/types";

export async function getPagesContent(): Promise<PagesContent> {
    const db = await getDB();
    return db.pages;
}

export async function updateHomeContent(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();

        db.pages.home = {
            heroTitle: formData.get("heroTitle") as string,
            heroSubtitle: formData.get("heroSubtitle") as string,
            heroCta: formData.get("heroCta") as string,
        };

        await saveDB(db);
        revalidatePath("/");
        revalidatePath("/admin/pages");

        return { success: true };
    } catch (error) {
        console.error("Error updating home content:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function updateAboutContent(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();

        db.pages.about = {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            mission: formData.get("mission") as string,
            vision: formData.get("vision") as string,
        };

        await saveDB(db);
        revalidatePath("/about");
        revalidatePath("/admin/pages");

        return { success: true };
    } catch (error) {
        console.error("Error updating about content:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function updateContactContent(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();

        db.pages.contact = {
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
        };

        await saveDB(db);
        revalidatePath("/contact");
        revalidatePath("/admin/pages");

        return { success: true };
    } catch (error) {
        console.error("Error updating contact content:", error);
        return { success: false, error: "Internal server error" };
    }
}
