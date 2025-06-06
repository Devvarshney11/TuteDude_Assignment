# Learning Vista

A full-stack web application that tracks unique watched segments of lecture videos by users. The app only counts new parts of the video watched, merges overlapping intervals, calculates accurate watch progress, and resumes from the last watched position.

## Live Demo

🌐 **Frontend**: [https://tute-dude-assignment-tau.vercel.app/](https://tute-dude-assignment-tau.vercel.app/)

🚀 **Backend API**: [https://tutedude-assignment-mc91.onrender.com](https://tutedude-assignment-mc91.onrender.com)

🗄️ **Database**: Hosted on Neon PostgreSQL

### Demo Credentials

- **Username**: `testuser`
- **Password**: `password123`

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
- **Deployed on**: Vercel

### Backend

- Node.js with Express.js
- PostgreSQL database
- Clean Code architecture with:
  - Routes (Express route definitions)
  - Controllers (handle requests/responses)
  - Services (business logic like interval merging)
  - Repositories (data access using PostgreSQL)
  - Models (represent DB entities)
- **Deployed on**: Render

### Database

- **PostgreSQL** hosted on **Neon**
- Fully managed cloud database with automatic backups
- Optimized for serverless applications

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Step 1: Install Dependencies

Install all required dependencies for the project:

```bash
npm run install:all
```

This command will install dependencies for the root project, backend, and frontend.

### Step 2: Database Setup

1. Make sure PostgreSQL is running on port 5432.

2. Create a PostgreSQL database named `lecture_video_tracking`.

3. Update the database credentials in `backend/.env` with your PostgreSQL connection details:

   **Option A: Using Connection String (Recommended for cloud databases)**

   ```env
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   ```

   **Option B: Using Individual Parameters**

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=lecture_video_tracking
   ```

   **Note**: If you provide `DATABASE_URL`, the individual DB\_\* parameters will be ignored.

4. Run the SQL scripts in the `sql` directory:
   - First run `schema.sql` to create the database structure
   - Then run `seed.sql` to insert sample data

```bash
psql -U postgres -d lecture_video_tracking -f sql/schema.sql
psql -U postgres -d lecture_video_tracking -f sql/seed.sql
```

Or using psql interactive mode:

```bash
psql -U postgres
\c lecture_video_tracking
\i sql/schema.sql
\i sql/seed.sql
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

## Deployment

The application is deployed across multiple cloud platforms for optimal performance and reliability:

### Frontend Deployment (Vercel)

- **Platform**: Vercel
- **URL**: [https://tute-dude-assignment-tau.vercel.app/](https://tute-dude-assignment-tau.vercel.app/)
- **Features**:
  - Automatic deployments from Git
  - Global CDN for fast loading
  - Optimized for React applications

### Backend Deployment (Render)

- **Platform**: Render
- **URL**: [https://tutedude-assignment-mc91.onrender.com](https://tutedude-assignment-mc91.onrender.com)
- **Features**:
  - Automatic deployments from Git
  - Built-in SSL certificates
  - Environment variable management

### Database Hosting (Neon PostgreSQL)

- **Platform**: Neon
- **Type**: Serverless PostgreSQL
- **Features**:
  - Automatic scaling
  - Built-in connection pooling
  - Branching for development workflows
  - Automatic backups

### Environment Configuration

The deployed application uses the following environment variables:

**Frontend (.env)**:

```env
VITE_API_URL=https://tutedude-assignment-mc91.onrender.com
```

**Backend (.env)**:

```env
DATABASE_URL=postgresql://[username]:[password]@[host]/[database]
JWT_SECRET=[secure-jwt-secret]
PORT=5000
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

## Design Documentation

### How We Track Watched Intervals

The core of this application is the interval tracking and merging system that accurately measures unique video segments watched:

1. **Real-time Tracking**:

   - When a user plays a video, the frontend creates an interval object with start and end times
   - As the user continues watching, the end time is continuously updated
   - When the user pauses, seeks, or leaves the page, the interval is sent to the backend

2. **Interval Storage**:

   - Each watched interval is stored in the database with user ID, video ID, start time, and end time
   - This creates a complete history of viewing patterns for analytics and accurate progress calculation

3. **Optimization Techniques**:
   - For continuous playback, we extend existing intervals rather than creating new ones
   - We use a small tolerance (EPSILON = 0.1s) to account for timing inconsistencies
   - Large intervals (>60s) are treated as skips and only count a small portion to prevent counting unwatched content

### Interval Merging Algorithm

To calculate accurate progress, we merge overlapping intervals to avoid counting the same segment twice:

1. **Sorting**: All intervals are sorted by start time
2. **Merging Process**:
   - Start with the first interval in the result list
   - For each subsequent interval:
     - If it overlaps with the last merged interval (current.startTime <= lastMerged.endTime + EPSILON), merge them by taking the maximum end time
     - If there's a gap, add it as a new interval
3. **Progress Calculation**:
   - Sum the durations of all merged intervals
   - Divide by the total video duration to get the progress percentage

**Example**:

- User watches intervals: [10-30], [20-40], [50-60]
- After sorting and merging: [10-40], [50-60]
- Total unique seconds watched: 40 seconds (not 70 seconds)
- If video is 100 seconds long, progress is 40%

### Database Schema

The application uses four main tables:

- `users`: Stores user credentials
- `videos`: Stores video metadata (title, duration, URL)
- `watched_intervals`: Records each segment watched by a user
- `video_progress`: Tracks overall progress and last position for each user/video

### Challenges and Solutions

During the development of Learning Vista, we encountered several challenges related to accurate video tracking:

1. **Handling Video Skips**:

   - **Challenge**: Users often skip through videos, which could falsely count unwatched sections.
   - **Solution**: We implemented a maximum interval length (60 seconds) to detect skips. When a large interval is detected, we only count a small portion at the end, preventing inflation of watch time.

2. **Floating Point Precision Issues**:

   - **Challenge**: JavaScript's floating-point arithmetic caused inconsistencies when comparing video timestamps.
   - **Solution**: We added a small tolerance (EPSILON = 0.1s) when comparing times and rounding timestamps to two decimal places to ensure consistent behavior.

3. **Continuous Progress Updates**:

   - **Challenge**: Sending too many interval updates to the server could overload it, while sending too few would make progress tracking less accurate.
   - **Solution**: We implemented a balanced approach with:
     - Real-time updates every 2 seconds during playback
     - Immediate updates on pause, seek, and page leave events
     - Interval extension for continuous playback to reduce database entries

4. **Completion Detection**:

   - **Challenge**: Determining when a video is truly "complete" is difficult, especially with non-linear viewing patterns.
   - **Solution**: We implemented a dual approach:
     - A video is marked as complete when the user has watched at least 95% of the content through tracked intervals
     - A special completion marker is used that doesn't affect the resume position
     - This prevents users from having to rewatch content they've already seen

5. **Resume Position Accuracy**:
   - **Challenge**: Determining the optimal position to resume playback from.
   - **Solution**: We store the last position separately from the watched intervals, ensuring users can resume from exactly where they left off, even if that position is in the middle of a merged interval.

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
