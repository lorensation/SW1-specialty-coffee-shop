import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Redirects to account page if user is not logged in
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: 'var(--muted)'
      }}>
        Cargando...
      </div>
    );
  }

  // If not authenticated, redirect to account page
  if (!user) {
    return <Navigate to="/account" replace />;
  }

  // If authenticated, render the protected content
  return children;
}
