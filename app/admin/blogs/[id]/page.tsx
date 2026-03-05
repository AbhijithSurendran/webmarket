import { getBlogById } from "@/app/actions/blogs"
import { notFound } from "next/navigation"
import BlogForm from "../BlogForm"

export default async function EditBlogPage({ params }: { params: { id: string } }) {
    const item = await getBlogById(params.id)
    if (!item) notFound()
    return <BlogForm item={item} />
}
