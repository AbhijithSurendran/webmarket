"use server"

export type ContactFormState = {
    success?: boolean
    error?: string
    fieldErrors?: {
        name?: string
        email?: string
        message?: string
    }
}

export async function submitContactForm(
    prevState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const message = formData.get("message") as string

        const fieldErrors: ContactFormState["fieldErrors"] = {}
        if (!name || name.trim().length < 2) fieldErrors.name = "Name is too short."
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = "Invalid email format."
        if (!message || message.trim().length < 10) fieldErrors.message = "Message must be at least 10 characters."

        if (Object.keys(fieldErrors).length > 0) {
            return { fieldErrors }
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real application, you would send an email here or save to a database.
        console.log("New contact form submission:", { name, email, message });

        return { success: true }
    } catch (error) {
        console.error("Contact form error:", error)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}
