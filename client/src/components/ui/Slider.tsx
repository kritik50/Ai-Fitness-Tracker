import React from "react";
import { Info } from "lucide-react";
import Tooltip from "./Tooltip";

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

const Slider: React.FC<SliderProps> = ({
    label,
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    className = "",
    unit = "",
    infoText
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div style={{ width: '100%' }} className={className}>
            {label && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <label style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-body)',
                        }}>
                            {label}
                        </label>
                        {infoText && (
                            <Tooltip content={infoText}>
                                <Info style={{
                                    width: 14,
                                    height: 14,
                                    color: 'var(--text-faint)',
                                    cursor: 'help',
                                }} />
                            </Tooltip>
                        )}
                    </div>
                    <span style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-body)',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {value} {unit}
                    </span>
                </div>
            )}

            {/* Track */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: 10,
                borderRadius: 999,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
            }}>
                {/* Fill */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, var(--accent), var(--teal))',
                    boxShadow: '0 0 10px var(--accent-glow)',
                    transition: 'width 0.15s ease-out',
                    pointerEvents: 'none',
                }} />

                {/* Hidden native range (handles interaction) */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 10,
                        margin: 0,
                        padding: 0,
                    }}
                />

                {/* Thumb */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: `calc(${percentage}% - 10px)`,
                    transform: 'translateY(-50%)',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: '2.5px solid var(--accent)',
                    boxShadow: '0 4px 12px var(--accent-glow), 0 2px 4px rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                    transition: 'left 0.1s ease-out',
                }} />
            </div>
        </div>
    );
};

export default Slider;
