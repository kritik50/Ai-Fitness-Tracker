export default function ProgressBar({ value, max = 100, className = '' }: { value: number; max?: number; className?: string; }) {

    const percentage = Math.min(Math.round((value / max) * 100), 100);
    const isOverLimit = value > max;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="w-full rounded-full overflow-hidden h-3" style={{
                background: 'rgba(148, 163, 184, 0.12)',
            }}>
                <div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                        width: `${percentage}%`,
                        background: isOverLimit
                            ? 'linear-gradient(90deg, #f43f5e, #ef4444)'
                            : 'linear-gradient(90deg, #059669, #10b981, #06d6a0)',
                        boxShadow: isOverLimit
                            ? '0 0 12px rgba(244, 63, 94, 0.3)'
                            : '0 0 12px rgba(16, 185, 129, 0.3)',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        animation: 'progressFill 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {/* Shimmer overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 3s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
