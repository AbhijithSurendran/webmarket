"use server";

import { revalidatePath } from "next/cache";
import { getDB, saveDB, generateId } from "@/lib/db";
import { Blog } from "@/lib/types";

export async function getBlogs(): Promise<Blog[]> {
    const db = await getDB();
    return db.blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
    const db = await getDB();
    return db.blogs.find(b => b.slug === slug);
}

export async function createBlog(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const excerpt = formData.get("excerpt") as string;
        const content = formData.get("content") as string;
        const author = formData.get("author") as string;
        const image = formData.get("image") as string;

        const db = await getDB();

        if (db.blogs.some(b => b.slug === slug)) {
            return { success: false, error: "Blog with this slug already exists" };
        }

        const newBlog: Blog = {
            id: generateId(),
            title,
            slug,
            excerpt,
            content,
            author,
            image,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.blogs.push(newBlog);
        await saveDB(db);

        revalidatePath("/blogs");
        revalidatePath("/admin/blogs");

        return { success: true };
    } catch (error) {
        console.error("Error creating blog:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function updateBlog(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();
        const index = db.blogs.findIndex(b => b.id === id);

        if (index === -1) {
            return { success: false, error: "Blog not found" };
        }

        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const excerpt = formData.get("excerpt") as string;
        const content = formData.get("content") as string;
        const author = formData.get("author") as string;
        const image = formData.get("image") as string;

        if (db.blogs.some(b => b.slug === slug && b.id !== id)) {
            return { success: false, error: "Another blog uses this slug" };
        }

        db.blogs[index] = {
            ...db.blogs[index],
            title,
            slug,
            excerpt,
            content,
            author,
            ...(image && { image }),
            updatedAt: new Date().toISOString()
        };

        await saveDB(db);

        revalidatePath("/blogs");
        revalidatePath(`/blogs/${slug}`);
        revalidatePath("/admin/blogs");

        return { success: true };
    } catch (error) {
        console.error("Error updating blog:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function deleteBlog(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB();
        const initialLength = db.blogs.length;
        db.blogs = db.blogs.filter(b => b.id !== id);

        if (db.blogs.length === initialLength) {
            return { success: false, error: "Blog not found" };
        }

        await saveDB(db);
        revalidatePath("/blogs");
        revalidatePath("/admin/blogs");

        return { success: true };
    } catch (error) {
        console.error("Error deleting blog:", error);
        return { success: false, error: "Internal server error" };
    }
}
