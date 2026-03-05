import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PageHeader from "@/components/ui/PageHeader"
import PageContainer from "@/components/ui/PageContainer"
import { getDB } from "@/lib/db"
import { truncate, formatDate } from "@/lib/utils"

export const metadata: Metadata = {
    title: "Our Blog",
    description: "Insights, news, and updates from our team.",
}

export default async function BlogsPage() {
    const db = await getDB();
    const blogs = db.blogs;

    return (
        <>
            <PageHeader
                title="Our Blog"
                description="Insights, industry news, and updates from our expert team."
            />

            <PageContainer className="bg-gray-50">
                {blogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No articles published yet. Check back soon!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="group card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
                            >
                                <Link href={`/blogs/${blog.slug}`} className="block relative h-56 overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                        src={blog.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80"}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </Link>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium">
                                        <span>{formatDate(blog.createdAt)}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span>{blog.author || "Admin"}</span>
                                    </div>
                                    <Link href={`/blogs/${blog.slug}`}>
                                        <h2 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">
                                        {blog.excerpt || truncate(blog.content, 120)}
                                    </p>
                                    <Link
                                        href={`/blogs/${blog.slug}`}
                                        className="inline-flex items-center text-primary-600 font-medium text-sm border-b border-transparent hover:border-primary-600 pb-0.5 transition-all w-fit mt-auto"
                                    >
                                        Read Article
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </PageContainer>
        </>
    )
}
