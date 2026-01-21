import React from 'react';

/**
 * Modern Card Component with glassmorphism effect
 */
export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  glow = false,
  ...props 
}) => {
  const variants = {
    default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
    glass: 'bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border border-white/20 dark:border-neutral-700/20',
    elevated: 'bg-white dark:bg-neutral-800 shadow-elevation-2 dark:shadow-none border-0',
    outline: 'bg-transparent border-2 border-neutral-200 dark:border-neutral-700'
  };

  const hoverEffect = hover ? 'transition-all duration-300 hover:shadow-elevation-3 hover:-translate-y-1' : '';
  const glowEffect = glow ? 'hover:shadow-glow' : '';

  return (
    <div 
      className={`rounded-xl ${variants[variant]} ${hoverEffect} ${glowEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Button Component with multiple variants
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md disabled:bg-primary-300',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm hover:shadow-md disabled:bg-secondary-300',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 disabled:border-primary-300 disabled:text-primary-300',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 disabled:text-primary-300',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-sm hover:shadow-md disabled:bg-danger-300',
    success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-md disabled:bg-success-300'
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-lg'
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-lg
        transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]} ${sizes[size]} ${width} ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </button>
  );
};

/**
 * Input Component with modern styling
 */
export const Input = ({
  label,
  error,
  icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white dark:bg-neutral-800
            border-2 border-neutral-200 dark:border-neutral-700
            text-neutral-900 dark:text-neutral-100
            placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger-500 focus:ring-danger-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
      )}
    </div>
  );
};

/**
 * Badge Component
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
    success: 'bg-success-100 text-success-700 dark:bg-success-950 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-950 dark:text-warning-300',
    danger: 'bg-danger-100 text-danger-700 dark:bg-danger-950 dark:text-danger-300',
    secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
      {children}
    </span>
  );
};

/**
 * Skeleton Loader Component
 */
export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  return (
    <div 
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 ${variants[variant]} ${className}`}
    />
  );
};

/**
 * Avatar Component
 */
export const Avatar = ({
  src,
  alt = '',
  size = 'md',
  fallback,
  status,
  className = ''
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-neutral-400',
    busy: 'bg-danger-500',
    away: 'bg-warning-500'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover border-2 border-white dark:border-neutral-800`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold border-2 border-white dark:border-neutral-800`}>
          {fallback}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-800 ${statusColors[status]}`}></span>
      )}
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const Progress = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const percentage = (value / max) * 100;

  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm font-medium">
          <span className="text-neutral-700 dark:text-neutral-300">Progress</span>
          <span className="text-neutral-700 dark:text-neutral-300">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Divider Component
 */
export const Divider = ({ 
  orientation = 'horizontal', 
  className = '',
  children 
}) => {
  if (children) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">{children}</span>
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
      </div>
    );
  }

  return orientation === 'horizontal' ? (
    <hr className={`border-neutral-200 dark:border-neutral-700 ${className}`} />
  ) : (
    <div className={`w-px bg-neutral-200 dark:bg-neutral-700 ${className}`}></div>
  );
};

export default {
  Card,
  Button,
  Input,
  Badge,
  Skeleton,
  Avatar,
  Progress,
  Divider
};
