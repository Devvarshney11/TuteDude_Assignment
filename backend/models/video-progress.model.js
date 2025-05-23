class VideoProgress {
  constructor(userId, videoId, uniqueSecondsWatched, lastPosition) {
    this.userId = userId;
    this.videoId = videoId;
    this.uniqueSecondsWatched = uniqueSecondsWatched;
    this.lastPosition = lastPosition;
  }
}

module.exports = VideoProgress;
