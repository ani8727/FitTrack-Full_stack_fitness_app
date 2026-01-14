import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * ProtectedRoute Component
 * Protects routes from unauthorized access
 * Redirects to home if not authenticated
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check for required role if specified
  if (requiredRole) {
    const roles = user?.['https://fitness-app/roles'] || 
                  user?.roles || 
                  user?.['fitness_auth/roles'] || 
                  [];
    
    const hasRole = Array.isArray(roles) && 
                    (roles.includes(requiredRole) || 
                     roles.includes(requiredRole.toLowerCase()));

    if (!hasRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const isAdmin = roles.includes('admin') || roles.includes('ADMIN');
      return <Navigate to={isAdmin ? "/admin-dashboard" : "/user-dashboard"} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
