import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: ButtonProps) {
    const baseStyles = 'px-5 py-3.5 flex items-center justify-center gap-2 rounded-2xl font-semibold text-sm tracking-[0.01em] transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const variants = {
        primary: '',
        secondary: '',
        danger: '',
    };

    // We use inline styles for gradient effects the Tailwind classes can't do
    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            background: 'linear-gradient(135deg, #156f5d, #1d9077)',
            color: '#fff',
            boxShadow: '0 14px 28px rgba(21, 111, 93, 0.22)',
        },
        secondary: {
            background: 'var(--surface-muted)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--surface-card-border)',
            boxShadow: '0 10px 22px rgba(15, 23, 42, 0.03)',
        },
        danger: {
            background: 'var(--danger-soft)',
            color: '#dc2626',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 10px 22px rgba(220, 38, 38, 0.06)',
        },
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={variantStyles[variant]}
            onMouseEnter={(e) => {
                if (disabled) return;
                if (variant === 'primary') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 18px 34px rgba(21, 111, 93, 0.28)';
                } else if (variant === 'secondary') {
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--surface-muted) 74%, white)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                } else if (variant === 'danger') {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                if (variant === 'primary') {
                    e.currentTarget.style.boxShadow = '0 14px 28px rgba(21, 111, 93, 0.22)';
                } else if (variant === 'secondary') {
                    e.currentTarget.style.background = 'var(--surface-muted)';
                } else if (variant === 'danger') {
                    e.currentTarget.style.background = 'var(--danger-soft)';
                }
            }}
        >
            {children}
        </button>
    );
}
