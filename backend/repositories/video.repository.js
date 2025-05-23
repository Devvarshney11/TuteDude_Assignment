const db = require('../config/db.config');
const Video = require('../models/video.model');

class VideoRepository {
  async findAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM videos');
      
      return rows.map(video => new Video(
        video.id,
        video.title,
        video.duration_seconds,
        video.url
      ));
    } catch (error) {
      console.error('Error in findAll videos:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM videos WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const video = rows[0];
      return new Video(
        video.id,
        video.title,
        video.duration_seconds,
        video.url
      );
    } catch (error) {
      console.error('Error in findById video:', error);
      throw error;
    }
  }

  async create(title, durationSeconds, url) {
    try {
      const [result] = await db.execute(
        'INSERT INTO videos (title, duration_seconds, url) VALUES (?, ?, ?)',
        [title, durationSeconds, url]
      );
      
      return new Video(result.insertId, title, durationSeconds, url);
    } catch (error) {
      console.error('Error in create video:', error);
      throw error;
    }
  }
}

module.exports = new VideoRepository();
