import React from "react";

interface SliderProps {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    className?: string;
    unit?: string;
    infoText?: string;
}

import { Info } from "lucide-react";
import Tooltip from "./Tooltip";

const Slider: React.FC<SliderProps> = ({ label, min = 0, max = 100, step = 1, value, onChange, className = "", unit = "", infoText }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
                        {infoText && (
                            <Tooltip content={infoText}>
                                <Info className="size-3.5 text-slate-400 hover:text-emerald-500 cursor-help transition-colors duration-200" />
                            </Tooltip>
                        )}
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {value} {unit}
                    </span>
                </div>
            )}
            <div className="relative w-full h-2.5 rounded-full cursor-pointer" style={{
                background: 'var(--surface-muted)',
                border: '1px solid var(--surface-card-border)',
            }}>
                {/* Track fill */}
                <div className="absolute top-0 left-0 h-full rounded-full" style={{
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, #156f5d, #2dbf9f)',
                    boxShadow: '0 0 10px rgba(21, 111, 93, 0.24)',
                    transition: 'width 0.15s ease-out',
                }} />

                {/* Thumb input */}
                <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer z-10" />

                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-md pointer-events-none transition-transform duration-75 ease-out" style={{
                    left: `calc(${percentage}% - 10px)`,
                    background: 'var(--surface-card-strong)',
                    border: '2.5px solid var(--accent)',
                    boxShadow: '0 6px 16px rgba(21, 111, 93, 0.18), 0 2px 6px rgba(0,0,0,0.08)',
                }} />
            </div>
        </div>
    );
};

export default Slider;
