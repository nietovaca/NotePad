import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * AuthCallback component for handling authentication redirects
 * This component is displayed during the authentication callback process
 */
const AuthCallback = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Redirect to notes page when authentication is complete
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/notes');
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="loading" aria-live="polite" aria-busy="true">
      <article>
        <header>
          <h2>Completing Authentication</h2>
        </header>
        <p>Please wait while we complete the authentication process...</p>
        <progress aria-label="Authentication in progress"></progress>
      </article>
    </div>
  );
};

export default AuthCallback;