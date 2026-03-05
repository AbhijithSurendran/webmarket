import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Check, ArrowLeft } from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { getProductBySlug, getProducts } from "@/app/actions/products"

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await getProductBySlug(params.slug)

    if (!product) {
        return { title: "Product Not Found" }
    }

    return {
        title: product.title,
        description: product.description,
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const product = await getProductBySlug(params.slug)
    const allProducts = await getProducts();
    const relatedProducts = allProducts.filter(p => p.id !== product?.id).slice(0, 3);

    if (!product) {
        notFound()
    }

    return (
        <div className="bg-white">
            <PageContainer>
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Products
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Image */}
                    <div className="relative sticky top-32">
                        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                            <Image
                                src={product.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="badge bg-primary-100 text-primary-700 px-3 py-1">Product</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                                {product.title}
                            </h1>
                            {product.price && (
                                <div className="text-3xl font-bold text-primary-600 mb-6">
                                    ${product.price}
                                </div>
                            )}
                            <div className="prose prose-lg text-gray-600 mb-10">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {product.features && product.features.length > 0 && (
                            <div className="mb-10 p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Key Features</h3>
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    {product.features.map((feature, i) => (
                                        <li key={i} className="flex gap-3 text-gray-700">
                                            <div className="mt-1 flex-shrink-0 text-primary-500">
                                                <Check size={18} />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                            <Link href="/contact" className="btn-primary text-base px-8 py-3.5 flex-1">
                                Request a Demo
                            </Link>
                            <a href="mailto:sales@webmarket.com" className="btn-secondary text-base px-8 py-3.5 flex-1">
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 pt-16 border-t border-gray-100">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">You Might Also Like</h2>
                            <p className="text-gray-500">Explore other products in our catalogue.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProducts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/products/${p.slug}`}
                                    className="group card hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div className="relative h-48 overflow-hidden bg-gray-50">
                                        <Image
                                            src={p.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"}
                                            alt={p.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {p.title}
                                        </h3>
                                        {p.price && <div className="text-primary-600 font-medium mb-4">${p.price}</div>}
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
