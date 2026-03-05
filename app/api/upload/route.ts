import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Secure filename
        const originalName = file.name;
        const extension = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, extension).replace(/[^a-zA-Z0-9-]/g, "");
        const fileName = `${nameWithoutExt}-${Date.now()}${extension}`;

        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        const url = `/uploads/${fileName}`;

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
