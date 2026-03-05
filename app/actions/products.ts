"use server";

import { revalidatePath } from "next/cache";
import { getDB, saveDB, generateId } from "@/lib/db";
import { Product } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
    const db = await getDB();
    return db.products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    const db = await getDB();
    return db.products.find(p => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const db = await getDB();
    return db.products.find(p => p.id === id);
}

export async function createProduct(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const description = formData.get("description") as string;
        const price = formData.get("price") ? Number(formData.get("price")) : undefined;
        const featuresStr = formData.get("features") as string;
        const features = featuresStr ? featuresStr.split(',').map(f => f.trim()).filter(Boolean) : [];
        const image = formData.get("image") as string;

        const db = await getDB();

        if (db.products.some(p => p.slug === slug)) {
            return { success: false, error: "Product with this slug already exists" };
        }

        const newProduct: Product = {
            id: generateId(),
            title,
            slug,
            description,
            features,
            price,
            image,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.products.push(newProduct);
        await saveDB(db);

        revalidatePath("/products");
        revalidatePath("/admin/products");

        return { success: true };
    } catch (error) {
        console.error("Error creating product:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function updateProduct(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const id = formData.get("id") as string;
        if (!id) return { success: false, error: "ID is required" };

        const db = await getDB();
        const index = db.products.findIndex(p => p.id === id);

        if (index === -1) {
            return { success: false, error: "Product not found" };
        }

        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") ? Number(formData.get("price")) : undefined;
        const featuresStr = formData.get("features") as string;
        const features = featuresStr ? featuresStr.split(',').map(f => f.trim()).filter(Boolean) : [];
        const image = formData.get("image") as string;

        // Check slug collision
        if (db.products.some(p => p.slug === slug && p.id !== id)) {
            return { success: false, error: "Another product uses this slug" };
        }

        db.products[index] = {
            ...db.products[index],
            title,
            slug,
            description,
            price,
            features,
            ...(image && { image }),
            updatedAt: new Date().toISOString()
        };

        await saveDB(db);

        revalidatePath("/products");
        revalidatePath(`/products/${slug}`);
        revalidatePath("/admin/products");

        return { success: true };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();
        const initialLength = db.products.length;
        db.products = db.products.filter(p => p.id !== id);

        if (db.products.length === initialLength) {
            return { success: false, error: "Product not found" };
        }

        await saveDB(db);
        revalidatePath("/products");
        revalidatePath("/admin/products");

        return { success: true };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, error: "Internal server error" };
    }
}
