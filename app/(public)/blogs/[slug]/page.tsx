import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User, Calendar, Clock } from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { getBlogBySlug, getBlogs } from "@/app/actions/blogs"
import { formatDate } from "@/lib/utils"

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const blog = await getBlogBySlug(params.slug)

    if (!blog) {
        return { title: "Blog Not Found" }
    }

    return {
        title: blog.title,
        description: blog.excerpt,
    }
}

export default async function BlogDetailPage({ params }: Props) {
    const blog = await getBlogBySlug(params.slug)
    const allBlogs = await getBlogs()
    const recentPosts = allBlogs.filter(b => b.id !== blog?.id).slice(0, 3)

    if (!blog) {
        notFound()
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-white pt-24 pb-12 md:pt-32 md:pb-16 border-b border-gray-100">
                <div className="container-custom max-w-4xl mx-auto">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors mb-8"
                    >
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-primary-500" />
                            <span className="font-medium text-gray-900">{blog.author || "Admin Team"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary-500" />
                            <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-primary-500" />
                            <span>{Math.max(1, Math.ceil(blog.content.length / 1000))} min read</span>
                        </div>
                    </div>
                </div>
            </div>

            <PageContainer className="!py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Featured Image */}
                    <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-lg mb-12 bg-gray-200">
                        <Image
                            src={blog.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 800px"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <article className="prose prose-lg md:prose-xl prose-primary max-w-none mb-16 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 whitespace-pre-line">
                        {blog.content}
                    </article>

                    {/* Author Box */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left mb-16">
                        <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                            {(blog.author || "A")[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                                About {blog.author || "the Author"}
                            </h3>
                            <p className="text-gray-600">
                                A dedicated professional at WebMarket, sharing insights and industry knowledge to help you stay ahead.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                    <div className="max-w-7xl mx-auto mt-20">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
                            More from the Blog
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {recentPosts.map((post) => (
                                <Link key={post.id} href={`/blogs/${post.slug}`} className="group card hover:-translate-y-1 transition-all duration-300 bg-white">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={post.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs text-primary-600 font-medium mb-2">
                                            {formatDate(post.createdAt)}
                                        </div>
                                        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </PageContainer>
        </div>
    )
}
