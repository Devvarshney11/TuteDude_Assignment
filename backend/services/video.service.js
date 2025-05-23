const videoRepository = require('../repositories/video.repository');
const watchedIntervalRepository = require('../repositories/watched-interval.repository');
const videoProgressRepository = require('../repositories/video-progress.repository');

class VideoService {
  async getAllVideos() {
    try {
      return await videoRepository.findAll();
    } catch (error) {
      console.error('Error in getAllVideos service:', error);
      throw error;
    }
  }

  async getVideoById(id) {
    try {
      return await videoRepository.findById(id);
    } catch (error) {
      console.error('Error in getVideoById service:', error);
      throw error;
    }
  }

  async saveWatchedInterval(userId, videoId, startTime, endTime) {
    try {
      // Validate input
      if (startTime >= endTime) {
        return { success: false, message: 'Start time must be less than end time' };
      }

      // Get video to check duration
      const video = await videoRepository.findById(videoId);
      if (!video) {
        return { success: false, message: 'Video not found' };
      }

      // Ensure times are within video duration
      if (endTime > video.durationSeconds) {
        endTime = video.durationSeconds;
      }

      // Save the new interval
      await watchedIntervalRepository.create(userId, videoId, startTime, endTime);

      // Get all intervals for this user and video
      const intervals = await watchedIntervalRepository.findByUserAndVideo(userId, videoId);

      // Merge intervals and calculate unique seconds watched
      const mergedIntervals = this.mergeIntervals(intervals);
      const uniqueSecondsWatched = this.calculateUniqueSecondsWatched(mergedIntervals);
      
      // Calculate progress percentage
      const progressPercentage = Math.round((uniqueSecondsWatched / video.durationSeconds) * 100);

      // Update progress in database
      await videoProgressRepository.createOrUpdate(
        userId,
        videoId,
        uniqueSecondsWatched,
        endTime // Last position is the end time of the current interval
      );

      return {
        success: true,
        uniqueSecondsWatched,
        progressPercentage,
        lastPosition: endTime
      };
    } catch (error) {
      console.error('Error in saveWatchedInterval service:', error);
      throw error;
    }
  }

  async getVideoProgress(userId, videoId) {
    try {
      // Get video to check duration
      const video = await videoRepository.findById(videoId);
      if (!video) {
        return { success: false, message: 'Video not found' };
      }

      // Get progress from database
      const progress = await videoProgressRepository.findByUserAndVideo(userId, videoId);
      
      if (!progress) {
        return {
          success: true,
          uniqueSecondsWatched: 0,
          progressPercentage: 0,
          lastPosition: 0
        };
      }

      // Calculate progress percentage
      const progressPercentage = Math.round((progress.uniqueSecondsWatched / video.durationSeconds) * 100);

      return {
        success: true,
        uniqueSecondsWatched: progress.uniqueSecondsWatched,
        progressPercentage,
        lastPosition: progress.lastPosition
      };
    } catch (error) {
      console.error('Error in getVideoProgress service:', error);
      throw error;
    }
  }

  // Helper method to merge overlapping intervals
  mergeIntervals(intervals) {
    if (intervals.length === 0) return [];

    // Sort intervals by start time
    const sortedIntervals = [...intervals].sort((a, b) => a.startTime - b.startTime);
    
    const result = [sortedIntervals[0]];
    
    for (let i = 1; i < sortedIntervals.length; i++) {
      const current = sortedIntervals[i];
      const lastMerged = result[result.length - 1];
      
      // If current interval overlaps with the last merged interval, merge them
      if (current.startTime <= lastMerged.endTime) {
        lastMerged.endTime = Math.max(lastMerged.endTime, current.endTime);
      } else {
        // Otherwise, add the current interval to the result
        result.push(current);
      }
    }
    
    return result;
  }

  // Helper method to calculate total unique seconds watched
  calculateUniqueSecondsWatched(mergedIntervals) {
    return mergedIntervals.reduce((total, interval) => {
      return total + (interval.endTime - interval.startTime);
    }, 0);
  }
}

module.exports = new VideoService();
