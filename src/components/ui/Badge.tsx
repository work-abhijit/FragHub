import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-dark-700 text-slate-200 border-white/10',
            success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            danger: 'bg-red-500/20 text-red-400 border-red-500/30',
            info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';
