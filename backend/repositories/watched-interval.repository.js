const db = require("../config/db.config");
const WatchedInterval = require("../models/watched-interval.model");

class WatchedIntervalRepository {
  async findByUserAndVideo(userId, videoId) {
    try {
      const result = await db.query(
        "SELECT * FROM watched_intervals WHERE user_id = $1 AND video_id = $2 ORDER BY start_time",
        [userId, videoId]
      );

      return result.rows.map(
        (interval) =>
          new WatchedInterval(
            interval.id,
            interval.user_id,
            interval.video_id,
            interval.start_time,
            interval.end_time
          )
      );
    } catch (error) {
      console.error("Error in findByUserAndVideo:", error);
      throw error;
    }
  }

  async create(userId, videoId, startTime, endTime) {
    try {
      const result = await db.query(
        "INSERT INTO watched_intervals (user_id, video_id, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING id",
        [userId, videoId, startTime, endTime]
      );
      return new WatchedInterval(
        result.rows[0].id,
        userId,
        videoId,
        startTime,
        endTime
      );
    } catch (error) {
      console.error("Error in create watched interval:", error);
      throw error;
    }
  }

  async update(intervalId, startTime, endTime) {
    try {
      await db.query(
        "UPDATE watched_intervals SET start_time = $1, end_time = $2 WHERE id = $3",
        [startTime, endTime, intervalId]
      );

      return new WatchedInterval(
        intervalId,
        null, // We don't need userId here as it's not changing
        null, // We don't need videoId here as it's not changing
        startTime,
        endTime
      );
    } catch (error) {
      console.error("Error in update watched interval:", error);
      throw error;
    }
  }
}

module.exports = new WatchedIntervalRepository();
