import Link from "next/link"
import Image from "next/image"
import { getDB } from "@/lib/db"
import { deleteService } from "@/app/actions/services"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default async function ServicesAdminPage() {
    const db = await getDB();
    const items = db.services || [];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Services</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your {items.length} service offerings</p>
                </div>
                <Link href="/admin/services/new" className="btn-primary text-sm py-2.5 px-5 shadow-md hover:shadow-lg transition-all">
                    <Plus size={16} /> New Service
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="admin-card p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">No services added yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">Get started by creating your first service to display on the public website.</p>
                    <Link href="/admin/services/new" className="btn-primary text-sm">
                        <Plus size={16} /> Add First Service
                    </Link>
                </div>
            ) : (
                <div className="admin-card overflow-hidden shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[700px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wide text-xs uppercase">Service Name</th>
                                    <th className="text-left px-6 py-4 text-gray-500 font-semibold tracking-wide text-xs uppercase hidden md:table-cell">Added On</th>
                                    <th className="text-right px-6 py-4 text-gray-500 font-semibold tracking-wide text-xs uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {item.image ? (
                                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                        <Image size={24} />
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-semibold text-gray-900 block mb-0.5">{item.title}</span>
                                                    <span className="text-xs text-gray-400 font-mono">/{item.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-gray-500 text-xs">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/services/${item.id}`} className="btn-ghost py-1.5 px-3 text-xs bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm text-gray-700">
                                                    <Pencil size={14} className="mr-1.5" /> Edit
                                                </Link>
                                                <form action={async () => { "use server"; await deleteService(item.id) }}>
                                                    <button type="submit" className="btn-ghost py-1.5 px-3 text-xs bg-white border border-red-100 hover:border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm text-red-600 transition-colors">
                                                        <Trash2 size={14} className="mr-1.5" /> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
