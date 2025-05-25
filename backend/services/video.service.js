const videoRepository = require("../repositories/video.repository");
const watchedIntervalRepository = require("../repositories/watched-interval.repository");
const videoProgressRepository = require("../repositories/video-progress.repository");

class VideoService {
  async getAllVideos() {
    try {
      return await videoRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getVideoById(id) {
    try {
      return await videoRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async saveWatchedInterval(
    userId,
    videoId,
    startTime,
    endTime,
    isCompletion = false
  ) {
    try {
      // Validate input
      if (startTime >= endTime) {
        return {
          success: false,
          message: "Start time must be less than end time",
        };
      }

      // Get video to check duration
      const video = await videoRepository.findById(videoId);
      if (!video) {
        return { success: false, message: "Video not found" };
      }

      // Ensure times are within video duration
      const originalEndTime = endTime;
      if (endTime > video.durationSeconds) {
        endTime = video.durationSeconds;
      }
      if (startTime < 0) {
        startTime = 0;
      }

      // Check if the interval is too large (potential skip)
      const MAX_INTERVAL_LENGTH = 60; // 60 seconds
      if (endTime - startTime > MAX_INTERVAL_LENGTH) {
        // For large intervals, we'll only count a small portion at the end
        // This prevents counting skipped content
        startTime = Math.max(startTime, endTime - 5);
      }

      // For real-time updates, check if this is an extension of the last interval
      // This optimization reduces the number of intervals stored and improves performance
      const existingIntervals =
        await watchedIntervalRepository.findByUserAndVideo(userId, videoId);

      let shouldCreateNew = true;

      // If we have existing intervals and this appears to be a real-time update
      if (existingIntervals.length > 0) {
        const lastInterval = existingIntervals[existingIntervals.length - 1];

        // If this new interval starts where the last one ended (or very close)
        // and it's from the same viewing session (within the last minute)
        const EPSILON = 0.1; // 100ms tolerance
        const isExtension =
          Math.abs(startTime - lastInterval.startTime) < EPSILON &&
          endTime > lastInterval.endTime;

        if (isExtension) {
          // Update the existing interval instead of creating a new one
          await watchedIntervalRepository.update(
            lastInterval.id,
            lastInterval.startTime,
            endTime
          );

          shouldCreateNew = false;
        }
      }

      // Save as a new interval if needed
      if (shouldCreateNew) {
        await watchedIntervalRepository.create(
          userId,
          videoId,
          startTime,
          endTime
        );
      }

      // Get all intervals for this user and video
      const intervals = await watchedIntervalRepository.findByUserAndVideo(
        userId,
        videoId
      );
      // Merge intervals and calculate unique seconds watched
      const mergedIntervals = this.mergeIntervals(intervals);

      const uniqueSecondsWatched =
        this.calculateUniqueSecondsWatched(mergedIntervals);
      // Calculate progress percentage with a cap at 99% unless truly complete
      let progressPercentage = Math.round(
        (uniqueSecondsWatched / video.durationSeconds) * 100
      );

      // Only allow 100% if we've watched at least 95% of the video
      // or if this is explicitly marked as a completion
      if (
        progressPercentage >= 100 &&
        !isCompletion &&
        uniqueSecondsWatched < video.durationSeconds * 0.95
      ) {
        progressPercentage = 99;
      }
      // For completion markers, we need to get the current progress to preserve the last position
      let lastPosition;

      if (isCompletion) {
        // If this is a completion marker, don't update the last position
        // Instead, get the current progress to preserve the existing last position
        const currentProgress =
          await videoProgressRepository.findByUserAndVideo(userId, videoId);

        if (currentProgress) {
          // Use the existing last position
          lastPosition = currentProgress.lastPosition;
        } else {
          // If no existing progress, use a position near the beginning
          // This avoids starting from the very end when the user returns
          lastPosition = 5; // 5 seconds into the video
        }
      } else {
        // For normal intervals, use the current end time as the last position
        // This ensures we resume from where the user actually stopped watching
        lastPosition = originalEndTime;
      }

      // Update progress in database
      await videoProgressRepository.createOrUpdate(
        userId,
        videoId,
        uniqueSecondsWatched,
        lastPosition
      );

      return {
        success: true,
        uniqueSecondsWatched,
        progressPercentage,
        lastPosition,
      };
    } catch (error) {
      console.error("Error in saveWatchedInterval service:", error);
      throw error;
    }
  }

  async getVideoProgress(userId, videoId) {
    try {
      // Get video to check duration
      const video = await videoRepository.findById(videoId);
      if (!video) {
        return { success: false, message: "Video not found" };
      }

      // Get progress from database
      const progress = await videoProgressRepository.findByUserAndVideo(
        userId,
        videoId
      );

      if (!progress) {
        return {
          success: true,
          uniqueSecondsWatched: 0,
          progressPercentage: 0,
          lastPosition: 0,
        };
      }

      // Calculate progress percentage with the same rules as in saveWatchedInterval
      let progressPercentage = Math.round(
        (progress.uniqueSecondsWatched / video.durationSeconds) * 100
      );

      // Only allow 100% if we've watched at least 95% of the video
      if (
        progressPercentage >= 100 &&
        progress.uniqueSecondsWatched < video.durationSeconds * 0.95
      ) {
        progressPercentage = 99;
      }

      return {
        success: true,
        uniqueSecondsWatched: progress.uniqueSecondsWatched,
        progressPercentage,
        lastPosition: progress.lastPosition,
      };
    } catch (error) {
      console.error("Error in getVideoProgress service:", error);
      throw error;
    }
  }

  // Helper method to merge overlapping intervals
  mergeIntervals(intervals) {
    if (intervals.length === 0) {
      return [];
    }

    // Sort intervals by start time
    const sortedIntervals = [...intervals].sort(
      (a, b) => a.startTime - b.startTime
    );

    // Handle edge case with only one interval
    if (sortedIntervals.length === 1) {
      return [...sortedIntervals]; // Return a copy to avoid reference issues
    }

    // Filter out invalid intervals (where startTime >= endTime)
    const validIntervals = sortedIntervals.filter(
      (interval) => interval.startTime < interval.endTime
    );

    if (validIntervals.length === 0) {
      return [];
    }

    if (validIntervals.length < sortedIntervals.length) {
    }

    const result = [validIntervals[0]];

    for (let i = 1; i < validIntervals.length; i++) {
      const current = validIntervals[i];
      const lastMerged = result[result.length - 1];

      // If current interval overlaps with the last merged interval, merge them
      // Consider an overlap if the start time of current is less than or equal to
      // the end time of the last merged interval (with a small tolerance for floating point precision)
      const EPSILON = 0.1; // Small tolerance for floating point comparison (100ms)

      if (current.startTime <= lastMerged.endTime + EPSILON) {
        // Merge by taking the maximum end time
        const oldEndTime = lastMerged.endTime;
        lastMerged.endTime = Math.max(lastMerged.endTime, current.endTime);
      } else {
        // If there's a gap between intervals, add the current interval to the result
        // This ensures we don't count skipped sections
        result.push(current);
      }
    }
    return result;
  }

  // Helper method to calculate total unique seconds watched
  calculateUniqueSecondsWatched(mergedIntervals) {
    // Calculate the sum of all interval durations
    const totalSeconds = mergedIntervals.reduce((total, interval) => {
      // Ensure we don't have negative durations due to floating point errors
      const duration = Math.max(0, interval.endTime - interval.startTime);
      return total + duration;
    }, 0);

    return totalSeconds;
  }
}

module.exports = new VideoService();
