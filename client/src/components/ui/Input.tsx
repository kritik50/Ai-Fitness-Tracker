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

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder = '',
    className = '',
    required = false,
    min,
    max
}: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'number') {
            const raw = e.target.value;
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
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label
                    className='block text-[10px] font-bold uppercase tracking-widest'
                    style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
                >
                    {label}
                    {required && <span style={{ color: 'var(--rose)', marginLeft: 3 }}>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                min={min}
                max={max}
                className='w-full px-4 py-3 text-sm outline-none transition-all duration-200'
                style={{
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-2)',
                    border: '1.5px solid var(--border)',
                    fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 4px var(--accent-glow)';
                    e.currentTarget.style.background = 'var(--surface)';
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = 'var(--surface-2)';
                    onBlur?.(e);
                }}
            />
        </div>
    );
}
