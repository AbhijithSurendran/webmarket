import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="bg-secondary-50 py-16 md:py-24 mt-[64px] lg:mt-[80px]">
            <div className="container-custom text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 animate-fade-in">
                    {title}
                </h1>
                {description && (
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
