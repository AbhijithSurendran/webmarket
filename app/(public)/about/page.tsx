import type { Metadata } from "next"
import PageHeader from "@/components/ui/PageHeader"
import PageContainer from "@/components/ui/PageContainer"
import AboutSection from "@/components/public/AboutSection"
import { getDB } from "@/lib/db"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about our company mission, vision, and values",
}

export default async function AboutPage() {
    const db = await getDB();
    const { about } = db.pages;

    return (
        <>
            <PageHeader
                title={about.title || "About Us"}
                description={"Learn more about our company mission, vision, and values."}
            />

            <AboutSection
                content={about.content}
                bannerImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
            />

            <PageContainer className="bg-white">
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md text-xl font-bold">
                            M
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {about.mission || "Our mission is to deliver exceptional value to our clients through innovative solutions and unparalleled service."}
                        </p>
                    </div>

                    <div className="bg-secondary-50 p-8 rounded-2xl border border-secondary-100">
                        <div className="w-12 h-12 bg-secondary-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-md text-xl font-bold">
                            V
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {about.vision || "We envision a future where our tools empower businesses globally to achieve new heights of success."}
                        </p>
                    </div>
                </div>
            </PageContainer>
        </>
    )
}
