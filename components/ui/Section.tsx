import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    containerClassName?: string;
    bgVariant?: "white" | "light" | "dark" | "primary";
}

export default function Section({
    children,
    title,
    subtitle,
    className = "",
    containerClassName = "",
    bgVariant = "white",
}: SectionProps) {
    const bgClasses = {
        white: "bg-white",
        light: "bg-secondary-50",
        dark: "bg-secondary-900 text-white",
        primary: "bg-primary-600 text-white",
    };

    return (
        <section className={`py-16 md:py-24 ${bgClasses[bgVariant]} ${className}`}>
            <div className={`container-custom ${containerClassName}`}>
                {(title || subtitle) && (
                    <div className="text-center mb-12 md:mb-16">
                        {title && (
                            <h2
                                className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${bgVariant === "dark" || bgVariant === "primary"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                            >
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p
                                className={`text-lg max-w-2xl mx-auto ${bgVariant === "dark" || bgVariant === "primary"
                                        ? "text-gray-200"
                                        : "text-gray-600"
                                    }`}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
