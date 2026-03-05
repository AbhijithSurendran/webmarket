import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export default function Card({ children, className = "", hoverEffect = true }: CardProps) {
    return (
        <div
            className={`card group ${hoverEffect ? "hover:-translate-y-1 hover:shadow-md transition-all duration-300" : ""
                } ${className}`}
        >
            {children}
        </div>
    );
}
