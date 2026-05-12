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
            className={`rounded-[22px] p-5 sm:p-6 transition-all duration-300 ${className}`}
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

export default Card
