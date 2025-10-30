import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { oktaConfig, apiConfig } from "./authConfig";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || "/notes");
  };

  return (
    <Auth0Provider
      domain={oktaConfig.issuer}
      clientId={oktaConfig.clientId}
      authorizationParams={{
        redirect_uri: oktaConfig.redirectUri,
        audience: apiConfig.audience,
        scope: oktaConfig.scopes.join(" "),
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
