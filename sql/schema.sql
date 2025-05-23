-- Create database
CREATE DATABASE IF NOT EXISTS lecture_video_tracking;

-- Use the database
USE lecture_video_tracking;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Videos table
CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration_seconds INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create WatchedIntervals table
CREATE TABLE IF NOT EXISTS watched_intervals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  video_id INT NOT NULL,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Create VideoProgress table
CREATE TABLE IF NOT EXISTS video_progress (
  user_id INT NOT NULL,
  video_id INT NOT NULL,
  unique_seconds_watched FLOAT NOT NULL DEFAULT 0,
  last_position FLOAT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, video_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);
