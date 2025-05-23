const db = require("../config/db.config");
const WatchedInterval = require("../models/watched-interval.model");

class WatchedIntervalRepository {
  async findByUserAndVideo(userId, videoId) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM watched_intervals WHERE user_id = ? AND video_id = ? ORDER BY start_time",
        [userId, videoId]
      );

      return rows.map(
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
      const [result] = await db.execute(
        "INSERT INTO watched_intervals (user_id, video_id, start_time, end_time) VALUES (?, ?, ?, ?)",
        [userId, videoId, startTime, endTime]
      );

      console.log(
        `Created new interval with ID ${result.insertId}: [${startTime}, ${endTime}]`
      );

      return new WatchedInterval(
        result.insertId,
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
      console.log(
        `Updating interval ${intervalId} to [${startTime}, ${endTime}]`
      );

      await db.execute(
        "UPDATE watched_intervals SET start_time = ?, end_time = ? WHERE id = ?",
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
