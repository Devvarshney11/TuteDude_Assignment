const db = require("../config/db.config");
const Video = require("../models/video.model");

class VideoRepository {
  async findAll() {
    try {
      const result = await db.query("SELECT * FROM videos");

      return result.rows.map(
        (video) =>
          new Video(video.id, video.title, video.duration_seconds, video.url)
      );
    } catch (error) {
      console.error("Error in findAll videos:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const result = await db.query("SELECT * FROM videos WHERE id = $1", [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const video = result.rows[0];
      return new Video(
        video.id,
        video.title,
        video.duration_seconds,
        video.url
      );
    } catch (error) {
      console.error("Error in findById video:", error);
      throw error;
    }
  }

  async create(title, durationSeconds, url) {
    try {
      const result = await db.query(
        "INSERT INTO videos (title, duration_seconds, url) VALUES ($1, $2, $3) RETURNING id",
        [title, durationSeconds, url]
      );

      return new Video(result.rows[0].id, title, durationSeconds, url);
    } catch (error) {
      console.error("Error in create video:", error);
      throw error;
    }
  }
}

module.exports = new VideoRepository();
