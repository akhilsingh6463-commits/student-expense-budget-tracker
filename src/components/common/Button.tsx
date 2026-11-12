import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const variantStyles = {
    primary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus:ring-slate-900',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400',
    outline:
      'border border-slate-200 hover:bg-slate-50 text-slate-700 focus:ring-slate-300',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus:ring-emerald-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 gap-2',
    lg: 'text-sm sm:text-base px-4 py-2.5 gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};

