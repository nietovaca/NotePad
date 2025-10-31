export const oktaConfig = {
  clientId: "X4gb6oKKDGlGLzBIXJIm3wHFe7TfzUVX",
  issuer: "https://dev-vwes00hgwyh760q0.us.auth0.com",
  redirectUri: window.location.origin + "/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
};

export const apiConfig = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? "https://notepad-api.fly.dev"
    : "http://localhost:5194",
  audience: "https://dev-vwes00hgwyh760q0.us.auth0.com/api/v2/",
};
