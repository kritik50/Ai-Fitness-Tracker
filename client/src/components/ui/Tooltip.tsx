import { type ReactNode } from "react";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className="relative group flex items-center">
            {children}
            <div className="absolute bottom-full mb-2.5 hidden group-hover:block w-52 p-3 text-xs rounded-xl shadow-lg z-50 left-1/2 -translate-x-1/2 text-center pointer-events-none leading-relaxed"
                style={{
                    background: 'var(--surface-card)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--surface-card-border)',
                    boxShadow: 'var(--shadow-card-hover)',
                    color: 'var(--text-secondary)',
                    animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                {content}
            </div>
        </div>
    );
}
