import React, { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import Link from '@docusaurus/Link';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode; // Component to show when not authenticated
  allowedRoles?: string[]; // In a more complex system, you might have roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
      <h2>You need to be logged in to access this content</h2>
      <p>Please sign in to continue.</p>
      <Link to="/auth/signin" className="button button--primary">
        Sign In
      </Link>
    </div>
  ),
  allowedRoles = []
}) => {
  const { user, loading } = useAuth();

  // While loading, show a loading indicator
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is not authenticated, show fallback component
  if (!user) {
    return <>{fallback}</>;
  }

  // Check if user has required roles (simplified check - in a real app you'd have roles)
  if (allowedRoles.length > 0) {
    // For now, we don't have roles in our system, but this is where you'd check
    // if the user has the required role to access this route
  }

  // User is authenticated and authorized, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;