class WatchedInterval {
  constructor(id, userId, videoId, startTime, endTime) {
    this.id = id;
    this.userId = userId;
    this.videoId = videoId;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

module.exports = WatchedInterval;
