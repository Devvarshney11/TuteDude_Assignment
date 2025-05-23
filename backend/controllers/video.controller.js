const videoService = require("../services/video.service");

class VideoController {
  async getAllVideos(req, res) {
    try {
      const videos = await videoService.getAllVideos();
      return res.status(200).json(videos);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getVideoById(req, res) {
    try {
      const videoId = parseInt(req.params.id);

      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }

      const video = await videoService.getVideoById(videoId);

      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      return res.status(200).json(video);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async saveWatchedInterval(req, res) {
    try {
      const { videoId, startTime, endTime, isCompletion } = req.body;
      const userId = req.user.id;

      if (!videoId || startTime === undefined || endTime === undefined) {
        return res
          .status(400)
          .json({ message: "VideoId, startTime, and endTime are required" });
      }

      if (isNaN(videoId) || isNaN(startTime) || isNaN(endTime)) {
        return res
          .status(400)
          .json({ message: "VideoId, startTime, and endTime must be numbers" });
      }

      // Pass the isCompletion flag to the service
      const result = await videoService.saveWatchedInterval(
        userId,
        videoId,
        startTime,
        endTime,
        isCompletion || false
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getVideoProgress(req, res) {
    try {
      const videoId = parseInt(req.query.videoId);
      const userId = req.user.id;

      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }

      const result = await videoService.getVideoProgress(userId, videoId);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new VideoController();
