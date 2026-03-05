import { getPagesContent } from "@/app/actions/pages"
import AboutPageForm from "./AboutPageForm"
import HomePageForm from "./HomePageForm"

export default async function PagesAdminPage() {
    const pages = await getPagesContent()

    return (
        <div className="p-6 lg:p-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold text-gray-900">Pages</h1>
                <p className="text-gray-500 text-sm mt-1">Manage the content for your static pages.</p>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="mb-6 flex items-center gap-3">
                        <h2 className="text-xl font-heading font-semibold text-gray-900">Home Page</h2>
                        <span className="badge bg-primary-100 text-primary-700 text-xs px-2.5 py-1 rounded-full">/</span>
                    </div>
                    <HomePageForm data={pages.home} />
                </section>

                <hr className="border-gray-200" />

                <section>
                    <div className="mb-6 flex items-center gap-3">
                        <h2 className="text-xl font-heading font-semibold text-gray-900">About Page</h2>
                        <span className="badge bg-primary-100 text-primary-700 text-xs px-2.5 py-1 rounded-full">/about</span>
                    </div>
                    <AboutPageForm data={pages.about} />
                </section>
            </div>
        </div>
    )
}
