import * as React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full relative">
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            'flex h-10 w-full rounded-lg glass-input px-3 py-2 text-sm text-white placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-dark-800/50',
                            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50',
                            className
                        )}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value} className="bg-dark-800 text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {error && <span className="text-xs text-red-400">{error}</span>}
            </div>
        );
    }
);
Select.displayName = 'Select';
