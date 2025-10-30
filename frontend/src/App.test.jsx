import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock Auth0 provider
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
  }),
  Auth0Provider: ({ children }) => children,
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/" }),
  Link: ({ children }) => children,
  Navigate: ({ to }) => <div>Navigate to {to}</div>,
}));

test("renders welcome message", () => {
  render(<App />);
  expect(screen.getByText(/welcome to notepad/i)).toBeInTheDocument();
});
