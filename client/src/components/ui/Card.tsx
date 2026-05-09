import React from 'react'

const Card = ({
    children,
    className = '',
    style,
}: {
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties
}) => {
    return (
        <div
            className={`rounded-[24px] p-5 sm:p-6 transition-all duration-300 ${className}`}
            style={{
                background: 'linear-gradient(180deg, var(--surface-card-strong), var(--surface-card))',
                border: '1px solid var(--surface-card-border)',
                boxShadow: 'var(--shadow-card)',
                backdropFilter: 'blur(18px) saturate(1.18)',
                WebkitBackdropFilter: 'blur(18px) saturate(1.18)',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

export default Card
