const db = require('../config/db.config');
const WatchedInterval = require('../models/watched-interval.model');

class WatchedIntervalRepository {
  async findByUserAndVideo(userId, videoId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM watched_intervals WHERE user_id = ? AND video_id = ? ORDER BY start_time',
        [userId, videoId]
      );
      
      return rows.map(interval => new WatchedInterval(
        interval.id,
        interval.user_id,
        interval.video_id,
        interval.start_time,
        interval.end_time
      ));
    } catch (error) {
      console.error('Error in findByUserAndVideo:', error);
      throw error;
    }
  }

  async create(userId, videoId, startTime, endTime) {
    try {
      const [result] = await db.execute(
        'INSERT INTO watched_intervals (user_id, video_id, start_time, end_time) VALUES (?, ?, ?, ?)',
        [userId, videoId, startTime, endTime]
      );
      
      return new WatchedInterval(
        result.insertId,
        userId,
        videoId,
        startTime,
        endTime
      );
    } catch (error) {
      console.error('Error in create watched interval:', error);
      throw error;
    }
  }
}

module.exports = new WatchedIntervalRepository();
