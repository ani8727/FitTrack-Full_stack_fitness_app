import React from 'react';

/**
 * Modal Component with backdrop and animations
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div 
        className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-4 w-full ${sizes[size]} animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Tabs Component
 */
export const Tabs = ({ tabs, activeTab, onChange, variant = 'line' }) => {
  const variants = {
    line: 'border-b border-neutral-200 dark:border-neutral-700',
    pills: 'bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg'
  };

  const activeStyles = {
    line: 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400',
    pills: 'bg-white dark:bg-neutral-700 shadow-sm'
  };

  const inactiveStyles = {
    line: 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200',
    pills: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
  };

  return (
    <div className={`flex ${variants[variant]}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-2.5 font-medium text-sm transition-all duration-200
            ${variant === 'pills' ? 'rounded-md' : ''}
            ${activeTab === tab.id ? activeStyles[variant] : inactiveStyles[variant]}
          `}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Dropdown Menu Component
 */
export const Dropdown = ({ 
  trigger, 
  items, 
  position = 'bottom-left',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positions = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2'
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 min-w-[200px] ${positions[position]} animate-fade-in-down`}>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-elevation-3 border border-neutral-200 dark:border-neutral-700 py-1">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider ? (
                  <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    disabled={item.disabled}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm
                      flex items-center gap-3
                      ${item.danger 
                        ? 'text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950' 
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-150
                    `}
                  >
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Alert Component
 */
export const Alert = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = ''
}) => {
  const variants = {
    info: 'bg-primary-50 border-primary-200 text-primary-900 dark:bg-primary-950 dark:border-primary-800 dark:text-primary-100',
    success: 'bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-800 dark:text-success-100',
    warning: 'bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-100',
    danger: 'bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-100'
  };

  const iconColors = {
    info: 'text-primary-600 dark:text-primary-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    danger: 'text-danger-600 dark:text-danger-400'
  };

  return (
    <div className={`rounded-lg border-l-4 p-4 ${variants[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`flex-shrink-0 ${iconColors[variant]}`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Tooltip Component
 */
export const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 ${positions[position]} animate-fade-in`}>
          <div className="bg-neutral-900 dark:bg-neutral-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  Modal,
  Tabs,
  Dropdown,
  Alert,
  Tooltip
};
