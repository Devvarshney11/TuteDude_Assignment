const db = require("../config/db.config");
const VideoProgress = require("../models/video-progress.model");

class VideoProgressRepository {
  async findByUserAndVideo(userId, videoId) {
    try {
      const result = await db.query(
        "SELECT * FROM video_progress WHERE user_id = $1 AND video_id = $2",
        [userId, videoId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const progress = result.rows[0];
      return new VideoProgress(
        progress.user_id,
        progress.video_id,
        progress.unique_seconds_watched,
        progress.last_position
      );
    } catch (error) {
      console.error("Error in findByUserAndVideo progress:", error);
      throw error;
    }
  }

  async createOrUpdate(userId, videoId, uniqueSecondsWatched, lastPosition) {
    try {
      await db.query(
        `INSERT INTO video_progress
         (user_id, video_id, unique_seconds_watched, last_position)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, video_id)
         DO UPDATE SET
         unique_seconds_watched = $3,
         last_position = $4`,
        [userId, videoId, uniqueSecondsWatched, lastPosition]
      );

      return new VideoProgress(
        userId,
        videoId,
        uniqueSecondsWatched,
        lastPosition
      );
    } catch (error) {
      console.error("Error in createOrUpdate progress:", error);
      throw error;
    }
  }
}

module.exports = new VideoProgressRepository();
