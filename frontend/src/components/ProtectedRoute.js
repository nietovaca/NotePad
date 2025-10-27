import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  
  console.log("ProtectedRoute - Auth state:", { isAuthenticated, isLoading, user });

  if (isLoading) {
    console.log("ProtectedRoute - Still loading auth state");
    return <div>Loading authentication...</div>;
  }
  
  if (!isAuthenticated) {
    console.log("ProtectedRoute - User not authenticated, redirecting to home");
    return <Navigate to="/" />;
  }
  
  console.log("ProtectedRoute - User authenticated, rendering children");
  return children;
};

export default ProtectedRoute;
