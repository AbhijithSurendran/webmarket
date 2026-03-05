import { getProductById } from "@/app/actions/products"
import { notFound } from "next/navigation"
import ProductForm from "../ProductForm"

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const item = await getProductById(params.id)
    if (!item) notFound()
    return <ProductForm item={item} />
}
