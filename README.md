# NotePad Application

A modern note-taking application with a .NET backend API and React frontend, featuring user authentication and a clean, monochromatic green UI design.

![NotePad App](/frontend/public/notepad-screenshot.png)

## Quick Start for Testing

### Option 1: One-Command Startup (Recommended)

Run the entire application (both backend and frontend) with a single command:

```bash
./run-app
```

This script will:
1. Start the .NET backend API
2. Start the React frontend
3. Open the application in your default browser
4. Handle proper shutdown of both services when terminated

### Option 2: Manual Setup

If you prefer to start the services separately, follow these steps:

#### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v7 or later)

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Restore NuGet packages:

   ```bash
   dotnet restore
   ```

3. Run the .NET Web API:
   ```bash
   dotnet run
   ```
   The API will be available at `https://localhost:7194` and `http://localhost:5194`

#### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The application will open automatically in your browser at `http://localhost:3000`

## Authentication

This application uses Auth0 for authentication. For testing purposes, you can use the following credentials:

- **Email**: test@example.com
- **Password**: Test123!

Or you can register a new account during the login process.

## Features

- **User Authentication**: Secure login/logout functionality
- **Create Notes**: Add new notes with titles and content
- **View Notes**: See all your notes in a responsive grid layout
- **Edit Notes**: Update existing notes
- **Delete Notes**: Remove unwanted notes
- **Responsive Design**: Works on desktop and mobile devices
- **Monochromatic Green Theme**: Clean, professional UI

## Technical Architecture

### Backend (.NET 9.0)

- **API Framework**: ASP.NET Core Web API
- **Authentication**: JWT Bearer with Auth0 integration
- **Project Structure**:
  - `Controllers/`: API endpoints
  - `Models/`: Data models
  - `Auth/`: Authentication configuration

### Frontend (React)

- **UI Framework**: React 19
- **Routing**: React Router v7
- **API Communication**: Axios
- **Authentication**: Auth0 React SDK
- **Styling**: CSS with custom variables for theming

## API Endpoints

| Method | Endpoint          | Description                              | Authentication |
| ------ | ----------------- | ---------------------------------------- | -------------- |
| GET    | `/api/notes`      | Get all notes for the authenticated user | Required       |
| GET    | `/api/notes/{id}` | Get a specific note by ID                | Required       |
| POST   | `/api/notes`      | Create a new note                        | Required       |
| PUT    | `/api/notes/{id}` | Update an existing note                  | Required       |
| DELETE | `/api/notes/{id}` | Delete a note                            | Required       |

## Development Notes

### Environment Configuration

The application is configured to run in a development environment with the following settings:

- Backend API: http://localhost:5194
- Frontend: http://localhost:3000
- CORS is enabled between these origins

### Auth0 Configuration

The application is already configured with Auth0 credentials for testing purposes. In a production environment, you would want to:

1. Create your own Auth0 account
2. Configure a new application
3. Update the Auth0 settings in:
   - `backend/appsettings.json`
   - `frontend/src/auth/authConfig.js`

## Testing

### Backend Tests

```bash
cd backend
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Building for Production

### Backend

```bash
cd backend
dotnet publish -c Release
```

### Frontend

```bash
cd frontend
npm run build
```

### Deployment

After building both the backend and frontend, you can deploy the application to your preferred hosting environment. For local deployment testing, you can use the provided startup script:

```bash
./run-app
```

This script handles starting both the backend and frontend services with proper initialization order and shutdown handling.

## Tech Stack

- **Backend**: .NET 9.0, ASP.NET Core, JWT Authentication
- **Frontend**: React 19, React Router, Auth0 SDK, Axios
- **Development Tools**: VS Code, Git

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Thank you for reviewing my NotePad application! If you have any questions or need further assistance setting it up, please don't hesitate to reach out.
