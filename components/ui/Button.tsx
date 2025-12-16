'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none active:translate-y-1 active:border-b-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white border-b-4 border-primary-dark hover:brightness-110',
        secondary: 'bg-surface text-white border-b-4 border-gray-700 hover:brightness-110',
        danger: 'bg-danger text-white border-b-4 border-danger-dark hover:brightness-110',
        success: 'bg-success text-white border-b-4 border-success-dark hover:brightness-110',
        ghost: 'bg-transparent text-white hover:bg-surface/50',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        icon: 'p-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
