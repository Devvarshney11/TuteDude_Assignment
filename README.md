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

### Step 1: Install Dependencies

Install all required dependencies for the project:

```bash
npm run install:all
```

This command will install dependencies for the root project, backend, and frontend.

### Step 2: Database Setup

1. Make sure MySQL is running on port 3306.

2. Create a MySQL database named `lecture_video_tracking`.

3. Update the database credentials in `backend/.env` if needed.

4. Run the SQL scripts in the `sql` directory:
   - First run `schema.sql` to create the database structure
   - Then run `seed.sql` to insert sample data

```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
```

Alternatively, you can use the setup script:

```bash
npm run setup:db
```

### Step 3: Start the Application

Start both the backend and frontend servers:

```bash
npm start
```

This will:

- Start the backend server on http://localhost:5000
- Start the frontend server on http://localhost:3000

### Step 4: Login with Demo User

Once the application is running, you can log in with the demo user:

- **Username**: `testuser`
- **Password**: `password123`

### Step 5: Test Video Tracking

After logging in, you can test the video tracking functionality:

1. Select a video from the list
2. Play the video
3. Skip around to different parts using the video progress bar
4. Pause and resume the video
5. Observe how the progress bar updates to reflect your watched segments
6. Navigate away and return to see that your progress is saved
7. Notice how the video resumes from your last watched position

### Running Backend or Frontend Separately

If you need to run only the backend:

```bash
npm run start:backend
```

If you need to run only the frontend:

```bash
npm run start:frontend
```

### Troubleshooting

If you have trouble logging in, you can reset the user password:

```bash
npm run update:password
```

This ensures that the testuser account exists and has the correct password hash.

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

## How It Works

### Interval Merging Algorithm

The core of this application is the interval merging algorithm that tracks unique video segments watched:

1. When a user watches a video segment, the app records the start and end times
2. These intervals are stored in the database
3. When calculating progress, the app:
   - Retrieves all watched intervals for the user and video
   - Sorts them by start time
   - Merges overlapping intervals to avoid counting the same segment twice
   - Calculates the total unique time watched

For example:

- If a user watches [10-30], then [20-40], then [50-60]
- The merged intervals would be [10-40], [50-60]
- Total unique seconds watched: 40 seconds (not 70 seconds)

### Database Schema

The application uses four main tables:

- `users`: Stores user credentials
- `videos`: Stores video metadata (title, duration, URL)
- `watched_intervals`: Records each segment watched by a user
- `video_progress`: Tracks overall progress and last position for each user/video

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
