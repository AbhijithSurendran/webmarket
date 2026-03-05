import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PageHeader from "@/components/ui/PageHeader"
import PageContainer from "@/components/ui/PageContainer"
import { getDB } from "@/lib/db"
import { truncate } from "@/lib/utils"

export const metadata: Metadata = {
    title: "Our Services",
    description: "Comprehensive solutions for your business needs.",
}

export default async function ServicesPage() {
    const db = await getDB();
    const services = db.services;

    return (
        <>
            <PageHeader
                title="Our Services"
                description="Comprehensive solutions tailored to help your business innovate, grow, and succeed in the digital era."
            />

            <PageContainer className="bg-white">
                {services.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No services found. Please add services using the admin dashboard.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className="group card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={service.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"}
                                        alt={service.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="p-8">
                                    <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                        {service.title}
                                    </h2>
                                    <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
                                        {truncate(service.description, 140)}
                                    </p>
                                    <div className="inline-flex items-center text-primary-600 font-medium text-sm border-b border-transparent group-hover:border-primary-600 pb-0.5 transition-all">
                                        Learn More
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
