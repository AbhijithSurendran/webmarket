import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Check, ArrowLeft, ArrowRight } from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { getServiceBySlug } from "@/app/actions/services"

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const service = await getServiceBySlug(params.slug)

    if (!service) {
        return { title: "Service Not Found" }
    }

    return {
        title: service.title,
        description: service.description,
    }
}

export default async function ServiceDetailPage({ params }: Props) {
    const service = await getServiceBySlug(params.slug)

    if (!service) {
        notFound()
    }

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-secondary-900 pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={service.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"}
                        alt={service.title}
                        fill
                        className="object-cover opacity-20 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/80 to-transparent" />
                </div>

                <div className="container-custom relative z-10 text-center">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft size={16} /> All Services
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                        {service.title}
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                        {service.description}
                    </p>
                </div>
            </div>

            <PageContainer>
                <div className="max-w-4xl mx-auto">
                    {/* Main Content */}
                    <div className="prose prose-lg prose-primary max-w-none mb-16">
                        <p className="text-xl text-gray-600 leading-relaxed mb-10">
                            {service.description}
                        </p>
                    </div>

                    {/* Benefits/Features */}
                    {service.benefits && service.benefits.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
                                Why Choose This Service
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {service.benefits.map((benefit, i) => (
                                    <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-primary-600">
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA Banner */}
                    <div className="bg-primary-600 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                                Ready to get started?
                            </h2>
                            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                                Contact our team today to discuss how we can tailor this service to your specific needs.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:-translate-y-1 transition-all shadow-lg">
                                Contact Us <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    )
}
