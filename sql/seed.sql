-- Use the database
USE lecture_video_tracking;

-- Insert demo user (password: password123)
-- The password hash is generated using bcrypt with 10 rounds
INSERT INTO users (username, password_hash)
VALUES ('testuser', '$2b$10$ZS.c.hesEnsZG2gel4xVbeHJIWulZLUFvlnOa.VNZICaam0cSUjfe');

-- Insert sample videos
INSERT INTO videos (title, duration_seconds, url)
VALUES
('Introduction to JavaScript', 600, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),
('Advanced React Hooks', 900, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'),
('Node.js Fundamentals', 1200, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
