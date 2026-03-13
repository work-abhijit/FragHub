import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-lg glass-input px-3 py-2 text-sm text-white placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <span className="text-xs text-red-400">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
