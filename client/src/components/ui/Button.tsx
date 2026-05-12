import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function Button({
    children,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button',
    disabled = false
}: ButtonProps) {
    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            background: 'linear-gradient(135deg, var(--accent), var(--teal))',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 14px var(--accent-glow)',
        },
        secondary: {
            background: 'var(--surface-2)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)',
        },
        danger: {
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-border)',
            boxShadow: 'var(--shadow-xs)',
        },
    };

    const baseInlineStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '12px 20px',
        borderRadius: 'var(--radius-lg)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        outline: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={baseInlineStyles}
            onMouseEnter={(e) => {
                if (disabled) return;
                if (variant === 'primary') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px var(--accent-glow)';
                    e.currentTarget.style.filter = 'brightness(1.06)';
                } else if (variant === 'secondary') {
                    e.currentTarget.style.background = 'var(--surface-3)';
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                } else if (variant === 'danger') {
                    e.currentTarget.style.background = 'rgba(220, 38, 38, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.filter = 'none';
                if (variant === 'primary') {
                    e.currentTarget.style.boxShadow = '0 4px 14px var(--accent-glow)';
                } else if (variant === 'secondary') {
                    e.currentTarget.style.background = 'var(--surface-2)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                } else if (variant === 'danger') {
                    e.currentTarget.style.background = 'var(--danger-bg)';
                }
            }}
        >
            {children}
        </button>
    );
}
