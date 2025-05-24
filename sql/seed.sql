INSERT INTO users (username, password_hash)
VALUES ('testuser', '$2b$10$ZS.c.hesEnsZG2gel4xVbeHJIWulZLUFvlnOa.VNZICaam0cSUjfe');

-- Insert sample videos
INSERT INTO videos (title, duration_seconds, url)
VALUES
('Introduction to JavaScript', 596, 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),
('Advanced React Hooks', 653, 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'),
('Node.js Fundamentals', 15, 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'),
('CSS Animations Workshop', 15, 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'),
('Web Security Basics', 60, 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'),
('Responsive Design Patterns', 15, 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'),
('TypeScript for Beginners', 15, 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'),
('GraphQL API Development', 887, 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'),
('Docker Containerization', 594, 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'),
('AWS Cloud Services', 734, 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
