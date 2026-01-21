import React from 'react';
import { Skeleton } from './UIComponents';

/**
 * Page Loader - Full page loading state
 */
export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 font-medium">Loading...</p>
      </div>
    </div>
  );
};

/**
 * Card Skeleton - Loading state for cards
 */
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-soft border border-neutral-200 dark:border-neutral-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="w-12 h-12" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Table Skeleton - Loading state for tables
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Dashboard Skeleton - Loading state for dashboard
 */
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-soft border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton variant="circular" className="w-12 h-12" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardSkeleton count={2} />
        </div>
        <div>
          <CardSkeleton count={2} />
        </div>
      </div>
    </div>
  );
};

/**
 * List Item Skeleton - Loading state for list items
 */
export const ListItemSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};

/**
 * Spinner - Simple loading spinner
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className={`${sizes[size]} border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin ${className}`}></div>
  );
};

/**
 * Button Loader - Loading state for buttons
 */
export const ButtonLoader = () => {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

/**
 * Pulse Loader - Pulsing dots loader
 */
export const PulseLoader = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

/**
 * Overlay Loader - Loading overlay
 */
export const OverlayLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-elevation-4 text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-neutral-900 dark:text-neutral-100 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default {
  PageLoader,
  CardSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  ListItemSkeleton,
  Spinner,
  ButtonLoader,
  PulseLoader,
  OverlayLoader
};
