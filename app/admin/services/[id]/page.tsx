import { getServiceById } from "@/app/actions/services"
import { notFound } from "next/navigation"
import ServiceForm from "../ServiceForm"

export default async function EditServicePage({ params }: { params: { id: string } }) {
    const item = await getServiceById(params.id)
    if (!item) notFound()
    return <ServiceForm item={item} />
}
