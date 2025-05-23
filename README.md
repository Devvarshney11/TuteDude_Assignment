# Lecture Video Tracking Platform

A full-stack web application that tracks unique watched segments of lecture videos by users. The app only counts new parts of the video watched, merges overlapping intervals, calculates accurate watch progress, and resumes from the last watched position.

## Features

- **Accurate Progress Tracking**: Only counts unique seconds watched, merges overlapping intervals
- **Resume Playback**: Automatically resumes video from the last saved position
- **JWT Authentication**: Secure user authentication
- **Clean Architecture**: Follows best practices with separation of concerns

## Technology Stack

### Frontend

- React.js with functional components and Hooks
- Tailwind CSS for responsive styling
- Axios for HTTP requests
- React Router for navigation

### Backend

- Node.js with Express.js
- MySQL database
- Clean Code architecture with:
  - Routes (Express route definitions)
  - Controllers (handle requests/responses)
  - Services (business logic like interval merging)
  - Repositories (data access using MySQL)
  - Models (represent DB entities)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)

### Database Setup

1. Make sure MySQL is running on port 3306.

2. Update the database credentials in `backend/.env` if needed.

3. Run the database setup script:

```bash
npm run setup:db
```

This script will create the database, tables, and insert sample data automatically.

### Quick Start

#### Complete Setup (Recommended)

First, run the setup-everything script to set up the database:

For Windows users:

```bash
setup-everything.bat
```

For Linux/Mac users:

```bash
chmod +x setup-everything.sh
./setup-everything.sh
```

This script will:

1. Create the database if it doesn't exist
2. Create all tables if they don't exist
3. Insert the test user with the correct password
4. Insert sample videos

Then, start the application:

For Windows users:

```bash
start.bat
```

For Linux/Mac users:

```bash
chmod +x start.sh
./start.sh
```

The start script will:

1. Install all dependencies
2. Start both the backend and frontend servers

#### Manual Installation

1. Install all dependencies with a single command:

```bash
npm run install:all
```

2. Set up the database:

```bash
npm run setup:db
```

3. Update the user password to ensure login works:

```bash
npm run update:password
```

4. Configure environment variables:

   - The `.env` file in the backend directory already contains default settings
   - Update the database credentials if needed

5. Start the application (both backend and frontend):

```bash
npm start
```

The backend server will run on http://localhost:5000
The frontend will run on http://localhost:3000

### Running Backend or Frontend Separately

If you need to run only the backend:

```bash
npm run start:backend
```

If you need to run only the frontend:

```bash
npm run start:frontend
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login`: Authenticate user, return JWT
- `POST /api/auth/register`: Register a new user

### Video Endpoints

- `GET /api/video`: Get all videos
- `GET /api/video/:id`: Get video by ID
- `POST /api/video/watch`: Save new watched interval
- `GET /api/video/progress?videoId=...`: Return progress % and last position

## Interval Merging Logic

The application uses a standard interval merging algorithm to avoid counting duplicate time:

1. Sort intervals by start time
2. Iterate through intervals, merging overlapping ones
3. Calculate total unique time from merged intervals

Example:

- User watches intervals: [10-30], [20-40], [50-60]
- After merging: [10-40], [50-60]
- Total unique seconds watched: 40 seconds

## Demo User Credentials

- Username: `testuser`
- Password: `password123`

If you have trouble logging in, you can use one of these scripts:

1. Run the `fix-login.bat` script to reset the user password directly in the database:

```bash
fix-login.bat
```

2. Run the `test-login.bat` script to test the login functionality and update the password if needed:

```bash
test-login.bat
```

These scripts will ensure that the testuser account exists and has the correct password hash for 'password123'.

## Project Structure

```
/backend
  /controllers
  /services
  /routes
  /repositories
  /models
  /middleware
  /config
  server.js

/frontend
  /src
    /components
    /context
    /pages
    /services
    App.jsx
    main.jsx

/sql
  schema.sql
  seed.sql
```
