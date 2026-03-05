"use server";

import { revalidatePath } from "next/cache";
import { getDB, saveDB, generateId } from "@/lib/db";
import { Service } from "@/lib/types";

export async function getServices(): Promise<Service[]> {
    const db = await getDB();
    return db.services.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
    const db = await getDB();
    return db.services.find(s => s.slug === slug);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
    const db = await getDB();
    return db.services.find(s => s.id === id);
}

export async function createService(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const description = formData.get("description") as string;
        const benefitsStr = formData.get("benefits") as string;
        const benefits = benefitsStr ? benefitsStr.split(',').map(b => b.trim()).filter(Boolean) : [];
        const image = formData.get("image") as string;

        const db = await getDB();

        if (db.services.some(s => s.slug === slug)) {
            return { success: false, error: "Service with this slug already exists" };
        }

        const newService: Service = {
            id: generateId(),
            title,
            slug,
            description,
            benefits,
            image,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.services.push(newService);
        await saveDB(db);

        revalidatePath("/services");
        revalidatePath("/admin/services");

        return { success: true };
    } catch (error) {
        console.error("Error creating service:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function updateService(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const id = formData.get("id") as string;
        if (!id) return { success: false, error: "ID is required" };

        const db = await getDB();
        const index = db.services.findIndex(s => s.id === id);

        if (index === -1) {
            return { success: false, error: "Service not found" };
        }

        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const benefitsStr = formData.get("benefits") as string;
        const benefits = benefitsStr ? benefitsStr.split(',').map(b => b.trim()).filter(Boolean) : [];
        const image = formData.get("image") as string;

        if (db.services.some(s => s.slug === slug && s.id !== id)) {
            return { success: false, error: "Another service uses this slug" };
        }

        db.services[index] = {
            ...db.services[index],
            title,
            slug,
            description,
            benefits,
            ...(image && { image }),
            updatedAt: new Date().toISOString()
        };

        await saveDB(db);

        revalidatePath("/services");
        revalidatePath(`/services/${slug}`);
        revalidatePath("/admin/services");

        return { success: true };
    } catch (error) {
        console.error("Error updating service:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function deleteService(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();
        const initialLength = db.services.length;
        db.services = db.services.filter(s => s.id !== id);

        if (db.services.length === initialLength) {
            return { success: false, error: "Service not found" };
        }

        await saveDB(db);
        revalidatePath("/services");
        revalidatePath("/admin/services");

        return { success: true };
    } catch (error) {
        console.error("Error deleting service:", error);
        return { success: false, error: "Internal server error" };
    }
}
