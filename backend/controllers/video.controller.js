const videoService = require('../services/video.service');

class VideoController {
  async getAllVideos(req, res) {
    try {
      const videos = await videoService.getAllVideos();
      return res.status(200).json(videos);
    } catch (error) {
      console.error('Error in getAllVideos controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getVideoById(req, res) {
    try {
      const videoId = parseInt(req.params.id);
      
      if (isNaN(videoId)) {
        return res.status(400).json({ message: 'Invalid video ID' });
      }
      
      const video = await videoService.getVideoById(videoId);
      
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      return res.status(200).json(video);
    } catch (error) {
      console.error('Error in getVideoById controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async saveWatchedInterval(req, res) {
    try {
      const { videoId, startTime, endTime } = req.body;
      const userId = req.user.id;
      
      if (!videoId || startTime === undefined || endTime === undefined) {
        return res.status(400).json({ message: 'VideoId, startTime, and endTime are required' });
      }
      
      if (isNaN(videoId) || isNaN(startTime) || isNaN(endTime)) {
        return res.status(400).json({ message: 'VideoId, startTime, and endTime must be numbers' });
      }
      
      const result = await videoService.saveWatchedInterval(userId, videoId, startTime, endTime);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in saveWatchedInterval controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getVideoProgress(req, res) {
    try {
      const videoId = parseInt(req.query.videoId);
      const userId = req.user.id;
      
      if (isNaN(videoId)) {
        return res.status(400).json({ message: 'Invalid video ID' });
      }
      
      const result = await videoService.getVideoProgress(userId, videoId);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getVideoProgress controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new VideoController();
