import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options?: SelectOption[];
    className?: string;
    required?: boolean;
    placeholder?: string;
}

export default function Select({ label, value, onChange, options = [], className = '', required = false, placeholder = 'Select an option' }: SelectProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}
            <div className='relative'>
                <select
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
                    className='w-full px-4 py-3.5 text-sm appearance-none outline-none transition-all duration-300 cursor-pointer'
                    style={{
                        color: 'var(--text-primary)',
                        borderRadius: '16px',
                        background: 'color-mix(in srgb, var(--surface-card-strong) 82%, transparent)',
                        border: '1.5px solid var(--surface-card-border)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.boxShadow = '0 0 0 4px color-mix(in srgb, var(--accent) 12%, transparent)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--surface-card-border)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <option value='' disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
            </div>
            <style>{`
                .dark select {
                    background: color-mix(in srgb, var(--surface-card-strong) 86%, transparent) !important;
                    border-color: var(--surface-card-border) !important;
                }
                .dark select:focus {
                    border-color: var(--accent) !important;
                    box-shadow: 0 0 0 4px rgba(61, 209, 176, 0.12) !important;
                }
                .dark select option {
                    background: #18202b;
                    color: #f4ede5;
                }
            `}</style>
        </div>
    );
}
