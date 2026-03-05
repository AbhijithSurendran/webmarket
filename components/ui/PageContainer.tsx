import { ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
    return (
        <div className={`container-custom page-section ${className}`}>
            {children}
        </div>
    );
}
