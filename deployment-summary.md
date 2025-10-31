# NotePad Deployment

## URLs
- Frontend: https://notepad-web.fly.dev/
- Backend: https://notepad-api.fly.dev/

## OKTA Setup
Login to OKTA at https://dev-vwes00hgwyh760q0.us.auth0.com/ and add:
- Redirect URI: https://notepad-web.fly.dev/callback
- Allowed Origin: https://notepad-web.fly.dev

## Commands
- Deploy backend: `cd backend && flyctl deploy`
- Deploy frontend: `cd frontend && flyctl deploy`
- View logs: `flyctl logs -a notepad-api`
