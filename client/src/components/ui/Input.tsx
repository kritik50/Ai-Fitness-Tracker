import React from 'react';

interface InputProps {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    value: string | number;
    onChange: (value: string | number) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    min?: string | number;
    max?: string | number;
}

export default function Input({ label, type = 'text', value, onChange, onBlur, onFocus, placeholder = '', className = '', required = false, min, max }: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'number') {
            const raw = e.target.value;
            // If field is cleared, pass 0 to avoid NaN in state
            if (raw === '' || raw === '-') {
                onChange(0);
            } else {
                const parsed = parseFloat(raw);
                onChange(isNaN(parsed) ? 0 : parsed);
            }
        } else {
            onChange(e.target.value);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                min={min}
                max={max}
                className='w-full px-4 py-3.5 text-sm outline-none transition-all duration-300'
                style={{
                    color: 'var(--text-primary)',
                    borderRadius: '16px',
                    background: 'color-mix(in srgb, var(--surface-card-strong) 82%, transparent)',
                    border: '1.5px solid var(--surface-card-border)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 4px color-mix(in srgb, var(--accent) 12%, transparent)';
                    e.currentTarget.style.background = 'var(--surface-card-strong)';
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--surface-card-border)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--surface-card-strong) 82%, transparent)';
                    onBlur?.(e);
                }}
            />
            <style>{`
                .dark input[type="text"],
                .dark input[type="number"],
                .dark input[type="email"],
                .dark input[type="password"] {
                    background: color-mix(in srgb, var(--surface-card-strong) 86%, transparent) !important;
                    border-color: var(--surface-card-border) !important;
                }
                .dark input:focus {
                    border-color: var(--accent) !important;
                    box-shadow: 0 0 0 4px rgba(61, 209, 176, 0.12) !important;
                    background: var(--surface-card-strong) !important;
                }
            `}</style>
        </div>
    );
}
