const db = require('../config/db.config');
const VideoProgress = require('../models/video-progress.model');

class VideoProgressRepository {
  async findByUserAndVideo(userId, videoId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?',
        [userId, videoId]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const progress = rows[0];
      return new VideoProgress(
        progress.user_id,
        progress.video_id,
        progress.unique_seconds_watched,
        progress.last_position
      );
    } catch (error) {
      console.error('Error in findByUserAndVideo progress:', error);
      throw error;
    }
  }

  async createOrUpdate(userId, videoId, uniqueSecondsWatched, lastPosition) {
    try {
      await db.execute(
        `INSERT INTO video_progress 
         (user_id, video_id, unique_seconds_watched, last_position) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         unique_seconds_watched = ?, 
         last_position = ?`,
        [userId, videoId, uniqueSecondsWatched, lastPosition, uniqueSecondsWatched, lastPosition]
      );
      
      return new VideoProgress(
        userId,
        videoId,
        uniqueSecondsWatched,
        lastPosition
      );
    } catch (error) {
      console.error('Error in createOrUpdate progress:', error);
      throw error;
    }
  }
}

module.exports = new VideoProgressRepository();
