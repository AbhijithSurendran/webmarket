import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    isLoading?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    isLoading = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`btn-${variant} ${className} relative overflow-hidden`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg
                    className="w-5 h-5 mr-2 animate-spin absolute left-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                    ></path>
                </svg>
            )}
            <span className={isLoading ? "opacity-0" : ""}>{children}</span>
        </button>
    );
}
