# PostgreSQL Migration Guide

This document outlines the migration from MySQL to PostgreSQL for the Learning Vista video tracking application.

## Changes Made

### 1. Package Dependencies
- **Removed**: `mysql2` package
- **Added**: `pg` (PostgreSQL driver) package
- **File**: `backend/package.json`

### 2. Database Configuration
- **File**: `backend/config/db.config.js`
- **Changes**:
  - Replaced `mysql2/promise` with `pg` Pool
  - Updated connection configuration for PostgreSQL
  - Changed default port from 3306 to 5432
  - Updated connection testing method

### 3. SQL Schema Migration
- **File**: `sql/schema.sql`
- **Changes**:
  - Replaced `AUTO_INCREMENT` with `SERIAL`
  - Changed `INT` to `INTEGER`
  - Changed `FLOAT` to `REAL`
  - Removed MySQL-specific `USE database` syntax
  - Added PostgreSQL trigger for `updated_at` column automation
  - Updated comments for PostgreSQL connection syntax

### 4. Repository Layer Updates
All repository files were updated to use PostgreSQL syntax:

#### `backend/repositories/user.repository.js`
- Changed `db.execute()` to `db.query()`
- Updated parameter placeholders from `?` to `$1, $2, etc.`
- Changed `result.insertId` to `result.rows[0].id` with `RETURNING id`
- Updated result handling from `[rows]` to `result.rows`

#### `backend/repositories/video.repository.js`
- Same changes as user repository
- Updated all SQL queries to PostgreSQL syntax

#### `backend/repositories/watched-interval.repository.js`
- Same changes as above repositories
- Updated interval creation and update queries

#### `backend/repositories/video-progress.repository.js`
- Changed `ON DUPLICATE KEY UPDATE` to `ON CONFLICT ... DO UPDATE SET`
- Updated parameter placeholders and result handling
- Simplified parameter array (removed duplicate parameters)

### 5. Environment Configuration
- **File**: `backend/.env`
- **Changes**:
  - Updated default database host to `localhost`
  - Changed port from 3306 to 5432
  - Updated default username to `postgres`
  - Changed database name to match PostgreSQL conventions

### 6. Server Configuration
- **File**: `backend/server.js`
- **Changes**:
  - Updated default port in console log from 3306 to 5432

### 7. Documentation Updates
- **File**: `README.md`
- **Changes**:
  - Updated all references from MySQL to PostgreSQL
  - Changed setup instructions for PostgreSQL
  - Updated SQL command examples (`mysql` → `psql`)
  - Added detailed environment variable configuration
  - Updated prerequisites section

- **File**: `package.json`
- **Changes**:
  - Updated keywords from "mysql" to "postgresql"

### 8. Seed Data Migration
- **File**: `sql/seed.sql`
- **Changes**:
  - Removed MySQL-specific `USE database` syntax
  - Added PostgreSQL connection comments

## Key Differences: MySQL vs PostgreSQL

### Syntax Changes
| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Auto Increment | `AUTO_INCREMENT` | `SERIAL` |
| Parameter Placeholders | `?` | `$1, $2, $3...` |
| Upsert | `ON DUPLICATE KEY UPDATE` | `ON CONFLICT ... DO UPDATE SET` |
| Data Types | `INT`, `FLOAT` | `INTEGER`, `REAL` |
| Database Selection | `USE database` | `\c database` |
| Result Access | `[rows]` destructuring | `result.rows` |
| Insert ID | `result.insertId` | `RETURNING id` clause |

### Connection Differences
- **MySQL**: Uses `mysql2/promise` with `createPool()`
- **PostgreSQL**: Uses `pg` with `new Pool()`
- **Methods**: `execute()` → `query()`

## Setup Instructions for PostgreSQL

### 1. Install PostgreSQL
Make sure PostgreSQL is installed and running on your system.

### 2. Create Database
```sql
CREATE DATABASE lecture_video_tracking;
```

### 3. Update Environment Variables
Update `backend/.env` with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=lecture_video_tracking
```

### 4. Run Schema and Seed Scripts
```bash
# Connect to PostgreSQL and create tables
psql -U postgres -d lecture_video_tracking -f sql/schema.sql

# Insert sample data
psql -U postgres -d lecture_video_tracking -f sql/seed.sql
```

### 5. Install Dependencies
```bash
cd backend
npm install
```

### 6. Start the Application
```bash
npm start
```

## Testing the Migration

1. **Database Connection**: Check that the application connects successfully to PostgreSQL
2. **User Authentication**: Test login with the demo user (`testuser` / `password123`)
3. **Video Listing**: Verify that videos are loaded from the database
4. **Progress Tracking**: Test video watching and progress saving
5. **Interval Merging**: Verify that watched intervals are properly merged

## Troubleshooting

### Common Issues
1. **Connection Refused**: Ensure PostgreSQL is running and accessible
2. **Authentication Failed**: Check username/password in `.env` file
3. **Database Not Found**: Make sure the database exists
4. **Permission Denied**: Ensure the user has proper database permissions

### Verification Queries
```sql
-- Check if tables exist
\dt

-- Verify sample data
SELECT * FROM users;
SELECT * FROM videos;
SELECT COUNT(*) FROM videos;
```

## Benefits of PostgreSQL Migration

1. **Better Performance**: PostgreSQL generally offers better performance for complex queries
2. **Advanced Features**: Support for JSON, arrays, and advanced data types
3. **ACID Compliance**: Better transaction handling and data integrity
4. **Extensibility**: Rich ecosystem of extensions
5. **Open Source**: Completely free and open source
6. **Cloud Hosting**: Easier to host on cloud platforms like Heroku, AWS RDS, etc.

The migration maintains all existing functionality while providing a more robust and scalable database foundation.
