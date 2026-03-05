import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PageHeader from "@/components/ui/PageHeader"
import PageContainer from "@/components/ui/PageContainer"
import { getDB } from "@/lib/db"
import { truncate } from "@/lib/utils"

export const metadata: Metadata = {
    title: "Our Products",
    description: "Explore our comprehensive range of products.",
}

export default async function ProductsPage() {
    const db = await getDB();
    const products = db.products;

    return (
        <>
            <PageHeader
                title="Our Products"
                description="Explore our premium range of products designed to elevate your business operations and efficiency."
            />

            <PageContainer className="bg-gray-50">
                {products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No products found. Please add products using the admin dashboard.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white"
                            >
                                <div className="relative h-60 overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {product.price && (
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 font-bold px-3 py-1 rounded-lg text-sm shadow-sm">
                                            ${product.price}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {product.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                        {truncate(product.description, 120)}
                                    </p>
                                    <div className="flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                                        View Details <span className="text-lg leading-none">&rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </PageContainer>
        </>
    )
}
